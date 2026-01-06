import { useEffect, useState } from "react";
import { topics } from "../../services/topics";

export const TopicSubscribers: React.FC<{ topicName: string }> = ({ topicName }) => {
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    const data = await topics.listSubscribers(topicName);
    setSubs(data);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [topicName]);

  return (
    <div className="broker-panel">
      <h4>Subscribers</h4>
      <ul>
        {subs.map((s, i) => (
          <li key={i}>
            {s.ClientId} — dispatched {s.DispatchedCounter}, pending {s.PendingQueueSize}
          </li>
        ))}
      </ul>
    </div>
  );
};
