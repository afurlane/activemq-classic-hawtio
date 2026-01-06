import { useState } from "react";
import { topics } from "../../services/topics";

export const TopicSendMessage: React.FC<{ mbean: string }> = ({ mbean }) => {
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Record<string, string>>({});

  const send = () => topics.sendMessage(mbean, body, headers);

  return (
    <div className="broker-panel">
      <h4>Send Message</h4>
      <textarea value={body} onChange={e => setBody(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
};
