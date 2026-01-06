// src/components/Queues/QueueBrowser.tsx
import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';

export const QueueBrowser = ({ queue }: any) => {
  const [page, setPage] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const pageSize = 20;

  const load = async () => {
    const data = await activemq.browseQueue(queue.mbean, page, pageSize);
    setMessages(data);
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className="browser">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m, i) => (
            <tr key={i}>
              <td>{m.messageId}</td>
              <td>{m.timestamp}</td>
              <td>{JSON.stringify(m.body).slice(0, 80)}…</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};
