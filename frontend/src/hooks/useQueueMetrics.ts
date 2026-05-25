import { useEffect, useState, useCallback } from 'react'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'

export interface QueueMetrics {
  latest: Queue | null
  history: Queue[]
  loading: boolean
  refresh: () => void
}

export function useQueueMetrics(
  mbean: string,
  autoRefresh: boolean,
  intervalMs: number
): QueueMetrics {
  const [latest, setLatest] = useState<Queue | null>(null)
  const [history, setHistory] = useState<Queue[]>([])
  const [loading, setLoading] = useState(true)

  const poll = useCallback(async () => {
    if (!mbean) return

    const q = await activemq.getQueue(mbean)
    if (!q) return

    setLatest(q)

    setHistory(prev => {
      const next = [...prev, q]
      return next.slice(-120)
    })

    setLoading(false)
  }, [mbean])

  useEffect(() => {
    setLatest(null)
    setHistory([])
    setLoading(true)

    if (mbean) poll()
  }, [mbean, poll])

  useEffect(() => {
    if (!autoRefresh) return

    const id = setInterval(() => {
      poll()
    }, intervalMs)

    return () => clearInterval(id)
  }, [autoRefresh, intervalMs, poll])

  return { latest, history, loading, refresh: poll }
}
