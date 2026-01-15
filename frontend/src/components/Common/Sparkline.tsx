import React, { useMemo } from 'react';
import {
  Chart,
  ChartLine,
  ChartAxis,
  ChartGroup
} from '@patternfly/react-charts';

interface Props {
  data: number[];
  color?: string;
}

export const Sparkline: React.FC<Props> = ({ data, color = '#00bcd4' }) => {
  // Pre-elaborazione sicura e memoizzata
  const chartData = useMemo(() => {
    return data.map((v, i) => ({ x: i, y: v }));
  }, [data]);

  // Dominio Y dinamico per evitare linee piatte
  const yMin = Math.min(...data, 0);
  const yMax = Math.max(...data, 1);

  return (
    <div style={{ width: '100%', height: 40 }}>
      <Chart
        height={40}
        padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
        domain={{ y: [yMin, yMax] }}
        animate={{ duration: 500, easing: 'ease-out' }}
      >
        <ChartGroup>
          <ChartLine
            data={chartData}
            style={{
              data: {
                stroke: color,
                strokeWidth: 2
              }
            }}
          />
        </ChartGroup>

        {/* Assi nascosti per un vero sparkline */}
        <ChartAxis
          style={{
            axis: { stroke: 'none' },
            ticks: { stroke: 'none' },
            tickLabels: { fill: 'none' }
          }}
        />
        <ChartAxis
          dependentAxis
          style={{
            axis: { stroke: 'none' },
            ticks: { stroke: 'none' },
            tickLabels: { fill: 'none' }
          }}
        />
      </Chart>
    </div>
  );
};
