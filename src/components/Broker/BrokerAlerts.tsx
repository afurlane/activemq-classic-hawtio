import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import './BrokerOverview.css';

export const BrokerAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    let totalLag = 0;
    let totalInflight = 0;
    let consumers = 0;
    let memorySum = 0;

    queues.forEach(({ attrs }) => {
      totalLag += attrs.QueueSize - attrs.InflightCount;
      totalInflight += attrs.InflightCount;
      consumers += attrs.ConsumerCount;
      memorySum += attrs.MemoryPercentUsage;
    });

    const avgMemory = queues.length > 0 ? memorySum / queues.length : 0;

    const newAlerts: string[] = [];

    if (avgMemory > 80) newAlerts.push(`High average memory: ${avgMemory.toFixed(1)}%`);
    if (totalLag > 50000) newAlerts.push(`High global lag: ${totalLag}`);
    if (totalInflight > 10000) newAlerts.push(`Too many inflight messages: ${totalInflight}`);
    if (consumers === 0) newAlerts.push(`No active consumers in the broker`);

    setAlerts(newAlerts);
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="broker-panel">
      <h4>Broker Alerts</h4>

      {alerts.length === 0 && <p>No global alerts</p>}

      <ul>
        {alerts.map((a, i) => (
          <li key={i} style={{ color: '#dc3545', fontWeight: 'bold' }}>
            ⚠️ {a}
          </li>
        ))}
      </ul>
    </div>
  );
};
