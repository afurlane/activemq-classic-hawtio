import { topics } from "../../services/topics";

export const TopicOperations: React.FC<{ mbean: string }> = ({ mbean }) => {
  const reset = () => topics.resetStatistics(mbean);

  return (
    <div className="broker-panel">
      <h4>Operations</h4>
      <button onClick={reset}>Reset statistics</button>
    </div>
  );
};
