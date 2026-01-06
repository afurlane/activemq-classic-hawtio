import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import { Sparkline } from '../Common/Sparkline';
import './BrokerOverview.css';

interface TrendHistory {
  totalSize: number[];
  totalInflight: number[];
  totalLag: number[];
}

export const BrokerTrends: React.FC = () => {
  const [history, setHistory] = useState<TrendHistory>({
    totalSize: [],
    totalInflight: [],
    totalLag: [],
  });

  const [latest, setLatest] = useState({
    totalSize: 0,
    totalInflight: 0,
    totalLag: 0,
    consumers: 0,
    avgMemory: 0,
  });

  const [loading, setLoading] = useState(true);

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    let totalSize = 0;
    let totalInflight = 0;
    let totalLag = 0;
    let consumers = 0;
    let memorySum = 0;

    queues.forEach(({ attrs }) => {
      totalSize += attrs.QueueSize;
      totalInflight += attrs.InflightCount;
      totalLag += attrs.QueueSize - attrs.InflightCount;
      consumers += attrs.ConsumerCount;
      memorySum += attrs.MemoryPercentUsage;
    });

    const avgMemory = queues.length > 0 ? memorySum / queues.length : 0;

    setLatest({
      totalSize,
      totalInflight,
      totalLag,
      consumers,
      avgMemory,
    });

    setHistory(prev => ({
      totalSize: [...prev.totalSize, totalSize].slice(-50),
      totalInflight: [...prev.totalInflight, totalInflight].slice(-50),
      totalLag: [...prev.totalLag, totalLag].slice(-50),
    }));

    setLoading(false);
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <p>Loading broker trends…</p>;

  // Severity globale
  const severity =
    latest.avgMemory > 80 || latest.totalLag > 50000
      ? 'red'
      : latest.avgMemory > 60 || latest.totalLag > 10000
      ? 'yellow'
      : 'green';

  return (
    <div className="broker-panel">
      <h4>Broker Trends</h4>

      <p><b>Total Messages:</b> {latest.totalSize}</p>
      <Sparkline data={history.totalSize} color="#007bff" />

      <p><b>Total Inflight:</b> {latest.totalInflight}</p>
      <Sparkline data={history.totalInflight} color="#ff8800" />

      <p><b>Total Lag:</b> {latest.totalLag}</p>
      <Sparkline data={history.totalLag} color="#dc3545" />

      <p><b>Active Consumers:</b> {latest.consumers}</p>
      <p><b>Average Memory:</b> {latest.avgMemory.toFixed(1)}%</p>

      <span className={`badge ${severity}`}>
        {severity === 'red' && '🔥 Critical'}
        {severity === 'yellow' && '⚠️ Warning'}
        {severity === 'green' && '🟢 Healthy'}
      </span>
    </div>
  );
};
