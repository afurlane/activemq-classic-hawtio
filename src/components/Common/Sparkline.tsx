import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: number[];
  color?: string;
}

export const Sparkline: React.FC<Props> = ({ data, color = '#00bcd4' }) => {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
          animationDuration={500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
