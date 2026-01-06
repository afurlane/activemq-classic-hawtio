import { useEffect, useState } from "react";
import { activemq } from "../../services/activemq";

export const TopConsumers: React.FC = () => {
  const [consumers, setConsumers] = useState<any[]>([]);

  const load = async () => {
    const mbeans = await activemq.listConsumers();
    const attrs = await Promise.all(mbeans.map(m => activemq.getConsumerAttributes(m)));

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId,
        destination: a.DestinationName,
        dispatched: a.DispatchedCounter,
        dequeue: a.DequeueCounter,
        pending: a.PendingQueueSize,
        slow: a.SlowConsumer,
      }))
      .sort((a, b) => b.dispatched - a.dispatched)
      .slice(0, 10);

    setConsumers(sorted);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="broker-panel">
      <h4>Top Consumers</h4>
      <ul>
        {consumers.map((c, i) => (
          <li key={i}>
            <b>{c.clientId}</b> → {c.destination}  
            — dispatched {c.dispatched}, pending {c.pending}
            {c.slow && <span className="badge red">Slow</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
