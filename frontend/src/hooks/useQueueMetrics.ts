import { useEffect, useState } from 'react'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Queue } from '../types/domain'

export interface QueueMetrics {
  latest: Queue | null
  history: Queue[]
  loading: boolean
}

export function useQueueMetrics(mbean: string, intervalMs: number = 2000): QueueMetrics {
  const [latest, setLatest] = useState<Queue | null>(null)
  const [history, setHistory] = useState<Queue[]>([])
  const [loading, setLoading] = useState(true)

  const poll = async () => {
    if (!mbean) return

    // ⬅️ ActiveMQClassicService deve avere questo metodo
    const q = await activemq.getQueue(mbean)
    if (!q) return

    setLatest(q)

    setHistory(prev => {
      const next = [...prev, q]
      return next.slice(-120)
    })

    setLoading(false)
  }

  useEffect(() => {
    setLatest(null)
    setHistory([])
    setLoading(true)

    if (mbean) poll()

    const id = setInterval(() => {
      if (mbean) poll()
    }, intervalMs)

    return () => clearInterval(id)
  }, [mbean, intervalMs])

  return { latest, history, loading }
}
