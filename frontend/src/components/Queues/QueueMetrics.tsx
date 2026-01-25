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
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@patternfly/react-icons'

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

  const last = data.at(-1)!
  const prev = data.at(-2)!

  const trendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUpIcon color="var(--pf-v5-global--success-color--100)" />
    }
    if (current < previous) {
      return <ArrowDownIcon color="var(--pf-v5-global--danger-color--100)" />
    }
    return <MinusIcon color="var(--pf-v5-global--palette--black-500)" />
  }

  const spark = (values: number[], color: string, domain?: any) => (
    <Chart
      height={60}
      padding={{ top: 5, bottom: 5, left: 30, right: 10 }}
      containerComponent={<ChartVoronoiContainer labels={() => ''} />}
      domain={domain}
    >
      <ChartLine
        data={values.map((y, i) => ({ x: i, y }))}
        style={{ data: { stroke: color } }}
      />
    </Chart>
  )

  const metrics = [
    {
      label: 'Queue Size',
      value: last.size.toLocaleString(),
      trend: trendIcon(last.size, prev.size),
      spark: spark(data.map(d => d.size), 'var(--pf-v5-global--primary-color--100)')
    },
    {
      label: 'Enqueue',
      value: last.enqueue.toLocaleString(),
      trend: trendIcon(last.enqueue, prev.enqueue),
      spark: spark(data.map(d => d.enqueue), 'var(--pf-v5-global--success-color--100)')
    },
    {
      label: 'Dequeue',
      value: last.dequeue.toLocaleString(),
      trend: trendIcon(last.dequeue, prev.dequeue),
      spark: spark(data.map(d => d.dequeue), 'var(--pf-v5-global--danger-color--100)')
    },
    {
      label: 'Memory %',
      value: `${last.memory}%`,
      trend: trendIcon(last.memory, prev.memory),
      spark: spark(
        data.map(d => d.memory),
        'var(--pf-v5-global--palette--purple-500)',
        { y: [0, 100] }
      )
    }
  ]

  return (
    <Card isFlat className="pf-v5-u-mb-lg">
      <CardHeader>
        <CardTitle>Metrics Overview</CardTitle>
      </CardHeader>

      <CardBody>
        <Grid hasGutter>
          {metrics.map((m, i) => (
            <GridItem key={i} span={3}>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  <b>{m.label}</b> {m.trend}
                </FlexItem>
                <FlexItem className="pf-v5-u-font-size-lg">{m.value}</FlexItem>
                <FlexItem>{m.spark}</FlexItem>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  )
}
