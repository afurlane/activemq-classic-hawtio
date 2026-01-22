import React, { useMemo } from 'react'
import {
  Card,
  CardBody,
  Title,
  Grid,
  GridItem
} from '@patternfly/react-core'

import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartArea,
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import { Queue } from '../../types/domain'

interface Props {
  history: Queue[]
}

export const QueueCharts: React.FC<Props> = ({ history }) => {

  const data = useMemo(() => {
    return history.map(h => ({
      time: new Date(h.timestamp).toLocaleTimeString(),
      size: h.size,
      enqueue: h.stats.enqueue,
      dequeue: h.stats.dequeue,
      inflight: h.stats.inflight,
      memoryPercent: h.memory.percent,
    }))
  }, [history])

  const chartProps = {
    height: 200,
    padding: { top: 20, bottom: 40, left: 50, right: 20 },
    animate: { duration: 500, easing: 'cubicOut' as const },
    containerComponent: (
      <ChartVoronoiContainer
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
      />
    )
  }

  return (
    <Grid hasGutter>

      {/* Queue Size */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Queue Size</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartGroup>
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.size }))}
                  style={{ data: { stroke: '#007bff', strokeWidth: 2 } }}
                />
              </ChartGroup>
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Enqueue / Dequeue */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Enqueue / Dequeue</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartGroup>
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.enqueue }))}
                  style={{ data: { stroke: '#28a745', strokeWidth: 2 } }}
                />
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.dequeue }))}
                  style={{ data: { stroke: '#dc3545', strokeWidth: 2 } }}
                />
              </ChartGroup>
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Memory Usage */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Memory Usage (%)</Title>
            <Chart {...chartProps} domain={{ y: [0, 100] }}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartArea
                data={data.map(d => ({ x: d.time, y: d.memoryPercent }))}
                style={{
                  data: {
                    stroke: '#6f42c1',
                    fill: '#d8c8ff',
                    strokeWidth: 2
                  }
                }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Inflight */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Inflight Messages</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartLine
                data={data.map(d => ({ x: d.time, y: d.inflight }))}
                style={{ data: { stroke: '#ff8800', strokeWidth: 2 } }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

    </Grid>
  )
}
