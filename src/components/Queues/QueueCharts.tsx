import React, { useMemo } from 'react';
import {
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  history: ActiveMQQueueAttributes[];
}

export const QueueCharts: React.FC<Props> = ({ history }) => {

  // Convertiamo history → data[] per Recharts
  const data = useMemo(() => {
    return history.map(h => ({
      time: new Date().toLocaleTimeString(), // puoi usare h.Timestamp se vuoi
      queueSize: h.QueueSize,
      enqueueCount: h.EnqueueCount,
      dequeueCount: h.DequeueCount,
      memoryPercent: h.MemoryPercentUsage,
      inflight: h.InflightCount,
      cursorPercent: h.CursorPercentUsage,
      producers: h.ProducerCount,
      dispatch: h.DispatchCount,
    }));
  }, [history]);

  return (
    <div className="queue-charts">

      <h3>Queue Size</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="queueSize" stroke="#007bff" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Enqueue / Dequeue Count</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="enqueueCount" stroke="#28a745" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
          <Line type="monotone" dataKey="dequeueCount" stroke="#dc3545" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Memory Usage (%)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Area type="monotone" dataKey="memoryPercent" stroke="#6f42c1" fill="#d8c8ff" isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>

      <h3>Inflight Messages</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="inflight" stroke="#ff8800" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Cursor Usage (%)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Area type="monotone" dataKey="cursorPercent" stroke="#17a2b8" fill="#b8ecf2" isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </AreaChart>
      </ResponsiveContainer>

      <h3>Producer Count</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="producers" stroke="#6610f2" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Dispatch Count</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="dispatch" stroke="#20c997" dot={false} isAnimationActive={true} animationDuration={500} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};
