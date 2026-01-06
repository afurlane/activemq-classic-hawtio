import { topics } from "../../services/topics";

export const TopicDelete: React.FC<{ mbean: string }> = ({ mbean }) => {
  const del = () => {
    if (confirm('Delete topic? This cannot be undone.')) {
      topics.deleteTopic(mbean);
    }
  };

  return (
    <div className="broker-panel">
      <h4>Delete Topic</h4>
      <button onClick={del} style={{ background: '#dc3545' }}>
        Delete topic
      </button>
    </div>
  );
};
