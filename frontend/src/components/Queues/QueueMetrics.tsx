import React, { useMemo } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Label
} from '@patternfly/react-core'

import {
  Chart,
  ChartLine,
  ChartAxis,
  ChartGroup,
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import { Queue } from '../../types/domain'

interface Props {
  history: Queue[]
}

export const QueueMetricsOverview: React.FC<Props> = ({ history }) => {

  const data = useMemo(() => {
    return history.map(h => ({
      time: new Date(h.timestamp).toLocaleTimeString(),
      size: h.size,
      enqueue: h.stats.enqueue,
      dequeue: h.stats.dequeue,
      inflight: h.stats.inflight,
      memory: h.memory.percent,
    }))
  }, [history])

    // Se non ci sono almeno 2 punti dati, non posso calcolare trend
  if (data.length < 2) {
    return (
      <Card isFlat className="pf-v5-u-mb-lg">
        <CardHeader>
          <CardTitle>Metrics Overview</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="pf-v5-u-color-200">Not enough data to display metrics.</p>
        </CardBody>
      </Card>
    )
  }

  const last = data[data.length - 1]!
  const prev = data[data.length - 2]!

  const trend = (current: number, previous: number) => {
    if (current > previous) return <Label color="green">↑</Label>
    if (current < previous) return <Label color="red">↓</Label>
    return <Label color="grey">→</Label>
  }

  const sparkProps = {
    height: 60,
    padding: { top: 5, bottom: 5, left: 30, right: 10 },
    containerComponent: <ChartVoronoiContainer labels={() => ''} />,
  }

  return (
    <Card isFlat className="pf-v5-u-mb-lg">
      <CardHeader>
        <CardTitle>Metrics Overview</CardTitle>
      </CardHeader>

      <CardBody>
        <Grid hasGutter>

          {/* Queue Size */}
          <GridItem span={3}>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <b>Queue Size</b> {trend(last.size, prev.size)}
              </FlexItem>
              <FlexItem className="pf-v5-u-font-size-lg">{last.size}</FlexItem>
              <FlexItem>
                <Chart {...sparkProps}>
                  <ChartLine
                    data={data.map(d => ({ x: d.time, y: d.size }))}
                    style={{ data: { stroke: 'var(--pf-v5-global--primary-color--100)' } }}
                  />
                </Chart>
              </FlexItem>
            </Flex>
          </GridItem>

          {/* Enqueue Rate */}
          <GridItem span={3}>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <b>Enqueue</b> {trend(last.enqueue, prev.enqueue)}
              </FlexItem>
              <FlexItem className="pf-v5-u-font-size-lg">{last.enqueue}</FlexItem>
              <FlexItem>
                <Chart {...sparkProps}>
                  <ChartLine
                    data={data.map(d => ({ x: d.time, y: d.enqueue }))}
                    style={{ data: { stroke: 'var(--pf-v5-global--success-color--100)' } }}
                  />
                </Chart>
              </FlexItem>
            </Flex>
          </GridItem>

          {/* Dequeue Rate */}
          <GridItem span={3}>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <b>Dequeue</b> {trend(last.dequeue, prev.dequeue)}
              </FlexItem>
              <FlexItem className="pf-v5-u-font-size-lg">{last.dequeue}</FlexItem>
              <FlexItem>
                <Chart {...sparkProps}>
                  <ChartLine
                    data={data.map(d => ({ x: d.time, y: d.dequeue }))}
                    style={{ data: { stroke: 'var(--pf-v5-global--danger-color--100)' } }}
                  />
                </Chart>
              </FlexItem>
            </Flex>
          </GridItem>

          {/* Memory Usage */}
          <GridItem span={3}>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <b>Memory %</b> {trend(last.memory, prev.memory)}
              </FlexItem>
              <FlexItem className="pf-v5-u-font-size-lg">{last.memory}%</FlexItem>
              <FlexItem>
                <Chart {...sparkProps} domain={{ y: [0, 100] }}>
                  <ChartLine
                    data={data.map(d => ({ x: d.time, y: d.memory }))}
                    style={{ data: { stroke: 'var(--pf-v5-global--palette--purple-500)' } }}
                  />
                </Chart>
              </FlexItem>
            </Flex>
          </GridItem>

        </Grid>
      </CardBody>
    </Card>
  )
}
