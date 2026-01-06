import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const TopicCharts: React.FC<{ history: any[] }> = ({ history }) => {
  const data = history.map((h, i) => ({
    idx: i,
    enqueue: h.EnqueueCount,
    dequeue: h.DequeueCount,
    dispatch: h.DispatchCount,
    size: h.QueueSize,
  }));

  return (
    <div className="broker-panel">
      <h4>Charts</h4>

      <LineChart width={500} height={200} data={data}>
        <XAxis dataKey="idx" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="enqueue" stroke="#007bff" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        <Line type="monotone" dataKey="dequeue" stroke="#28a745" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        <Line type="monotone" dataKey="dispatch" stroke="#ff8800" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        <Line type="monotone" dataKey="size" stroke="#dc3545" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
      </LineChart>
    </div>
  );
};
