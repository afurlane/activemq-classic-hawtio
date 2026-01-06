import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import './BrokerOverview.css';

export const BrokerThroughput: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [rates, setRates] = useState({
    enqueue: 0,
    dequeue: 0,
    dispatch: 0,
  });

  const poll = async () => {
    const queues = await activemq.listQueuesWithAttributes();

    const total = queues.reduce(
      (acc, { attrs }) => {
        acc.enqueue += attrs.EnqueueCount;
        acc.dequeue += attrs.DequeueCount;
        acc.dispatch += attrs.DispatchCount;
        return acc;
      },
      { enqueue: 0, dequeue: 0, dispatch: 0 }
    );

    setHistory(prev => {
      const next = [...prev, total].slice(-2);
      if (next.length === 2) {
        const dt = 5; // polling 5s
        setRates({
          enqueue: (next[1].enqueue - next[0].enqueue) / dt,
          dequeue: (next[1].dequeue - next[0].dequeue) / dt,
          dispatch: (next[1].dispatch - next[0].dispatch) / dt,
        });
      }
      return next;
    });
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="broker-panel">
      <h4>Broker Throughput (msg/sec)</h4>

      <p><b>Enqueue:</b> {rates.enqueue.toFixed(1)}</p>
      <p><b>Dequeue:</b> {rates.dequeue.toFixed(1)}</p>
      <p><b>Dispatch:</b> {rates.dispatch.toFixed(1)}</p>
    </div>
  );
};
