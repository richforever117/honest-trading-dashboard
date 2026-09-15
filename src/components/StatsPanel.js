import React from 'react';
import '../styles/StatsPanel.css';

const StatsPanel = ({ stats }) => {
  if (!stats) return null;

  const profitColor = parseFloat(stats.profitLoss) >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-label">BALANCE</div>
        <div className="stat-value">${parseFloat(stats.balance).toFixed(2)}</div>
        <div className="stat-sublabel">Started at ${stats.startingBalance}</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">PROFIT/LOSS</div>
        <div className="stat-value" style={{ color: profitColor }}>
          {parseFloat(stats.profitLoss) >= 0 ? '+' : ''}
          ${stats.profitLoss}
        </div>
        <div className="stat-sublabel">Net P&L</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">WIN RATE</div>
        <div className="stat-value">{stats.winRate}</div>
        <div className="stat-sublabel">{stats.wins}W / {stats.losses}L ({stats.totalTrades} trades)</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">DRAWDOWN</div>
        <div className="stat-value">{stats.drawdown}</div>
        <div className="stat-sublabel">Max peak-to-trough decline</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">TOTAL FEES</div>
        <div className="stat-value">${stats.totalFees}</div>
        <div className="stat-sublabel">0.1% per trade</div>
      </div>
    </div>
  );
};

export default StatsPanel;
