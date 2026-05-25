import { useCallback, useEffect, useState } from 'react'
import { activemq } from 'src/services/activemq/ActiveMQClassicService'
import { Queue } from 'src/types/domain'

export interface BrokerMetrics {
  totalSize: number
  totalInflight: number
  totalLag: number
  avgMemory: number
  consumers: number
  storage: {
    store: number
    cursor: number
    memory: number
    temp: number
  }
  throughput: {
    enqueue: number
    dequeue: number
    dispatch: number
  }
  topConsumers: any[]
  topProducers: any[]
}
export interface BrokerMetricsHistory {
  totalSize: number[]
  totalInflight: number[]
  totalLag: number[]
  avgMemory: number[]
  enqueueRate: number[]
  dequeueRate: number[]
  dispatchRate: number[]
}

export async function fetchBrokerQueues(brokerName: string) {
  return activemq.listQueues(brokerName)
}

export async function fetchBrokerStorage(brokerName: string) {
  const queues = await activemq.listQueuesWithRawAttributes(brokerName)

  let store = 0
  let cursor = 0
  let memory = 0
  let tempSum = 0
  let tempCount = 0

  queues.forEach(q => {
    store += q.attrs.StoreMessageSize ?? 0
    cursor += q.attrs.CursorMemoryUsage ?? 0
    memory += q.attrs.MemoryUsageByteCount ?? 0

    if (q.attrs.TempUsagePercentUsage !== undefined) {
      tempSum += q.attrs.TempUsagePercentUsage
      tempCount++
    }
  })

  return {
    store,
    cursor,
    memory,
    temp: tempCount > 0 ? tempSum / tempCount : 0,
  }
}

export async function fetchTopConsumers(brokerName: string) {
  const mbeans = await activemq.listConsumers(brokerName)
  const attrs = await Promise.all(
    mbeans.map(m => activemq.getConsumerAttributes(m))
  )

  return attrs
    .map(a => ({
      clientId: a.ClientId ?? 'unknown',
      destination: a.DestinationName ?? 'unknown',
      dispatched: a.DispatchedCounter ?? 0,
      dequeue: a.DequeueCounter ?? 0,
      pending: a.PendingQueueSize ?? 0,
      slow: a.SlowConsumer ?? false,
    }))
    .sort((a, b) => b.dispatched - a.dispatched)
    .slice(0, 10)
}

export async function fetchTopProducers(brokerName: string) {
  const mbeans = await activemq.listProducers(brokerName)
  const attrs = await Promise.all(
    mbeans.map(m => activemq.getProducerAttributes(m))
  )

  return attrs
    .map(a => ({
      clientId: a.ClientId ?? 'unknown',
      destination: a.DestinationName ?? 'unknown',
      sent: a.SentCount ?? 0,
      blocked: a.ProducerBlocked ?? false,
      pctBlocked: a.PercentageBlocked ?? 0,
    }))
    .sort((a, b) => b.sent - a.sent)
    .slice(0, 10)
}

export function buildBrokerSnapshot(queues: Queue[], storage: any, topConsumers: any[], topProducers: any[]) {
  let totalSize = 0
  let totalInflight = 0
  let totalLag = 0
  let consumers = 0
  let memorySum = 0

  let enqueue = 0
  let dequeue = 0
  let dispatch = 0

  queues.forEach((q: Queue) => {
    const size = q.size ?? 0
    const inflight = q.stats.inflight ?? 0
    const mem = q.memory.percent ?? 0

    totalSize += size
    totalInflight += inflight
    totalLag += size - inflight
    consumers += q.consumers
    memorySum += mem

    enqueue += q.stats.enqueue ?? 0
    dequeue += q.stats.dequeue ?? 0
    dispatch += q.stats.dispatch ?? 0
  })

  const avgMemory = queues.length > 0 ? memorySum / queues.length : 0

  return {
    totalSize,
    totalInflight,
    totalLag,
    avgMemory,
    consumers,
    storage,
    throughput: { enqueue, dequeue, dispatch },
    topConsumers,
    topProducers,
  }
}

interface UseBrokerMetricsResult {
  latest: BrokerMetrics | null
  history: BrokerMetricsHistory
  loading: boolean
  refresh: () => Promise<void>
}

export function useBrokerMetrics(brokerName: string | null, autoRefresh: boolean, interval: number): UseBrokerMetricsResult {
  const [latest, setLatest] = useState<BrokerMetrics | null>(null)
  const [history, setHistory] = useState<BrokerMetricsHistory>({totalSize: [], totalInflight: [], totalLag: [], 
    avgMemory: [], enqueueRate: [], dequeueRate: [], dispatchRate: [],})

  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!brokerName) {
      setLatest(null)
      setLoading(false)
      return
    }

    setLoading(true)

    const [queues, storage, topConsumers, topProducers] = await Promise.all([
      fetchBrokerQueues(brokerName),
      fetchBrokerStorage(brokerName),
      fetchTopConsumers(brokerName),
      fetchTopProducers(brokerName),
    ])

    const snap = buildBrokerSnapshot(queues, storage, topConsumers, topProducers)

    setLatest(snap)

    setHistory(prev => {
      const dt = interval / 1000

      const prevEnq = prev.enqueueRate.at(-1) ?? snap.throughput.enqueue
      const prevDeq = prev.dequeueRate.at(-1) ?? snap.throughput.dequeue
      const prevDis = prev.dispatchRate.at(-1) ?? snap.throughput.dispatch

      return {
        totalSize: [...prev.totalSize, snap.totalSize].slice(-50),
        totalInflight: [...prev.totalInflight, snap.totalInflight].slice(-50),
        totalLag: [...prev.totalLag, snap.totalLag].slice(-50),
        avgMemory: [...prev.avgMemory, snap.avgMemory].slice(-50),

        enqueueRate: [...prev.enqueueRate, (snap.throughput.enqueue - prevEnq) / dt].slice(-50),
        dequeueRate: [...prev.dequeueRate, (snap.throughput.dequeue - prevDeq) / dt].slice(-50),
        dispatchRate: [...prev.dispatchRate, (snap.throughput.dispatch - prevDis) / dt].slice(-50),
      }
    })

    setLoading(false)
  }, [brokerName, interval])

  useEffect(() => {
    load()
  }, [brokerName, load])

  // 🔥 Auto-refresh stabile
  useEffect(() => {
    if (!autoRefresh || !brokerName) return
    const id = setInterval(load, interval)
    return () => clearInterval(id)
  }, [autoRefresh, interval, brokerName, load])

  return { latest, history, loading, refresh: load }
}