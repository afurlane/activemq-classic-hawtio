import React from 'react'
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartTooltip
} from '@patternfly/react-charts'

import { ActiveMQTopicAttributes } from '../../types/activemq'

export const TopicCharts: React.FC<{ history: ActiveMQTopicAttributes[] }> = ({ history }) => {
  const data = history.map((h, i) => ({
    x: i,
    enqueue: h.EnqueueCount,
    dequeue: h.DequeueCount,
    dispatch: h.DispatchCount
  }))

  return (
    <div className="broker-panel">
      <h4>Charts</h4>

      <div style={{ width: 500, height: 200 }}>
        <Chart
          height={200}
          width={500}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          animate={{ duration: 500, easing: 'cubicOut' as const }}
          containerComponent={<ChartTooltip />}
        >
          <ChartAxis fixLabelOverlap />
          <ChartAxis dependentAxis />

          <ChartGroup>
            <ChartLine
              data={data.map(d => ({ x: d.x, y: d.enqueue }))}
              style={{ data: { stroke: '#007bff', strokeWidth: 2 } }}
            />
            <ChartLine
              data={data.map(d => ({ x: d.x, y: d.dequeue }))}
              style={{ data: { stroke: '#28a745', strokeWidth: 2 } }}
            />
            <ChartLine
              data={data.map(d => ({ x: d.x, y: d.dispatch }))}
              style={{ data: { stroke: '#ff8800', strokeWidth: 2 } }}
            />
          </ChartGroup>
        </Chart>
      </div>
    </div>
  )
}
