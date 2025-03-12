const WebSocket = require('ws');
const http = require('http');
const Binance = require('node-binance-api');

const binance = new Binance();
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Momkin Trader WebSocket Server\n');
});

const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 8080;
const HEARTBEAT_INTERVAL = 30000;
const LEADERBOARD_UPDATE_INTERVAL = 60000;
let clients = new Map();
let communityPredictions = { up: 0, down: 0 }; // Persistent across connections
let leaderboard = {};

wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'] || Date.now().toString();
  clients.set(clientId, ws);
  console.log(`Client ${clientId} connected. Total clients: ${clients.size}`);

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to Momkin Trader!' }));
  ws.send(JSON.stringify({ type: 'community', data: communityPredictions }));
  broadcastLeaderboardToClient(ws);

  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    console.log(`Pong from ${clientId}`);
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received from ${clientId}:`, data);

      if (data.type === 'prediction') {
        if (data.prediction === 'bull') communityPredictions.up++;
        else if (data.prediction === 'bear') communityPredictions.down++;
        broadcast({ type: 'community', data: communityPredictions });
      } else if (data.type === 'submitScore') {
        updateLeaderboard(data);
        broadcastLeaderboard();
      }
    } catch (error) {
      console.error(`Message parse error from ${clientId}:`, error.message);
    }
  });

  ws.on('close', (code, reason) => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected. Code: ${code}, Reason: ${reason}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${clientId}:`, error.message);
  });
});

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((ws, id) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log(`Broadcast to ${id}:`, data);
    }
  });
}

function broadcastLeaderboardToClient(ws) {
  Object.keys(leaderboard).forEach(timeframe => {
    const scores = Object.entries(leaderboard[timeframe] || {})
      .sort((a, b) => b[1].reputation - a[1].reputation)
      .slice(0, 10);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'leaderboard', timeframe: parseInt(timeframe), data: scores }));
      console.log(`Sent leaderboard for timeframe ${timeframe} to client:`, scores);
    }
  });
}

function broadcastLeaderboard() {
  Object.keys(leaderboard).forEach(timeframe => {
    const scores = Object.entries(leaderboard[timeframe] || {})
      .sort((a, b) => b[1].reputation - a[1].reputation)
      .slice(0, 10);
    broadcast({ type: 'leaderboard', timeframe: parseInt(timeframe), data: scores });
  });
}

function updateLeaderboard(data) {
  const { playerId, nickname, reputation, timeframe } = data;
  if (!playerId || !timeframe || reputation === undefined) {
    console.error('Invalid submitScore data:', data);
    return;
  }
  if (!leaderboard[timeframe]) leaderboard[timeframe] = {};
  leaderboard[timeframe][playerId] = {
    nickname: nickname || 'Anonymous',
    reputation: parseFloat(reputation) || 0
  };
  console.log(`Leaderboard updated: ${playerId} - ${nickname} in timeframe ${timeframe} - Reputation: ${reputation}`);
}

setInterval(() => {
  clients.forEach((ws, id) => {
    if (!ws.isAlive) {
      console.log(`Terminating dead connection ${id}`);
      ws.terminate();
      clients.delete(id);
    } else {
      ws.isAlive = false;
      ws.ping();
      console.log(`Ping sent to ${id}`);
    }
  });
}, HEARTBEAT_INTERVAL);

setInterval(() => {
  broadcastLeaderboard();
}, LEADERBOARD_UPDATE_INTERVAL);

setInterval(() => {
  binance.prices('BTCUSDT', (error, ticker) => {
    if (error) {
      console.error('Binance API error:', error.body);
      return;
    }
    const price = parseFloat(ticker.BTCUSDT);
    broadcast({ type: 'price', price });
  });
}, 1000);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
});
