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

const tinyTheme = {
  axis: {
    style: {
      tickLabels: { fontSize: 8, padding: 1 }
    }
  }
}

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

    const enqueueRate = enqueueRates[enqueueRates.length - 1]!
    const dequeueRate = dequeueRates[dequeueRates.length - 1]!
    const totalRate = enqueueRate + dequeueRate

    const prevEnqueueRate =
      enqueueRates.length >= 2 ? enqueueRates[enqueueRates.length - 2]! : enqueueRate

    const prevDequeueRate =
      dequeueRates.length >= 2 ? dequeueRates[dequeueRates.length - 2]! : dequeueRate

    const allValues = [...enqueueRates, ...dequeueRates]
    const maxValue = Math.max(...allValues)
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

  const trend = (current: number, previous: number) => {
    if (current > previous) return <Label color="green">↑</Label>
    if (current < previous) return <Label color="red">↓</Label>
    return <Label color="grey">→</Label>
  }

  const sparkProps = {
    height: 60,
    padding: { top: 5, bottom: 5, left: 30, right: 10 },
    containerComponent: <ChartVoronoiContainer labels={() => ''} />
  }

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

  return (
    <Card isFlat isCompact>
      <CardBody>
        <Title headingLevel="h4">Throughput (msg/sec)</Title>

        <DescriptionList isHorizontal>

          <DescriptionListGroup>
            <DescriptionListTerm>Enqueue</DescriptionListTerm>
            <DescriptionListDescription>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  {enqueueRate.toFixed(1)} {trend(enqueueRate, prevEnqueueRate)}
                </FlexItem>
                <FlexItem>
                  <Chart {...sparkProps} domain={{ y: [0, yMax] }}>
                    <ChartLine
                      data={enqueueRates.map((y, i) => ({ x: i, y }))}
                      style={{ data: { stroke: 'var(--pf-v5-global--success-color--100)' },
                      labels: { fontSize: 8 } }}
                    />
                  </Chart>
                </FlexItem>
              </Flex>
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Dequeue</DescriptionListTerm>
            <DescriptionListDescription>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>
                  {dequeueRate.toFixed(1)} {trend(dequeueRate, prevDequeueRate)}
                </FlexItem>
                <FlexItem>
                  <Chart {...sparkProps} domain={{ y: [0, yMax] }}>
                    <ChartLine
                      data={dequeueRates.map((y, i) => ({ x: i, y }))}
                      style={{ data: { stroke: 'var(--pf-v5-global--danger-color--100)' },
                      labels: { fontSize: 8 } }}
                    />
                  </Chart>
                </FlexItem>
              </Flex>
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Total</DescriptionListTerm>
            <DescriptionListDescription>
              <Label color="blue">{totalRate.toFixed(1)} msg/s</Label>
            </DescriptionListDescription>
          </DescriptionListGroup>

        </DescriptionList>
      </CardBody>
    </Card>
  )
}
