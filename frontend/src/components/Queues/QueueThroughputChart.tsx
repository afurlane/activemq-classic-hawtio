import React, { useCallback, useMemo } from 'react'
import {
  Card,
  CardBody,
  Title
} from '@patternfly/react-core'

import {
  Chart,
  ChartLine,
  ChartAxis,
  ChartVoronoiContainer
} from '@patternfly/react-charts/victory'

import { Queue } from '../../types/domain'
import { ChartColors } from '../../themes/charts'

const chartPadding = { top: 10, bottom: 40, left: 40, right: 10 }
const axisStyle = {
  tickLabels: { fontSize: 8, padding: 2 }
}
const enqueueLineStyle = { data: { stroke: ChartColors.enqueue, strokeWidth: 1 } }
const dequeueLineStyle = { data: { stroke: ChartColors.dequeue, strokeWidth: 1 } }

export const QueueThroughputChart: React.FC<{ history: Queue[], intervalMs?: number }> = ({
  history,
  intervalMs = 2000
}) => {

  const formatTimeTick = useCallback((t: Date | number | string) => new Date(t).toLocaleTimeString(), [])

  const data = useMemo(() => {
    if (history.length < 2) return null

    const dt = intervalMs / 1000
    const prev = history.slice(0, -1)
    const curr = history.slice(1)

    return curr.map((c, i) => {
      const p = prev[i]!
      return {
        time: new Date(c.timestamp),
        enqueue: (c.stats.enqueue - p.stats.enqueue) / dt,
        dequeue: (c.stats.dequeue - p.stats.dequeue) / dt
      }
    })
  }, [history, intervalMs])

  if (!data) return null

  return (
    <Card className="pf-v5-u-mt-lg">
      <CardBody>
        <Title headingLevel="h4" className="pf-v5-u-mb-md">
          Throughput Over Time
        </Title>

            <Chart
            height={160}
            padding={chartPadding}
            containerComponent={<ChartVoronoiContainer />}
            >
            <ChartAxis
              tickFormat={formatTimeTick}
                style={axisStyle}
            />

            <ChartAxis
                dependentAxis
              style={axisStyle}
            />

            <ChartLine
                data={data.map(d => ({ x: d.time, y: d.enqueue }))}
              style={enqueueLineStyle}
            />

            <ChartLine
                data={data.map(d => ({ x: d.time, y: d.dequeue }))}
              style={dequeueLineStyle}
            />
            </Chart>
      </CardBody>
    </Card>
  )
}
