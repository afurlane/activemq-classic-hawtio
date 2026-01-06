import { useEffect, useState } from "react";
import { activemq } from "../../services/activemq";

export const TopProducers: React.FC = () => {
  const [producers, setProducers] = useState<any[]>([]);

  const load = async () => {
    const mbeans = await activemq.listProducers();
    const attrs = await Promise.all(mbeans.map(m => activemq.getProducerAttributes(m)));

    const sorted = attrs
      .map(a => ({
        clientId: a.ClientId,
        destination: a.DestinationName,
        sent: a.SentCount,
        blocked: a.ProducerBlocked,
        pctBlocked: a.PercentageBlocked,
      }))
      .sort((a, b) => b.sent - a.sent)
      .slice(0, 10);

    setProducers(sorted);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="broker-panel">
      <h4>Top Producers</h4>
      <ul>
        {producers.map((p, i) => (
          <li key={i}>
            <b>{p.clientId}</b> → {p.destination}  
            — sent {p.sent}
            {p.blocked && <span className="badge red">Blocked</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
