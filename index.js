const WebSocket = require('ws');
const port = process.env.PORT || 8080; // Use Render's assigned port
const server = new WebSocket.Server({ port });

let players = {};
let communityPredictions = { up: 0, down: 0 };
let leaderboard = [];

server.on('connection', (ws) => {
    console.log('New player connected');
    ws.send(JSON.stringify({
        type: 'init',
        players,
        communityPredictions
    }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'prediction') {
            communityPredictions[data.prediction === 'bull' ? 'up' : 'down']++;
            broadcast({ type: 'community', data: communityPredictions });
        } else if (data.type === 'submitScore') {
            players[data.playerId] = players[data.playerId] || { data: {} };
            players[data.playerId].data[data.timeframe || 86400] = {
                nickname: data.nickname,
                reputation: data.reputation
            };
            updateLeaderboard();
            broadcast({ type: 'leaderboard', data: leaderboard });
        }
    });

    ws.on('close', () => console.log('Player disconnected'));
});

function broadcast(data) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function updateLeaderboard() {
    leaderboard = Object.entries(players)
        .map(([id, player]) => [id, player.data[86400] || {}])
        .sort((a, b) => (b[1].reputation || 0) - (a[1].reputation || 0))
        .slice(0, 10);
}

console.log(`Server running on port ${port}`);
