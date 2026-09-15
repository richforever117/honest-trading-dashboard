import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import StatsPanel from './components/StatsPanel';
import TradeHistory from './components/TradeHistory';
import EquityChart from './components/EquityChart';

function App() {
  const [stats, setStats] = useState(null);
  const [trades, setTrades] = useState([]);
  const [equityHistory, setEquityHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:5000/ws`);

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to trading engine');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          setStats(data.stats);
          setTrades(data.recentTrades);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from trading engine');
    };

    // Fetch equity history
    fetch('/api/equity-history')
      .then(res => res.json())
      .then(data => setEquityHistory(data))
      .catch(err => console.error('Error fetching equity history:', err));

    return () => ws.close();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Honest Trading Dashboard</h1>
        <div className="status-indicator">
          <span className={`status-dot ${connected ? 'live' : 'offline'}`}></span>
          <span>{connected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </header>

      <main className="app-main">
        {stats && (
          <>
            <StatsPanel stats={stats} />
            <div className="dashboard-grid">
              <EquityChart data={equityHistory} />
              <Dashboard stats={stats} />
            </div>
            <TradeHistory trades={trades} lastUpdate={lastUpdate} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
