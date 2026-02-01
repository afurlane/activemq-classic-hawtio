import React, { useMemo } from 'react'
import { Queue } from '../../types/domain'
import { MetricsView } from '../Common/MetricsView'
import { ChartColors } from '../../themes/charts'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@patternfly/react-icons'

export const QueueMetrics: React.FC<{ history: Queue[] }> = ({ history }) => {

  const data = useMemo(() => {
    return history.map(h => ({
      size: h.size,
      enqueue: h.stats.enqueue,
      dequeue: h.stats.dequeue,
      memory: h.memory.percent,
    }))
  }, [history])

  if (data.length < 2) return null

  const last = data.at(-1)!
  const prev = data.at(-2)!

  const trend = (c: number, p: number) =>
    c > p ? <ArrowUpIcon color="var(--pf-v5-global--success-color--100)" /> :
    c < p ? <ArrowDownIcon color="var(--pf-v5-global--danger-color--100)" /> :
    <MinusIcon color="var(--pf-v5-global--palette--black-500)" />

  return (
    <MetricsView
      title="Metrics"
      items={[
        {
          label: 'Queue Size',
          value: last.size.toLocaleString(),
          trend: trend(last.size, prev.size),
          data: data.map(d => d.size),
          color: ChartColors.size
        },
        {
          label: 'Memory %',
          value: `${last.memory}%`,
          trend: trend(last.memory, prev.memory),
          data: data.map(d => d.memory),
          color: ChartColors.memory
        }
      ]}
    />
  )
}
