export const TopicAlerts: React.FC<{ attrs: any; history: any[] }> = ({ attrs, history }) => {
  const alerts: string[] = [];

  if (attrs.MemoryPercentUsage > 80) alerts.push(`High memory usage`);
  if (attrs.TempUsagePercentUsage > 80) alerts.push(`High temp usage`);
  if (attrs.ProducerCount === 0) alerts.push(`No producers`);
  if (attrs.ConsumerCount === 0) alerts.push(`No subscribers`);
  if (attrs.QueueSize > 10000) alerts.push(`Large backlog`);

  return (
    <div className="broker-panel">
      <h4>Alerts</h4>
      {alerts.length === 0 ? <p>No alerts</p> : (
        <ul>{alerts.map((a, i) => <li key={i}>⚠️ {a}</li>)}</ul>
      )}
    </div>
  );
};
