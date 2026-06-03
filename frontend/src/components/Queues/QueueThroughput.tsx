import React, { useMemo } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import { Sparkline } from '../Common/Sparkline'
import { Queue } from '../../types/domain'
import { ChartColors } from '../../themes/charts'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@patternfly/react-icons'

export const QueueThroughput: React.FC<{ history: Queue[], intervalMs?: number }> = ({
  history,
  intervalMs = 2000
}) => {

  const data = useMemo(() => {
    if (history.length < 2) return null

    const dt = intervalMs / 1000
    const prev = history.slice(0, -1)
    const curr = history.slice(1)

    return curr.map((c, i) => {
      const p = prev[i]!
      return {
        enqueue: (c.stats.enqueue - p.stats.enqueue) / dt,
        dequeue: (c.stats.dequeue - p.stats.dequeue) / dt,
        total: ((c.stats.enqueue - p.stats.enqueue) + (c.stats.dequeue - p.stats.dequeue)) / dt
      }
    })
  }, [history, intervalMs])

  if (!data) return null

  const last = data.at(-1)!
  const prev = data.length > 1 ? data.at(-2)! : null

  const trend = (c: number, p: number | null) => {
    if (p === null) {
      return <MinusIcon color="var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--palette--black-500 */ />
    }
    if (c > p) {
      return <ArrowUpIcon color="var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--success-color--100 */ />
    }
    if (c < p) {
      return <ArrowDownIcon color="var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--danger-color--100 */ />
    }
    return <MinusIcon color="var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--palette--black-500 */ />
  }

  return (
    <Card className="pf-v5-u-mb-md">
      <CardHeader>
        <CardTitle className="pf-v5-u-font-size-md">Throughput (msg/sec)</CardTitle>
      </CardHeader>

      <CardBody>
        <Grid hasGutter>
          {[
            { label: 'Enqueue', value: last.enqueue, color: ChartColors.enqueue },
            { label: 'Dequeue', value: last.dequeue, color: ChartColors.dequeue },
            { label: 'Total', value: last.total, color: ChartColors.throughput }
          ].map((m, i) => (
            <GridItem key={i} span={2}>
              <Card
                isCompact
                className="pf-v5-u-border-left pf-v5-u-border-color-200 pf-v5-u-p-sm"
              >
                <CardBody className="pf-v5-u-p-0">
                  <Flex direction={{ default: 'column' }}>
                    
                    {/* Label + trend */}
                    <FlexItem>
                      <span className="pf-v5-u-font-size-xs pf-v5-u-color-200">
                        {m.label}
                      </span>{' '}
                      {trend(m.value, prev ? prev[m.label.toLowerCase() as 'enqueue' | 'dequeue' | 'total'] : null)}

                    </FlexItem>

                    {/* Value */}
                    <FlexItem className="pf-v5-u-font-size-lg pf-v5-u-font-weight-bold pf-v5-u-my-xs">
                      {m.value.toFixed(1)}
                    </FlexItem>

                    {/* Sparkline */}
                    <FlexItem className="pf-v5-u-mt-xs">
                      <Sparkline
                        data={data.map(d => d[m.label.toLowerCase() as 'enqueue' | 'dequeue' | 'total'])}
                        color={m.color}
                        height={28}
                      />
                    </FlexItem>

                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  )
}
