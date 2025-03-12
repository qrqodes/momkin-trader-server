const WebSocket = require('ws');
const http = require('http');
const Binance = require('node-binance-api');

// Initialize Binance API
const binance = new Binance();

// Create an HTTP server (Render/Heroku require this for WebSocket upgrades)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Momkin Trader WebSocket Server\n');
});

// Bind WebSocket server to HTTP server
const wss = new WebSocket.Server({ server });

// Environment setup
const PORT = process.env.PORT || 8080; // Render/Heroku assign PORT dynamically
const HEARTBEAT_INTERVAL = 30000; // 30s heartbeat to keep connections alive
let clients = new Map(); // Track connected clients
let communityPredictions = { up: 0, down: 0 }; // Store community data

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'] || Date.now().toString();
  clients.set(clientId, ws);
  console.log(`Client ${clientId} connected. Total clients: ${clients.size}`);

  // Send initial welcome message and community data
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to Momkin Trader!' }));
  ws.send(JSON.stringify({ type: 'community', data: communityPredictions }));

  // Heartbeat to keep connection alive
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    console.log(`Pong from ${clientId}`);
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received from ${clientId}:`, data);

      if (data.type === 'prediction') {
        if (data.prediction === 'bull') communityPredictions.up++;
        else if (data.prediction === 'bear') communityPredictions.down++;
        broadcast({ type: 'community', data: communityPredictions });
      } else if (data.type === 'submitScore') {
        console.log(`Score from ${data.playerId}: ${data.reputation}`);
        // Add leaderboard logic here if needed
      }
    } catch (error) {
      console.error(`Message parse error from ${clientId}:`, error.message);
    }
  });

  // Handle client disconnection
  ws.on('close', (code, reason) => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected. Code: ${code}, Reason: ${reason}, Total clients: ${clients.size}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${clientId}:`, error.message);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((ws, id) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log(`Sent to ${id}:`, data);
    }
  });
}

// Heartbeat to detect dead connections
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

// Fetch and broadcast BTCUSDT price every second
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

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
});