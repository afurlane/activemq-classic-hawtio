import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import type { Subscription, Topic } from '../types/domain'
import type { ActiveMQTopicAttributes } from '../types/activemq'
import { useRef } from 'react'

export interface TopicMetricsLatest {
  name: string
  mbean: string
  objectName?: string
  size: number
  producers: number
  consumers: number
  memoryPercent: number
  memoryLimit: number
  memoryUsageBytes: number

  enqueue: number
  dequeue: number
  dispatch: number
  averageEnqueueTime: number | null
  maxEnqueueTime: number | null
  minEnqueueTime: number | null
  averageMessageSize: number | null
  maxMessageSize: number | null
  minMessageSize: number | null
  networkEnqueues: number | null
  networkDequeues: number | null
  options?: string

  subscriptions: Subscription[]
}

export interface TopicMetricsHistory {
  size: number[]
  enqueueRate: number[]
  dequeueRate: number[]
  dispatchRate: number[]
}

export function useTopicMetrics(brokerName: string | null, topicName: string | null) {
  const enabled = !!brokerName && !!topicName
  const historyRef = useRef<TopicMetricsHistory>({
    size: [],
    enqueueRate: [],
    dequeueRate: [],
    dispatchRate: []
  })

  return useSWR(
    enabled ? ['topic-metrics', brokerName, topicName] : null,
    enabled
      ? async () => {
          const { topic, attrs, subscriptions } = await loadTopicInfo(brokerName!, topicName!)
          const latest = buildLatest(topic, attrs, subscriptions)
          const history = updateHistory(latest, historyRef)
          return { latest, history }
        }
      : null,
    {
      refreshInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false
    }
  )
}

async function loadTopicInfo(brokerName: string, topicName: string) {
  const topics: Topic[] = await activemq.listTopics(brokerName)
  const topic = topics.find(t => t.name === topicName)
  if (!topic) throw new Error(`Topic "${topicName}" not found`)

  const attrs = await activemq.getTopicAttributes(topic.mbean)
  const subscriptions = await activemq.listSubscriptions(topic.mbean)

  return { topic, attrs, subscriptions }
}

const numberOrZero = (value: number | null | undefined) => value ?? 0
const numberOrNull = (value: number | null | undefined) => value ?? null

function updateHistory(
  latest: TopicMetricsLatest,
  historyRef: React.MutableRefObject<TopicMetricsHistory>
) {
  const h = historyRef.current

  const lastEnq = h.enqueueRate.at(-1) ?? latest.enqueue
  const lastDeq = h.dequeueRate.at(-1) ?? latest.dequeue
  const lastDis = h.dispatchRate.at(-1) ?? latest.dispatch

  h.size = [...h.size, latest.size].slice(-50)
  h.enqueueRate = [...h.enqueueRate, latest.enqueue - lastEnq].slice(-50)
  h.dequeueRate = [...h.dequeueRate, latest.dequeue - lastDeq].slice(-50)
  h.dispatchRate = [...h.dispatchRate, latest.dispatch - lastDis].slice(-50)

  return { ...h }
}

function buildLatest(
  topic: Topic,
  attrs: ActiveMQTopicAttributes,
  subscriptions: Subscription[]
): TopicMetricsLatest {
  return {
    name: topic.name,
    mbean: topic.mbean,
    objectName: attrs.ObjectName,
    size: numberOrZero(attrs.QueueSize),
    producers: numberOrZero(attrs.ProducerCount),
    consumers: numberOrZero(attrs.ConsumerCount),
    memoryPercent: numberOrZero(attrs.MemoryPercentUsage),
    memoryLimit: numberOrZero(attrs.MemoryLimit),
    memoryUsageBytes: numberOrZero(attrs.MemoryUsageByteCount),
    enqueue: numberOrZero(attrs.EnqueueCount),
    dequeue: numberOrZero(attrs.DequeueCount),
    dispatch: numberOrZero(attrs.DispatchCount),
    averageEnqueueTime: numberOrNull(attrs.AverageEnqueueTime),
    maxEnqueueTime: numberOrNull(attrs.MaxEnqueueTime),
    minEnqueueTime: numberOrNull(attrs.MinEnqueueTime),
    averageMessageSize: numberOrNull(attrs.AverageMessageSize),
    maxMessageSize: numberOrNull(attrs.MaxMessageSize),
    minMessageSize: numberOrNull(attrs.MinMessageSize),
    networkEnqueues: numberOrNull(attrs.NetworkEnqueues),
    networkDequeues: numberOrNull(attrs.NetworkDequeues),
    options: attrs.Options,
    subscriptions
  }
}
