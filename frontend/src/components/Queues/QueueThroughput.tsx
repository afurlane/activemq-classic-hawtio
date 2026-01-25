import React, { useMemo } from 'react'
import {
  Card,
  CardBody,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import {
  Chart,
  ChartLine,
  ChartVoronoiContainer
} from '@patternfly/react-charts'

import { Queue } from '../../types/domain'

interface Props {
  history: Queue[]
  intervalMs?: number
}

const trend = (current: number, previous: number) => {
  if (current > previous) return <Label color="green">↑</Label>
  if (current < previous) return <Label color="red">↓</Label>
  return <Label color="grey">→</Label>
}

const spark = (values: number[], color: string, yMax: number) => (
  <Chart
    height={60}
    padding={{ top: 5, bottom: 5, left: 30, right: 10 }}
    containerComponent={<ChartVoronoiContainer labels={() => ''} />}
    domain={{ y: [0, yMax] }}
  >
    <ChartLine
      data={values.map((y, i) => ({ x: i, y }))}
      style={{
        data: { stroke: color },
        labels: { fontSize: 8 }
      }}
    />
  </Chart>
)

export const QueueThroughput: React.FC<Props> = ({ history, intervalMs = 2000 }) => {
  const metrics = useMemo(() => {
    if (history.length < 2) return null

    const dt = intervalMs / 1000

    const prevList = history.slice(0, -1)
    const currList = history.slice(1)

    const enqueueRates = currList.map((curr, i) => {
      const prev = prevList[i]!
      return (curr.stats.enqueue - prev.stats.enqueue) / dt
    })

    const dequeueRates = currList.map((curr, i) => {
      const prev = prevList[i]!
      return (curr.stats.dequeue - prev.stats.dequeue) / dt
    })

    const enqueueRate = enqueueRates.at(-1)!
    const dequeueRate = dequeueRates.at(-1)!
    const totalRate = enqueueRate + dequeueRate

    const prevEnqueueRate = enqueueRates.length > 1 ? enqueueRates.at(-2)! : enqueueRate
    const prevDequeueRate = dequeueRates.length > 1 ? dequeueRates.at(-2)! : dequeueRate

    const maxValue = Math.max(...enqueueRates, ...dequeueRates)
    const yMax = maxValue === 0 ? 1 : maxValue * 1.2

    return {
      enqueueRate,
      dequeueRate,
      totalRate,
      prevEnqueueRate,
      prevDequeueRate,
      enqueueRates,
      dequeueRates,
      yMax
    }
  }, [history, intervalMs])

  if (!metrics) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Title headingLevel="h4">Throughput (msg/sec)</Title>
          <Label color="blue">Collecting throughput data…</Label>
        </CardBody>
      </Card>
    )
  }

  const {
    enqueueRate,
    dequeueRate,
    totalRate,
    prevEnqueueRate,
    prevDequeueRate,
    enqueueRates,
    dequeueRates,
    yMax
  } = metrics

  const items = [
    {
      label: 'Enqueue',
      value: enqueueRate.toFixed(1),
      trend: trend(enqueueRate, prevEnqueueRate),
      spark: spark(enqueueRates, 'var(--pf-v5-global--success-color--100)', yMax)
    },
    {
      label: 'Dequeue',
      value: dequeueRate.toFixed(1),
      trend: trend(dequeueRate, prevDequeueRate),
      spark: spark(dequeueRates, 'var(--pf-v5-global--danger-color--100)', yMax)
    },
    {
      label: 'Total',
      value: <Label color="blue">{totalRate.toFixed(1)} msg/s</Label>,
      trend: null,
      spark: null
    }
  ]

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Throughput (msg/sec)</Title>

        <DescriptionList isHorizontal>
          {items.map((m, i) => (
            <DescriptionListGroup key={i}>
              <DescriptionListTerm>{m.label}</DescriptionListTerm>
              <DescriptionListDescription>
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    {m.value} {m.trend}
                  </FlexItem>
                  {m.spark && <FlexItem>{m.spark}</FlexItem>}
                </Flex>
              </DescriptionListDescription>
            </DescriptionListGroup>
          ))}
        </DescriptionList>
      </CardBody>
    </Card>
  )
}
