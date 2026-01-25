import useSWR from 'swr'
import { jolokiaService } from '@hawtio/react'

export const BROKER_SEARCH =
  'org.apache.activemq:type=Broker,brokerName=*'

export interface BrokerInfo {
  name: string
  mbean: string
}

function mapBrokers(mbeans: string[]): BrokerInfo[] {
  return mbeans.map(mbean => {
    const match = /brokerName=([^,]+)/.exec(mbean)
    return { name: match?.[1] ?? 'unknown', mbean }
  })
}

export function useBrokers() {
  const { data, error, isLoading } = useSWR<BrokerInfo[]>(
    'brokers',
    async () => {
      const mbeans = await jolokiaService.search(BROKER_SEARCH)
      return mapBrokers(mbeans)
    },
    { refreshInterval: 10000 }
  )

  return {
    brokers: data ?? [],
    error,
    isLoading,
  }
}
