import React from 'react';
import '../styles/TradeHistory.css';

const TradeHistory = ({ trades, lastUpdate }) => {
  return (
    <div className="trade-history">
      <div className="trade-history-header">
        <h2>Recent Trades</h2>
        {lastUpdate && <span className="last-update">Updated: {lastUpdate}</span>}
      </div>
      
      <div className="trade-table">
        <div className="trade-row trade-header">
          <div className="trade-cell">Symbol</div>
          <div className="trade-cell">Entry</div>
          <div className="trade-cell">Exit</div>
          <div className="trade-cell">Qty</div>
          <div className="trade-cell">P&L</div>
          <div className="trade-cell">Fee</div>
          <div className="trade-cell">Result</div>
        </div>

        {trades.map((trade) => (
          <div key={trade.id} className="trade-row">
            <div className="trade-cell">{trade.symbol}</div>
            <div className="trade-cell">${trade.entryPrice}</div>
            <div className="trade-cell">${trade.exitPrice}</div>
            <div className="trade-cell">{trade.quantity}</div>
            <div className="trade-cell" style={{
              color: parseFloat(trade.netProfit) >= 0 ? '#10b981' : '#ef4444'
            }}>
              ${trade.netProfit}
            </div>
            <div className="trade-cell">-${trade.fee}</div>
            <div className={`trade-cell trade-type ${trade.type.toLowerCase()}`}>
              {trade.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;
