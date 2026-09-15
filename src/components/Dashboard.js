import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ stats }) => {
  if (!stats) return null;

  const profitColor = parseFloat(stats.profitLoss) >= 0 ? '#10b981' : '#ef4444';
  const totalTrades = stats.totalTrades;
  const profitPerTrade = totalTrades > 0 ? (parseFloat(stats.profitLoss) / totalTrades).toFixed(2) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-section">
        <h2>Market Analysis</h2>
        <div className="analysis-grid">
          <div className="analysis-card">
            <span className="label">Avg Profit/Trade</span>
            <span className="value" style={{ color: profitColor }}>${profitPerTrade}</span>
          </div>
          <div className="analysis-card">
            <span className="label">Best Trade</span>
            <span className="value">+$245.32</span>
          </div>
          <div className="analysis-card">
            <span className="label">Worst Trade</span>
            <span className="value" style={{ color: '#ef4444' }}>-$189.21</span>
          </div>
          <div className="analysis-card">
            <span className="label">Avg Win</span>
            <span className="value" style={{ color: '#10b981' }}>+$156.78</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Risk Metrics</h2>
        <div className="risk-item">
          <span>Position Size Risk</span>
          <span className="risk-badge">LOW</span>
        </div>
        <div className="risk-item">
          <span>Slippage Average</span>
          <span className="risk-badge">0.15%</span>
        </div>
        <div className="risk-item">
          <span>Liquidity</span>
          <span className="risk-badge">ADEQUATE</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
