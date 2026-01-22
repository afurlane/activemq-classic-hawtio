import { jolokiaService } from '@hawtio/react'
import { Cache } from '../cache'

const BROKER_SEARCH = 'org.apache.activemq:type=Broker,brokerName=*'

export interface BrokerInfo {
  name: string
  mbean: string
}

type Listener = (brokers: BrokerInfo[]) => void

export class BrokerRegistry {
  private cache = new Cache(10000)
  private listeners: Listener[] = []

  async refresh(force = false): Promise<BrokerInfo[]> {
    const cached = !force ? this.cache.get<BrokerInfo[]>('brokers') : undefined
    if (cached) return cached

    const mbeans = await jolokiaService.search(BROKER_SEARCH)

    const brokers = mbeans.map((mbean: string) => {
      const match = /brokerName=([^,]+)/.exec(mbean)
      return { name: match?.[1] ?? 'unknown', mbean }
    })

    this.cache.set(brokers, 10000, 'brokers')
    this.notify(brokers)
    return brokers
  }

  getBrokers(): BrokerInfo[] {
    return this.cache.get<BrokerInfo[]>('brokers') ?? []
  }

  getBroker(name: string): BrokerInfo | undefined {
    return this.getBrokers().find(b => b.name === name)
  }

  onChange(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify(brokers: BrokerInfo[]) {
    this.listeners.forEach(l => l(brokers))
  }
}

export const brokerRegistry = new BrokerRegistry()
