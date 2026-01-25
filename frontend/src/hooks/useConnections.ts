import useSWR from 'swr'
import { activemq } from '../services/activemq/ActiveMQClassicService'

export function useConnections(connectorMBean: string | null) {
  return useSWR<any[]>(
    connectorMBean ? ['connections', connectorMBean] : null,
    () => activemq.listConnections(connectorMBean!),
    { refreshInterval: 5000 }
  )
}
