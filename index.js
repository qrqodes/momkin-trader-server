<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MOMKIN TRADER</title>
    <script src="https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js"></script>
    <link rel="icon" href="https://www.google.com/favicon.ico" type="image/x-icon">
    <style>
        /* Your original CSS - unchanged */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Orbitron', sans-serif;
            background: linear-gradient(135deg, #0a0e17 0%, #1c2526 50%, #2a3439 100%);
            color: #00e6b8;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
        }
        #timeframeSelection {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
            font-family: 'VT323', monospace;
        }
        #timeframeSelection h1 {
            font-size: clamp(3em, 10vw, 5em);
            color: #00e6b8;
            text-shadow: 0 0 10px #ff007a, 4px 4px 0 #000;
            letter-spacing: 4px;
            margin-bottom: 20px;
        }
        #timeframeSelection p {
            font-size: 1em;
            margin-bottom: 20px;
            color: #fff;
            text-shadow: 1px 1px 0 #000;
            max-width: 80%;
            text-align: center;
        }
        #timeframeSelection label {
            font-size: clamp(1.5em, 4vw, 2em);
            color: #fff;
            text-shadow: 2px 2px 0 #000;
            margin-bottom: 10px;
        }
        #timeframeSelection select {
            font-size: clamp(1.2em, 3vw, 1.5em);
            padding: 10px 20px;
            border: 4px solid #000;
            background: #2a3439;
            color: #00e6b8;
            cursor: pointer;
            box-shadow: 4px 4px 0 #000;
            width: 200px;
            text-align: center;
            font-family: 'VT323', monospace;
        }
        #startGame {
            font-size: clamp(1.5em, 4vw, 2em);
            padding: 15px 30px;
            background: #ff007a;
            border: 4px solid #000;
            color: #fff;
            cursor: pointer;
            box-shadow: 4px 4px 0 #000;
            margin-top: 10px;
            font-family: 'VT323', monospace;
        }
        #gameContent {
            padding: 10px;
            text-align: center;
            background: rgba(10, 14, 23, 0.95);
            border-radius: 20px;
            margin: 10px auto;
            box-shadow: 0 0 60px rgba(0, 230, 184, 0.5), inset 0 0 15px rgba(255, 0, 122, 0.3);
            max-width: 100vw;
            height: calc(100vh - 40px);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            position: relative;
            z-index: 1;
        }
        button {
            font-size: clamp(0.8em, 2.5vw, 1.1em);
            padding: 10px 20px;
            border: none;
            border-radius: 12px;
            color: #0a0e17;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 5px;
            box-shadow: 0 0 20px rgba(0, 230, 184, 0.5);
            background: linear-gradient(45deg, #00e6b8, #00b38f);
            z-index: 100;
        }
        button:hover:not(.disabled) {
            transform: translateY(-3px);
            box-shadow: 0 0 30px rgba(0, 230, 184, 0.9);
        }
        #statsButton, #resetButton { background: linear-gradient(45deg, #00e6b8, #00b38f); }
        #musicButton { background: linear-gradient(45deg, #b300ff, #8000b3); }
        button.bull { background: linear-gradient(45deg, #00e6b8, #00b38f); }
        button.bear { background: linear-gradient(45deg, #ff007a, #b3005c); }
        button.disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; background: #666; }
        #chart {
            width: 90vw;
            max-width: 100vw;
            height: 50vh;
            background: #1c2526;
            border-radius: 15px;
            box-shadow: 0 0 40px rgba(0, 230, 184, 0.4), inset 0 0 10px rgba(255, 0, 122, 0.2);
            z-index: 10;
            margin: 0 auto;
        }
        #buttons {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
            padding: 10px;
            max-width: 100vw;
            z-index: 100;
            position: relative;
        }
        #timer, #currentPrice, #result, .timer-line {
            font-size: clamp(0.7em, 1.8vw, 1em);
            margin: 2px 0;
            text-shadow: 0 0 10px rgba(0, 230, 184, 0.7);
        }
        #statsMenu {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1c2526;
            padding: 20px;
            border: 4px solid #000;
            box-shadow: 8px 8px 0 #000;
            z-index: 50;
            max-height: 80vh;
            overflow-y: auto;
            color: #00e6b8;
            font-family: 'VT323', monospace;
            width: 340px;
            text-align: left;
        }
        #statsMenu h2 {
            font-size: 2em;
            color: #ff007a;
            text-shadow: 2px 2px 0 #000;
            margin-bottom: 15px;
        }
        #statsMenu p, #leaderboardList li {
            font-size: 1.2em;
            margin: 5px 0;
            color: #00e6b8;
            text-shadow: 1px 1px 0 #000;
        }
        #statsMenu .highlight {
            color: #ffcc00;
            text-shadow: 2px 2px 0 #000;
            font-weight: bold;
        }
        #statsMenu .section {
            margin-top: 10px;
        }
        #statsMenu button {
            font-size: 1.2em;
            padding: 10px 20px;
            border: 2px solid #000;
            background: linear-gradient(45deg, #ff007a, #cc005c);
            color: #fff;
            box-shadow: 4px 4px 0 #000;
            margin: 5px;
            font-family: 'VT323', monospace;
        }
        #statsMenu button:hover:not(.disabled) {
            transform: translateY(-2px);
            box-shadow: 6px 6px 0 #000;
        }
        #statsMenu input {
            font-size: 1em;
            padding: 8px;
            margin: 5px 0;
            border: 2px solid #000;
            background: #2a3439;
            color: #00e6b8;
            box-shadow: 2px 2px 0 #000;
            font-family: 'VT323', monospace;
            width: 100%;
        }
        @media (max-width: 1284px) {
            #gameContent, #timeframeSelection { padding: 8px; }
            #chart { height: 45vh; width: 85vw; }
            button { padding: 6px 15px; margin: 3px; }
            #timeframeSelection h1 { font-size: clamp(3em, 10vw, 6em); margin-bottom: 30px; }
            #timeframeSelection select { width: 220px; }
            #startGame { padding: 20px; }
            #buttons { margin-top: 25px; }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=VT323&display=swap" rel="stylesheet">
</head>
<body>
    <div id="timeframeSelection">
        <h1>MOMKIN TRADER</h1>
        <p>Predict BTCUSDT movement! Vote BULL (up) or BEAR (down) within the first 25% of each candle.</p>
        <label for="timeframe">Select Timeframe:</label>
        <select id="timeframe">
            <option value="60">1 Minute</option>
            <option value="300">5 Minutes</option>
            <option value="900">15 Minutes</option>
            <option value="86400" selected>1 Day</option>
            <option value="604800">1 Week</option>
            <option value="2592000">1 Month</option>
        </select>
        <button id="startGame" onclick="startGame()">PLAY</button>
    </div>
    
    <div id="gameContent" style="display: none;">
        <div id="timer">
            <div class="timer-line">Local Time: <span id="localTime">-</span></div>
            <div class="timer-line">Time left to vote: <span id="voteTimeLeft">-</span></div>
            <div class="timer-line">Time until next candle: <span id="candleTimeLeft">-</span></div>
        </div>
        <div id="chart"></div>
        <div id="buttons"></div>
        <div id="currentPrice">Current Price: $0.00</div>
        <div id="result">-</div>
        <div id="error" style="display: none; color: #ff007a;"></div>
        <div id="loading">Syncing...</div>
    </div>
    
    <div id="statsMenu">
        <h2>Statistics</h2>
        <p>Current Price: <span id="statsPrice">0.00</span></p>
        <p>All Players Positions: Bull <span id="bullPct">0.0%</span> | Bear <span id="bearPct">0.0%</span></p>
        <p><span class="highlight">Your Current Position:</span> <span id="yourPosition">-</span></p>
        <p><span class="highlight">Total Win Rate:</span> <span id="totalWinRate">0.0%</span></p>
        <p><span class="highlight">Total Reputation:</span> <span id="totalReputation">0.0</span></p>
        <p><span class="highlight" id="timeframeWinRateLabel">Win Rate:</span> <span id="winRate">0.0%</span></p>
        <p><span class="highlight" id="timeframeReputationLabel">Reputation:</span> <span id="reputation">0.0</span></p>
        <p class="section"><span class="highlight">Balance:</span></p>
        <p>$FAKEBTC: <span id="fakeBTC">1.0087</span></p>
        <p>$FAKEUSDT: <span id="fakeUSDT">0.00</span></p>
        <p class="section"><span class="highlight">Coins Earned:</span></p>
        <p>🐂 Bull Coins: <span id="bullCoins">0</span> (Wins: <span id="bullWins">0</span> | Win Rate: <span id="bullWinRate">0.0%</span>)</p>
        <p>🐻 Bear Coins: <span id="bearCoins">0</span> (Wins: <span id="bearWins">0</span> | Win Rate: <span id="bearWinRate">0.0%</span>)</p>
        <p class="section"><span class="highlight">Leaderboard (Top 10):</span></p>
        <ul id="leaderboardList"></ul>
        <p>Your Name: <input type="text" id="editNameInput" value="Momkin Trader 1"></p>
        <p>Nickname: <input type="text" id="nicknameInput" value="PolyglotPepe"></p>
        <div class="button-container">
            <button onclick="saveNameAndNickname()">Save</button>
            <button onclick="resetGame()">Reset Game</button>
            <button onclick="closeStatsMenu()">Close</button>
        </div>
    </div>
    
    <audio id="bgMusic" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>
    
    <script>
        let chart = null, series = null, prices = [], lastClose = 0, lastPrediction = null, selectedTimeframe = null, timerIntervalId = null;
        let lastCandleTime = 0, hasVoted = false, players = {}, playerId = null; // Will set via getPlayerId()
        const BUENOS_AIRES_OFFSET = -3 * 3600;
        let musicPlaying = false;
        const communityPredictions = { up: 0, down: 0 };
        const binanceUrl = "https://api.binance.com/api/v3/klines";
        const cryptoPair = "BTCUSDT";
        const timeframes = [60, 300, 900, 86400, 604800, 2592000];
        const sounds = { bg: document.getElementById("bgMusic") };
        const wsUrl = 'wss://qr-yl7q.onrender.com';
        let ws, wsRetryCount = 0;

        // Persistent player ID
        function getPlayerId() {
            let storedId = localStorage.getItem("momkinTraderPlayerId");
            if (!storedId) {
                storedId = `Player_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem("momkinTraderPlayerId", storedId);
            }
            return storedId;
        }

        function connectWebSocket(attempt = 1) {
            ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                console.log("Connected to server");
                wsRetryCount = 0;
                const playerData = players[playerId]?.data[selectedTimeframe] || { nickname: "PolyglotPepe", reputation: 0 };
                ws.send(JSON.stringify({ 
                    type: "submitScore", 
                    playerId, 
                    nickname: playerData.nickname, 
                    reputation: playerData.reputation, 
                    timeframe: selectedTimeframe || 86400 // Default to 1 day if not set
                }));
            };
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "init") {
                    players = data.players || players;
                    Object.assign(communityPredictions, data.communityPredictions);
                    updateCommunity();
                } else if (data.type === "leaderboard" && data.timeframe === selectedTimeframe) { // Filter by timeframe
                    updateLeaderboard(data.data);
                } else if (data.type === "community") {
                    Object.assign(communityPredictions, data.data);
                    updateCommunity();
                }
            };
            ws.onclose = (event) => {
                console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason, "Reconnecting...");
                wsRetryCount++;
                if (wsRetryCount >= 5) showError("Server offline. Multiplayer features disabled.");
                setTimeout(() => connectWebSocket(attempt + 1), Math.min(attempt * 1000, 10000));
            };
            ws.onerror = (error) => {
                console.error("WebSocket error details:", error);
                showError("Server connection lost. Reconnecting...");
            };
        }

        function savePlayerData() {
            if (selectedTimeframe && players[playerId] && players[playerId].data[selectedTimeframe]) {
                players[playerId].data[selectedTimeframe].trades = players[playerId].data[selectedTimeframe].trades.slice(-100);
                localStorage.setItem("momkinTraderData", JSON.stringify(players));
                submitLeaderboardScore();
            }
        }

        function initializePlayerData() {
            const defaultData = {
                reputation: 0,
                bull: 0,
                bear: 0,
                fakeBTC: 1.0087,
                fakeUSDT: 0.0,
                wins: { bull: 0, bear: 0 },
                trades: [],
                nickname: "PolyglotPepe",
                lastPrediction: null
            };
            if (!players[playerId]) players[playerId] = { data: {} };
            timeframes.forEach(tf => {
                players[playerId].data[tf] = players[playerId].data[tf] || { ...defaultData };
            });
            players[playerId].data[86400].bull = 5;
            players[playerId].data[86400].bear = 2;
            savePlayerData();
        }

        function loadPlayerData() {
            playerId = getPlayerId(); // Set persistent playerId
            const savedData = localStorage.getItem("momkinTraderData");
            if (savedData) {
                players = JSON.parse(savedData);
                if (!players[playerId]) initializePlayerData(); // Ensure playerId exists
            } else {
                initializePlayerData();
            }
            updateLocalTime();
        }

        document.addEventListener("DOMContentLoaded", () => {
            loadPlayerData();
            renderButtons();
            updateLocalTime();
            Notification.requestPermission();
            connectWebSocket();
        });

        function startGame() {
            selectedTimeframe = parseInt(document.getElementById("timeframe").value);
            document.getElementById("timeframeSelection").style.display = "none";
            document.getElementById("gameContent").style.display = "block";
            
            if (!chart) {
                chart = LightweightCharts.createChart(document.getElementById("chart"), {
                    width: window.innerWidth * 0.9,
                    height: window.innerHeight * 0.5,
                    layout: { backgroundColor: "#1c2526", textColor: "#00e6b8" },
                    grid: { vertLines: { color: "rgba(0, 230, 184, 0.1)" }, horzLines: { color: "rgba(0, 230, 184, 0.1)" } },
                    timeScale: { timeVisible: true, secondsVisible: true },
                    rightPriceScale: { visible: true, borderColor: "#00e6b8" }
                });
                series = chart.addCandlestickSeries({
                    upColor: "#00e6b8",
                    downColor: "#ff007a",
                    borderVisible: false,
                    wickUpColor: "#00e6b8",
                    wickDownColor: "#ff007a"
                });
            }
            
            fetchInitialData().then(() => {
                initializeVotingState();
                startCandleTimer();
                renderButtons();
                setupPredictionButtons();
                updateStats();
                startPriceStream();
            }).catch(error => {
                console.error("Game init error:", error);
                showError("Failed to start game. Retrying...");
            });
            
            setInterval(updateLocalTime, 1000);
            window.addEventListener("resize", () => chart && chart.resize(window.innerWidth * 0.9, window.innerHeight * 0.5));
        }

        function updateLocalTime() {
            const now = new Date();
            const localTime = new Date(now.getTime() + BUENOS_AIRES_OFFSET * 1000);
            document.getElementById("localTime").textContent = localTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
        }

        async function fetchInitialData() {
            document.getElementById("loading").style.display = "block";
            prices = [];
            series.setData([]);
            try {
                const interval = { 60: "1m", 300: "5m", 900: "15m", 86400: "1d", 604800: "1w", 2592000: "1M" }[selectedTimeframe];
                const url = `${binanceUrl}?symbol=${cryptoPair}&interval=${interval}&limit=100`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                prices = data.map(([time, open, high, low, close]) => ({
                    time: Math.floor(time / 1000),
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close)
                })).filter(c => c && "time" in c && !isNaN(c.close));
                if (prices.length === 0) throw new Error("No valid data");
                const now = Math.floor(Date.now() / 1000) + BUENOS_AIRES_OFFSET;
                lastCandleTime = prices[prices.length - 1].time;
                if (lastCandleTime > now) lastCandleTime = now - (now % selectedTimeframe);
                lastClose = prices[prices.length - 1].close;
                console.log("Initial fetch: lastCandleTime:", lastCandleTime, "Now:", now, "Last close:", lastClose);
                series.setData(prices);
                document.getElementById("currentPrice").textContent = `Current Price (BTCUSDT): $${lastClose.toFixed(2)}`;
                document.getElementById("statsPrice").textContent = lastClose.toFixed(2);
            } catch (error) {
                console.error("Fetch initial error:", error);
                showError("Failed to fetch data. Retrying...");
                setTimeout(fetchInitialData, 5000);
                throw error;
            } finally {
                document.getElementById("loading").style.display = "none";
            }
        }

        function startPriceStream() {
            const wsBinance = new WebSocket(`wss://stream.binance.com:9443/ws/${cryptoPair.toLowerCase()}@kline_${selectedTimeframe === 60 ? '1m' : selectedTimeframe === 300 ? '5m' : selectedTimeframe === 900 ? '15m' : '1d'}`);
            wsBinance.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.k) {
                    const candle = data.k;
                    const newCandle = {
                        time: Math.floor(candle.t / 1000),
                        open: parseFloat(candle.o),
                        high: parseFloat(candle.h),
                        low: parseFloat(candle.l),
                        close: parseFloat(candle.c)
                    };
                    console.log("Binance candle:", newCandle);
                    updatePrice(newCandle);
                }
            };
            wsBinance.onerror = (error) => {
                console.error("Binance WebSocket error:", error);
                wsBinance.close();
                setTimeout(startPriceStream, 1000);
            };
            wsBinance.onclose = () => {
                console.log("Binance WebSocket closed. Reconnecting...");
                setTimeout(startPriceStream, 1000);
            };
        }

        function updatePrice(candle) {
            const now = Math.floor(Date.now() / 1000) + BUENOS_AIRES_OFFSET;
            const nextCandleTime = lastCandleTime + selectedTimeframe;
            console.log("updatePrice: now:", now, "lastCandleTime:", lastCandleTime, "nextCandleTime:", nextCandleTime, "candle.time:", candle.time);
            
            if (candle.time > now + selectedTimeframe) {
                console.warn("Candle too far in future:", candle.time, "vs now:", now);
                return;
            }
            
            if (candle.time >= nextCandleTime && candle.time > Math.max(...prices.map(p => p.time))) {
                prices.push(candle);
                series.update(candle);
                evaluatePrediction(candle);
                lastCandleTime = candle.time;
                lastClose = candle.close;
                hasVoted = false;
                disableButtons(false);
                updateStats();
                savePlayerData();
                console.log("New candle added. lastCandleTime:", lastCandleTime, "hasVoted:", hasVoted);
            } else if (candle.time === lastCandleTime) {
                prices[prices.length - 1] = candle;
                series.update(candle);
                lastClose = candle.close;
                console.log("Updated existing candle:", candle.time);
            } else {
                console.warn("Candle ignored:", candle.time, "not in expected range");
            }
            
            document.getElementById("currentPrice").textContent = `Current Price (BTCUSDT): $${lastClose.toFixed(2)}`;
            document.getElementById("statsPrice").textContent = lastClose.toFixed(2);
        }

        function formatTime(seconds) {
            return `${seconds}s`;
        }

        function startCandleTimer() {
            if (timerIntervalId) clearInterval(timerIntervalId);
            
            let serverTime = null;
            const TIME_API_URL = 'https://api.binance.com/api/v3/time';
            const SYNC_INTERVAL = 60000;
            
            async function fetchServerTime() {
                try {
                    const response = await fetch(TIME_API_URL);
                    const data = await response.json();
                    serverTime = Math.floor(data.serverTime / 1000);
                    console.log("Fetched server time:", serverTime);
                    return serverTime;
                } catch (error) {
                    console.error("Failed to fetch server time:", error);
                    return null;
                }
            }
            
            fetchServerTime().then((initialTime) => {
                if (initialTime !== null) {
                    if (!lastCandleTime || lastCandleTime > initialTime) {
                        lastCandleTime = initialTime - (initialTime % selectedTimeframe);
                        console.log("Initialized lastCandleTime from server:", lastCandleTime);
                    }
                    serverTime = initialTime;
                    updateTimer();
                    timerIntervalId = setInterval(updateTimer, 1000);
                } else {
                    console.error("Initial server time fetch failed. Timer not started.");
                    showError("Failed to sync time. Retrying...");
                    setTimeout(startCandleTimer, 5000);
                }
            });
            
            setInterval(() => {
                fetchServerTime().then((newTime) => {
                    if (newTime !== null) serverTime = newTime;
                });
            }, SYNC_INTERVAL);
            
            const updateTimer = () => {
                if (serverTime === null) return;
                
                let now = serverTime;
                let secondsSinceLast = now - lastCandleTime;
                console.log("Timer: now:", now, "lastCandleTime:", lastCandleTime, "secondsSinceLast:", secondsSinceLast, "hasVoted:", hasVoted);
                
                if (secondsSinceLast < 0) {
                    lastCandleTime = now - (now % selectedTimeframe);
                    secondsSinceLast = now - lastCandleTime;
                    console.log("Reset lastCandleTime to:", lastCandleTime, "due to future timestamp");
                }
                
                let secondsLeft = selectedTimeframe - (secondsSinceLast % selectedTimeframe);
                const voteTimeLeft = Math.max(0, Math.floor(selectedTimeframe * 0.25 - secondsSinceLast));
                
                if (secondsSinceLast >= selectedTimeframe) {
                    const periodsElapsed = Math.floor(secondsSinceLast / selectedTimeframe);
                    const newCandleTime = lastCandleTime + (periodsElapsed * selectedTimeframe);
                    const newCandle = {
                        time: newCandleTime,
                        open: lastClose,
                        high: lastClose,
                        low: lastClose,
                        close: lastClose
                    };
                    prices.push(newCandle);
                    series.update(newCandle);
                    evaluatePrediction(newCandle);
                    lastCandleTime = newCandleTime;
                    secondsSinceLast = now - lastCandleTime;
                    secondsLeft = selectedTimeframe - secondsSinceLast;
                    hasVoted = false;
                    disableButtons(false);
                    updateStats();
                    savePlayerData();
                    console.log("New candle started. lastCandleTime:", lastCandleTime, "secondsLeft:", secondsLeft, "hasVoted:", hasVoted);
                }
                
                document.getElementById("voteTimeLeft").textContent = formatTime(voteTimeLeft);
                document.getElementById("candleTimeLeft").textContent = formatTime(secondsLeft);
                disableButtons(voteTimeLeft <= 0 || hasVoted);
                
                if (voteTimeLeft > 0 && voteTimeLeft <= 300 && !hasVoted && Notification.permission === "granted") {
                    new Notification("Momkin Trader", { body: "Less than 5 minutes to vote Bull or Bear!" });
                }
                
                serverTime += 1;
            };
        }

        function initializeVotingState() {
            if (!selectedTimeframe) return;
            const now = Math.floor(Date.now() / 1000) + BUENOS_AIRES_OFFSET;
            const secondsSinceLast = now - lastCandleTime;
            hasVoted = players[playerId].data[selectedTimeframe].trades.some(t => t.time >= lastCandleTime && t.outcome === null);
            disableButtons(secondsSinceLast > selectedTimeframe * 0.25 || hasVoted);
            updateStats();
        }

        function showStats() {
            updateStats();
            document.getElementById("statsMenu").style.display = "block";
        }

        function setupPredictionButtons() {
            document.querySelectorAll("button.bull").forEach(btn => {
                btn.onclick = () => {
                    if (!btn.classList.contains("disabled")) {
                        predict("bull");
                    }
                };
            });
            document.querySelectorAll("button.bear").forEach(btn => {
                btn.onclick = () => {
                    if (!btn.classList.contains("disabled")) {
                        predict("bear");
                    }
                };
            });
            document.getElementById("musicButton").onclick = toggleMusic;
            document.getElementById("statsButton").onclick = showStats;
        }

        function predict(type) {
            if (hasVoted || !selectedTimeframe || !["bull", "bear"].includes(type)) return;
            const now = Math.floor(Date.now() / 1000) + BUENOS_AIRES_OFFSET;
            const secondsSinceLast = now - lastCandleTime;
            if (secondsSinceLast > selectedTimeframe * 0.25) {
                document.getElementById("result").textContent = "Too late to vote this candle!";
                return;
            }
            hasVoted = true;
            disableButtons(true);
            lastPrediction = type;
            players[playerId].data[selectedTimeframe].lastPrediction = type;
            players[playerId].data[selectedTimeframe].trades.push({
                prediction: type,
                votePrice: lastClose,
                closePrice: null,
                outcome: null,
                time: now,
                candleTime: lastCandleTime
            });
            updateResultText();
            updatePlayerBalance(type);
            players[playerId].data[selectedTimeframe][type]++;
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "prediction", prediction: type }));
            }
            savePlayerData();
            updateStats();
            updateCommunity();
        }

        function updateResultText() {
            const result = document.getElementById("result");
            if (lastPrediction === "bull") {
                result.textContent = "Your Position: BULL";
                document.getElementById("yourPosition").textContent = "BULL";
            } else if (lastPrediction === "bear") {
                result.textContent = "Your Position: BEAR";
                document.getElementById("yourPosition").textContent = "BEAR";
            }
        }

        function evaluatePrediction(newCandle) {
            if (!selectedTimeframe) return;
            const player = players[playerId].data[selectedTimeframe];
            const trade = player.trades.find(t => t.candleTime === lastCandleTime && t.outcome === null);
            if (trade) {
                trade.closePrice = newCandle.close;
                const movement = newCandle.close - trade.votePrice;
                let correct = false;
                if (trade.prediction === "bull" && movement > 0) {
                    correct = true;
                    player.wins.bull++;
                } else if (trade.prediction === "bear" && movement < 0) {
                    correct = true;
                    player.wins.bear++;
                }
                trade.outcome = correct ? 1 : 0;
                player.reputation += correct ? 1 : -0.5;
                document.getElementById("result").textContent = correct ? `Success: ${trade.prediction.toUpperCase()}!` : `Failed: ${trade.prediction.toUpperCase()}!`;
                savePlayerData();
                updateStats();
            }
        }

        function updatePlayerBalance(prediction) {
            const player = players[playerId].data[selectedTimeframe];
            const currentPrice = lastClose;
            if (prediction === "bull") {
                player.fakeBTC += player.fakeUSDT / currentPrice;
                player.fakeUSDT = 0;
            } else if (prediction === "bear") {
                player.fakeUSDT += player.fakeBTC * currentPrice;
                player.fakeBTC = 0;
            }
            document.getElementById("fakeBTC").textContent = player.fakeBTC.toFixed(4);
            document.getElementById("fakeUSDT").textContent = player.fakeUSDT.toFixed(2);
            savePlayerData();
        }

        function updateStats() {
            if (!selectedTimeframe) return;
            const player = players[playerId].data[selectedTimeframe];
            const completedTrades = player.trades.filter(trade => trade.outcome !== null);
            const totalTrades = completedTrades.length;
            const totalWins = completedTrades.reduce((sum, trade) => sum + (trade.outcome === 1 ? 1 : 0), 0);
            const winRate = totalTrades > 0 ? (totalWins / totalTrades * 100).toFixed(1) : 0;
            
            let totalTradesAcrossAll = 0, totalWinsAcrossAll = 0, totalReputation = 0;
            timeframes.forEach(tf => {
                const tfTrades = players[playerId].data[tf].trades.filter(trade => trade.outcome !== null);
                totalTradesAcrossAll += tfTrades.length;
                totalWinsAcrossAll += tfTrades.reduce((sum, trade) => sum + (trade.outcome === 1 ? 1 : 0), 0);
                totalReputation += players[playerId].data[tf].reputation;
            });
            const totalWinRate = totalTradesAcrossAll > 0 ? (totalWinsAcrossAll / totalTradesAcrossAll * 100).toFixed(1) : 0;
            
            document.getElementById("totalWinRate").textContent = `${totalWinRate}%`;
            document.getElementById("totalReputation").textContent = totalReputation.toFixed(1);
            document.getElementById("winRate").textContent = `${winRate}%`;
            document.getElementById("reputation").textContent = player.reputation.toFixed(1);
            document.getElementById("bullCoins").textContent = player.bull;
            document.getElementById("bearCoins").textContent = player.bear;
            document.getElementById("fakeBTC").textContent = player.fakeBTC.toFixed(4);
            document.getElementById("fakeUSDT").textContent = player.fakeUSDT.toFixed(2);
            document.getElementById("bullWins").textContent = player.wins.bull;
            document.getElementById("bullWinRate").textContent = (player.trades.filter(t => t.prediction === "bull").length > 0 ? (player.wins.bull / player.trades.filter(t => t.prediction === "bull").length * 100).toFixed(1) : 0) + "%";
            document.getElementById("bearWins").textContent = player.wins.bear;
            document.getElementById("bearWinRate").textContent = (player.trades.filter(t => t.prediction === "bear").length > 0 ? (player.wins.bear / player.trades.filter(t => t.prediction === "bear").length * 100).toFixed(1) : 0) + "%";
            document.getElementById("yourPosition").textContent = player.lastPrediction ? player.lastPrediction.toUpperCase() : "-";
            updateTimeframeLabels();
            updateCommunity();
        }

        function updateCommunity() {
            const total = (communityPredictions.up || 0) + (communityPredictions.down || 0) || 1;
            document.getElementById("bullPct").textContent = ((communityPredictions.up / total) * 100).toFixed(1) + "%";
            document.getElementById("bearPct").textContent = ((communityPredictions.down / total) * 100).toFixed(1) + "%";
        }

        function updateTimeframeLabels() {
            const label = { 60: "1-Minute", 300: "5-Minute", 900: "15-Minute", 86400: "Daily", 604800: "Weekly", 2592000: "Monthly" }[selectedTimeframe] || "Unknown";
            document.getElementById("timeframeWinRateLabel").textContent = `${label} Win Rate:`;
            document.getElementById("timeframeReputationLabel").textContent = `${label} Reputation:`;
        }

        function disableButtons(state) {
            document.querySelectorAll("button.bull, button.bear").forEach(btn => {
                btn.classList[state ? "add" : "remove"]("disabled");
            });
        }

        function showError(message) {
            const errorElement = document.getElementById("error");
            errorElement.textContent = message;
            errorElement.style.display = "block";
            setTimeout(() => errorElement.style.display = "none", 5000);
        }

        function closeStatsMenu() {
            document.getElementById("statsMenu").style.display = "none";
        }

        function resetGame() {
            players = {};
            hasVoted = false;
            lastPrediction = null;
            initializePlayerData();
            updateStats();
            closeStatsMenu();
        }

        function saveNameAndNickname() {
            const newName = document.getElementById("editNameInput").value.trim();
            const newNickname = document.getElementById("nicknameInput").value.trim();
            if (newName && newName !== playerId) {
                players[newName] = players[playerId];
                delete players[playerId];
                playerId = newName;
            }
            timeframes.forEach(tf => players[playerId].data[tf].nickname = newNickname || "PolyglotPepe");
            savePlayerData();
            updateStats();
            closeStatsMenu();
        }

        function submitLeaderboardScore() {
            const playerData = players[playerId].data[selectedTimeframe];
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "submitScore",
                    playerId,
                    nickname: playerData.nickname,
                    reputation: playerData.reputation,
                    timeframe: selectedTimeframe
                }));
            }
        }

        function updateLeaderboard(data) {
            const leaderboardList = document.getElementById("leaderboardList");
            leaderboardList.innerHTML = data.map((entry, index) => 
                `<li>${index + 1}. ${entry[1].nickname}: ${entry[1].reputation.toFixed(1)}</li>`
            ).join("");
        }

        function renderButtons() {
            document.getElementById("buttons").innerHTML = `
                <button class="bull disabled">🐂 BULL</button>
                <button class="bear disabled">🐻 BEAR</button>
                <button id="statsButton">Stats</button>
                <button id="musicButton">Music: OFF</button>
            `;
        }

        function toggleMusic() {
            if (!musicPlaying) {
                sounds.bg.volume = 0.3;
                sounds.bg.play().catch(error => console.error("Music playback failed:", error));
                document.getElementById("musicButton").textContent = "Music: ON";
                musicPlaying = true;
            } else {
                sounds.bg.pause();
                sounds.bg.currentTime = 0;
                document.getElementById("musicButton").textContent = "Music: OFF";
                musicPlaying = false;
            }
        }

        window.addEventListener("unload", () => {
            if (timerIntervalId) clearInterval(timerIntervalId);
        });
    </script>
</body>
</html>
