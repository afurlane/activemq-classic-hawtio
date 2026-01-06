import { useEffect, useState } from "react";
import { topics } from "../../services/topics";

export const TopicProducers: React.FC<{ topicName: string }> = ({ topicName }) => {
  const [prods, setProds] = useState<any[]>([]);

  const load = async () => {
    const data = await topics.listProducers(topicName);
    setProds(data);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [topicName]);

  return (
    <div className="broker-panel">
      <h4>Producers</h4>
      <ul>
        {prods.map((p, i) => (
          <li key={i}>
            {p.ClientId} — sent {p.SentCount}
            {p.ProducerBlocked && <span className="badge red">Blocked</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
