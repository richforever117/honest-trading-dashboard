const express = require('express');
const expressWs = require('express-ws');
const app = express();
expressWs(app);

class TradingSimulator {
  constructor() {
    this.balance = 10000;
    this.startingBalance = 10000;
    this.trades = [];
    this.wins = 0;
    this.losses = 0;
    this.totalFees = 0;
    this.activePositions = [];
    this.equityHistory = [{ timestamp: Date.now(), equity: this.balance }];
  }

  generateTrade() {
    const symbols = ['BTC', 'ETH', 'ADA', 'SOL', 'XRP', 'DOGE'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const entryPrice = Math.random() * 50000 + 100;
    
    // Realistic win rate: ~50-60% (not 83%)
    const isWin = Math.random() < 0.55;
    const priceChange = isWin 
      ? (Math.random() * 2 + 0.5) 
      : -(Math.random() * 3 + 0.5);
    
    const exitPrice = entryPrice * (1 + priceChange / 100);
    const grossProfit = (exitPrice - entryPrice) * quantity;
    const fee = Math.abs(grossProfit) * 0.001; // 0.1% fee
    const netProfit = grossProfit - fee;

    this.balance += netProfit;
    this.totalFees += fee;

    if (isWin) {
      this.wins++;
    } else {
      this.losses++;
    }

    const trade = {
      id: this.trades.length + 1,
      symbol,
      quantity,
      entryPrice: entryPrice.toFixed(2),
      exitPrice: exitPrice.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      fee: fee.toFixed(2),
      netProfit: netProfit.toFixed(2),
      type: isWin ? 'WIN' : 'LOSS',
      timestamp: Date.now(),
      winRate: ((this.wins / (this.wins + this.losses)) * 100).toFixed(1)
    };

    this.trades.push(trade);
    this.equityHistory.push({ timestamp: Date.now(), equity: this.balance });

    return trade;
  }

  getStats() {
    const totalTrades = this.wins + this.losses;
    const winRate = totalTrades > 0 ? ((this.wins / totalTrades) * 100).toFixed(2) : 0;
    const profitLoss = (this.balance - this.startingBalance).toFixed(2);
    const drawdown = this.calculateDrawdown();

    return {
      balance: this.balance.toFixed(2),
      startingBalance: this.startingBalance.toFixed(2),
      profitLoss,
      winRate: `${winRate}%`,
      wins: this.wins,
      losses: this.losses,
      totalTrades,
      totalFees: this.totalFees.toFixed(2),
      drawdown: `${drawdown.toFixed(2)}%`,
      status: 'LIVE',
      timestamp: Date.now()
    };
  }

  calculateDrawdown() {
    if (this.equityHistory.length === 0) return 0;
    const peak = Math.max(...this.equityHistory.map(e => e.equity));
    const drawdown = ((peak - this.balance) / peak) * 100;
    return Math.max(0, drawdown);
  }

  getRecentTrades(limit = 15) {
    return this.trades.slice(-limit).reverse();
  }
}

const simulator = new TradingSimulator();

app.ws('/ws', (ws, req) => {
  console.log('Client connected');
  
  const interval = setInterval(() => {
    const trade = simulator.generateTrade();
    const stats = simulator.getStats();
    
    ws.send(JSON.stringify({
      type: 'update',
      trade,
      stats,
      recentTrades: simulator.getRecentTrades()
    }));
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

app.get('/api/stats', (req, res) => {
  res.json(simulator.getStats());
});

app.get('/api/trades', (req, res) => {
  const limit = req.query.limit || 50;
  res.json(simulator.getRecentTrades(limit));
});

app.get('/api/equity-history', (req, res) => {
  res.json(simulator.equityHistory);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Trading engine running on port ${PORT}`);
});
