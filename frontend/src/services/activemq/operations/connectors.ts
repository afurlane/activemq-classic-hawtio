import { jolokiaService } from '@hawtio/react'
import { JolokiaRequest, RequestType } from 'jolokia.js'
import { mapConnector, Connector } from '../../../types/domain'
import { ActiveMQConnectorAttributes } from '../../../types/activemq'
import { base, normalizeBulk, ResolveBrokerFn } from './common'

export async function listConnectors(resolveBroker: ResolveBrokerFn, brokerName?: string): Promise<Connector[]> {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},connector=*,connectorName=*`
  const mbeans = await jolokiaService.search(pattern)

  const requests: JolokiaRequest[] = mbeans.map(mbean => ({
    type: 'read' as RequestType,
    mbean,
  } as JolokiaRequest))

  const raw = await jolokiaService.bulkRequest(requests)

  return raw
    .map(normalizeBulk<ActiveMQConnectorAttributes>)
    .filter(r => r.value)
    .map(r => mapConnector(r.request.mbean, r.value!))
}

export async function listConnections(connectorMBean: string): Promise<any[]> {
  const attrs = await jolokiaService.readAttributes(connectorMBean) as ActiveMQConnectorAttributes
  return attrs?.Connections ?? []
}

export async function listConsumers(resolveBroker: ResolveBrokerFn, brokerName: string): Promise<string[]> {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},destinationType=Queue,destinationName=*,consumerId=*`
  return jolokiaService.search(pattern)
}

export async function getConsumerAttributes(mbean: string): Promise<any> {
  return jolokiaService.readAttributes(mbean)
}

export async function listProducers(resolveBroker: ResolveBrokerFn, brokerName: string): Promise<string[]> {
  const broker = await resolveBroker(brokerName)
  if (!broker) return []

  const pattern = `${base(broker.name)},destinationType=Queue,destinationName=*,producerId=*`
  return jolokiaService.search(pattern)
}

export async function getProducerAttributes(mbean: string): Promise<any> {
  return jolokiaService.readAttributes(mbean)
}

export async function dropConnection(connectorMBean: string, connectionId: string) {
  return await jolokiaService.execute(connectorMBean, 'dropConnection(java.lang.String)', [connectionId])
}
