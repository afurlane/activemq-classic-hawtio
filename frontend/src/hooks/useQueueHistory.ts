import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'
import { useEffect, useState } from 'react';

export function useQueueHistory(brokerName: string | null) {
  return useSWR<Record<string, { queueSize: number[]; inflight: number[]; lag: number[] }>>(
    brokerName ? ['queue-history', brokerName] : null,
    async ([_key, broker]) => {
      const queues = await activemq.listQueues(broker)

      const history: Record<string, { queueSize: number[]; inflight: number[]; lag: number[] }> = {}

      queues.forEach(q => {
        const inflight = q.stats.inflight ?? 0
        const size = q.size ?? 0
        const lag = size - inflight

        history[q.name] = {
          queueSize: [size],
          inflight: [inflight],
          lag: [lag],
        }
      })

      return history
    },
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )
}

export function useQueueHistoryAccumulated(brokerName: string | null) {
  const { data: snapshot } = useQueueHistory(brokerName)

  const [acc, setAcc] = useState<Record<string, { queueSize: number[]; inflight: number[]; lag: number[] }>>({})

  useEffect(() => {
    if (!snapshot) return

    const next = { ...acc }

    Object.entries(snapshot).forEach(([name, h]) => {
      if (!next[name]) {
        next[name] = { queueSize: [], inflight: [], lag: [] }
      }

      next[name].queueSize = [...next[name].queueSize, ...h.queueSize].slice(-30)
      next[name].inflight = [...next[name].inflight, ...h.inflight].slice(-30)
      next[name].lag = [...next[name].lag, ...h.lag].slice(-30)
    })

    setAcc(next)
  }, [snapshot])

  return acc
}
