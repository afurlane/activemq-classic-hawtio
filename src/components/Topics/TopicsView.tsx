import React, { useEffect, useState } from 'react';
import { topics } from '../../services/topics';
import { buildTopicUrl } from '../../router/router';

export const TopicsView: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await topics.listTopics();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <div>Loading topics…</div>;

  return (
    <div>
      <h2>Topics</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Enq</th>
            <th>Deq</th>
            <th>Producers</th>
            <th>Subscribers</th>
            <th>Size</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {list.map((t, i) => (
            <tr key={i}>
              <td>{t.name}</td>
              <td>{t.enqueueCount}</td>
              <td>{t.dequeueCount}</td>
              <td>{t.producerCount}</td>
              <td>{t.consumerCount}</td>
              <td>{t.queueSize}</td>
              <td>
                <button onClick={() => (window.location.hash = buildTopicUrl(t.name))}>
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
