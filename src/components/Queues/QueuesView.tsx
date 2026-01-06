import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import { buildQueueUrl } from '../../router/router';
import './queues.css';

export const QueuesView: React.FC = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listQueues();
    setQueues(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading queues…</div>;

  return (
    <div className="queues">
      <h2>Queues</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Enq</th>
            <th>Deq</th>
            <th>Consumers</th>
            <th>State</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {queues.map((q, i) => (
            <tr key={i}>
              <td>{q.name}</td>
              <td>{q.queueSize}</td>
              <td>{q.enqueueCount}</td>
              <td>{q.dequeueCount}</td>
              <td>{q.consumerCount}</td>
              <td>
                {q.stopped ? (
                  <span className="badge stopped">Stopped</span>
                ) : q.paused ? (
                  <span className="badge paused">Paused</span>
                ) : (
                  <span className="badge running">Running</span>
                )}
              </td>
              <td>
                <button onClick={() => (window.location.hash = buildQueueUrl(q.name))}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
