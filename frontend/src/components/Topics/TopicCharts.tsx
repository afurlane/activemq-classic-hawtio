import React from 'react'
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  history: ActiveMQTopicAttributes[]
}

export const TopicCharts: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="broker-panel">
        <h4>Charts</h4>
        <p style={{ opacity: 0.6 }}>No data available</p>
      </div>
    )
  }

  const data = history.map((h, i) => ({
    x: i,
    enqueue: h.EnqueueCount,
    dequeue: h.DequeueCount,
    dispatch: h.DispatchCount
  }))

  const metrics = [
    {
      key: 'enqueue',
      label: 'Enqueue',
      color: 'var(--pf-v5-global--primary-color--100)'
    },
    {
      key: 'dequeue',
      label: 'Dequeue',
      color: 'var(--pf-v5-global--success-color--100)'
    },
    {
      key: 'dispatch',
      label: 'Dispatch',
      color: 'var(--pf-v5-global--warning-color--100)'
    }
  ] as const

  return (
    <div className="broker-panel">
      <h4>Charts</h4>

      <div style={{ width: 500, height: 200 }}>
        <Chart
          height={200}
          width={500}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          animate={{ duration: 500, easing: 'cubicOut' as const }}
          containerComponent={
            <ChartVoronoiContainer
              labels={({ datum }) => `${datum.y}`}
            />
          }
        >
          <ChartAxis fixLabelOverlap />
          <ChartAxis dependentAxis />

          <ChartGroup>
            {metrics.map(m => (
              <ChartLine
                key={m.key}
                data={data.map(d => ({ x: d.x, y: d[m.key] }))}
                style={{
                  data: {
                    stroke: m.color,
                    strokeWidth: 2
                  }
                }}
              />
            ))}
          </ChartGroup>
        </Chart>
      </div>
    </div>
  )
}
