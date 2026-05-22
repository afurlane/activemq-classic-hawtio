import { jolokiaService } from '@hawtio/react'
import { BrokerInfo } from '../../../hooks/useBrokers'

export type ResolveBrokerFn = (name?: string) => Promise<BrokerInfo | null>

export function normalizeBulk<T>(r: any) {
  if (r.status !== 200 || r.error) {
    return { request: r.request, value: null as T | null }
  }
  return { request: r.request, value: r.value as T }
}

export function getBrokerMBean(brokerName: string) {
  return `org.apache.activemq:type=Broker,brokerName=${brokerName}`
}

export function getBrokerMBeanFromQueueMBean(queueMBean: string): string {
  const match = queueMBean.match(/brokerName=([^,]+)/)
  if (!match) {
    throw new Error(`Cannot extract brokerName from MBean: ${queueMBean}`)
  }
  const brokerName = match[1]
  return `org.apache.activemq:type=Broker,brokerName=${brokerName}`
}

export function base(brokerName: string) {
  return getBrokerMBean(brokerName)
}

export async function resolveBroker(name?: string): Promise<BrokerInfo | null> {
  if (name && name.trim().length > 0) {
    return {
      name,
      mbean: getBrokerMBean(name),
    }
  }

  const mbeans = await jolokiaService.search('org.apache.activemq:type=Broker,brokerName=*')

  if (!mbeans || mbeans.length === 0) {
    return null
  }

  const mbean = mbeans[0]
  if (!mbean) {
    return null
  }

  const match = /brokerName=([^,]+)/.exec(mbean)
  const brokerName = match?.[1] ?? 'default'

  return {
    name: brokerName,
    mbean,
  }
}
