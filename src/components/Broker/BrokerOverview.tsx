import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import { Sparkline } from '../Common/Sparkline';
import './BrokerOverview.css';
import { BrokerTrends } from './BrokerTrends';

export const BrokerOverview: React.FC = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<
    string,
    {
        queueSize: number[];
        inflight: number[];
        lag: number[];
    }
    >>({});

  const [filter, setFilter] = useState({
    critical: false,
    backlog: false,
    name: '',
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listQueuesWithAttributes();

    // aggiorniamo lo storico per le sparklines
    const newHistory = { ...history };

    data.forEach(({ info, attrs }) => {
      const key = info.name;

      if (!newHistory[key]) {
        newHistory[key] = {
          queueSize: [],
          inflight: [],
          lag: [],
        };
      }

      const lag = attrs.QueueSize - attrs.InflightCount;

      newHistory[key].queueSize = [...newHistory[key].queueSize, attrs.QueueSize].slice(-30);
      newHistory[key].inflight = [...newHistory[key].inflight, attrs.InflightCount].slice(-30);
      newHistory[key].lag = [...newHistory[key].lag, lag].slice(-30);
    });

    setHistory(newHistory);
    setQueues(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <p>Loading broker overview…</p>;

  // Filtri
  const filtered = queues.filter(({ info, attrs }) => {
    if (filter.critical && attrs.MemoryPercentUsage < 80 && attrs.QueueSize < 10000)
      return false;

    if (filter.backlog && attrs.QueueSize < 1000)
      return false;

    if (filter.name && !info.name.toLowerCase().includes(filter.name.toLowerCase()))
      return false;

    return true;
  });

  // Top 5 slowest queues
  const slowest = [...queues]
    .map(({ info, attrs }) => {
      const lag = attrs.QueueSize - attrs.InflightCount;
      const score = lag + attrs.InflightCount * 2 - attrs.DispatchCount;
      return { info, attrs, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div>
      <h2>Broker Overview</h2>
      <BrokerTrends />
      
      {/* FILTRI */}
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={filter.critical}
            onChange={e => setFilter({ ...filter, critical: e.target.checked })}
          />
          Critical only
        </label>

        <label>
          <input
            type="checkbox"
            checked={filter.backlog}
            onChange={e => setFilter({ ...filter, backlog: e.target.checked })}
          />
          Backlog &gt; 1000
        </label>

        <input
          type="text"
          placeholder="Filter by name..."
          value={filter.name}
          onChange={e => setFilter({ ...filter, name: e.target.value })}
        />
      </div>

      {/* TOP 5 SLOWEST */}
      <div className="broker-panel">
        <h4>Top 5 Slowest Queues</h4>
        <ul>
          {slowest.map(({ info, attrs }) => (
            <li key={info.name}>
              <b>{info.name}</b> — lag {attrs.QueueSize - attrs.InflightCount}, inflight {attrs.InflightCount}
            </li>
          ))}
        </ul>
      </div>

      {/* GRID PRINCIPALE */}
      <div className="broker-grid">
        {filtered.map(({ info, attrs }) => {
          const lag = attrs.QueueSize - attrs.InflightCount;
          const severity =
            attrs.MemoryPercentUsage > 80 || lag > 10000
              ? 'red'
              : attrs.MemoryPercentUsage > 60 || lag > 1000
              ? 'yellow'
              : 'green';

          const h = history[info.name] ?? { queueSize: [], inflight: [], lag: [] };

          return (
            <div key={info.name} className="broker-panel">
              <h4>{info.name}</h4>

              <p><b>Size:</b> {attrs.QueueSize}</p>
              <Sparkline data={h.queueSize} color="#007bff" />

              <p><b>Inflight:</b> {attrs.InflightCount}</p>
              <Sparkline data={h.inflight} color="#ff8800" />

              <p><b>Lag:</b> {lag}</p>
              <Sparkline data={h.lag} color="#dc3545" />

              <p><b>Consumers:</b> {attrs.ConsumerCount}</p>
              <p><b>Memory:</b> {attrs.MemoryPercentUsage}%</p>

              <span className={`badge ${severity}`}>
                {severity === 'red' && '🔥 Critical'}
                {severity === 'yellow' && '⚠️ Warning'}
                {severity === 'green' && '🟢 Healthy'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
