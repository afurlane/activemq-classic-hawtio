import React from 'react'
import {
	Chart,
	ChartAxis,
	ChartGroup,
	ChartLine,
	ChartVoronoiContainer
} from '@patternfly/react-charts/victory';

import { ActiveMQTopicAttributes } from '../../types/activemq'

const noDataTextStyle = { opacity: 0.6 }
const chartContainerStyle = { width: 500, height: 200 }
const chartPadding = { top: 20, bottom: 40, left: 50, right: 20 }
const chartAnimation = { duration: 500, easing: 'cubicOut' as const }
const chartLabelAccessor = ({ datum }: { datum: { y: number } }) => `${datum.y}`
const metricLineStyles = {
  enqueue: {
    data: {
      stroke: "var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--primary-color--100 */,
      strokeWidth: 2
    }
  },
  dequeue: {
    data: {
      stroke: "var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--success-color--100 */,
      strokeWidth: 2
    }
  },
  dispatch: {
    data: {
      stroke: "var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--warning-color--100 */,
      strokeWidth: 2
    }
  }
} as const

interface Props {
  history: ActiveMQTopicAttributes[]
}

export const TopicCharts: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="broker-panel">
        <h4>Charts</h4>
        <p style={noDataTextStyle}>No data available</p>
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
      style: metricLineStyles.enqueue
    },
    {
      key: 'dequeue',
      label: 'Dequeue',
      style: metricLineStyles.dequeue
    },
    {
      key: 'dispatch',
      label: 'Dispatch',
      style: metricLineStyles.dispatch
    }
  ] as const

  return (
    <div className="broker-panel">
      <h4>Charts</h4>

      <div style={chartContainerStyle}>
        <Chart
          height={200}
          width={500}
          padding={chartPadding}
          animate={chartAnimation}
          containerComponent={
            <ChartVoronoiContainer
              labels={chartLabelAccessor}
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
                style={m.style}
              />
            ))}
          </ChartGroup>
        </Chart>
      </div>
    </div>
  )
}
