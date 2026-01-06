import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import './BrokerOverview.css';

export const BrokerStorage: React.FC = () => {
  const [storage, setStorage] = useState({
    store: 0,
    temp: 0,
    cursor: 0,
    memory: 0,
  });

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    let store = 0;
    let cursor = 0;
    let memory = 0;
    let tempSum = 0;

    queues.forEach(({ attrs }) => {
      store += attrs.StoreMessageSize;
      cursor += attrs.CursorMemoryUsage;
      memory += attrs.MemoryUsageByteCount;
      tempSum += attrs.TempUsagePercentUsage;
    });

    const temp = queues.length > 0 ? tempSum / queues.length : 0;

    setStorage({ store, temp, cursor, memory });
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="broker-panel">
      <h4>Broker Storage</h4>

      <p><b>Total Store Size:</b> {storage.store} bytes</p>
      <p><b>Average Temp Usage:</b> {storage.temp.toFixed(1)}%</p>
      <p><b>Total Cursor Memory:</b> {storage.cursor} bytes</p>
      <p><b>Total Memory Usage:</b> {storage.memory} bytes</p>
    </div>
  );
};
