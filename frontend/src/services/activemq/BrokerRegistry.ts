import { jolokiaService } from '@hawtio/react'
import { Cache } from '../swrcacheimpl'
import { log } from '../../globals'
import { debuglog } from 'node:util'

const BROKER_SEARCH = 'org.apache.activemq:type=Broker,brokerName=*'

export interface BrokerInfo {
  name: string
  mbean: string
}

type Listener = (brokers: BrokerInfo[]) => void

export class BrokerRegistry {
  private cache = new Cache(10000)
  private listeners: Listener[] = []
  private refreshing = false

  async refresh(force = false): Promise<BrokerInfo[]> {
    log.debug('[BrokerRegistry] refresh(force=', force, ')')

    if (this.refreshing) {
      log.debug('[BrokerRegistry] refresh skipped (already refreshing)')
      const cached = this.cache.get<BrokerInfo[]>('brokers')
      return cached ?? []
    }

    const cached = !force ? this.cache.get<BrokerInfo[]>('brokers') : undefined
    if (cached && cached.length > 0) {
      log.debug('[BrokerRegistry] returning cached brokers')
      return cached
    }

    this.refreshing = true
    try {
      log.debug('[BrokerRegistry] fetching brokers from Jolokia…')
      const mbeans = await jolokiaService.search(BROKER_SEARCH)

      const brokers = mbeans.map((mbean: string) => {
        const match = /brokerName=([^,]+)/.exec(mbean)
        return { name: match?.[1] ?? 'unknown', mbean }
      })

      log.debug('[BrokerRegistry] fetched brokers:', brokers)

      this.cache.set(brokers, 10000, 'brokers')
      this.notify(brokers)

      return brokers
    } finally {
      this.refreshing = false
    }
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
    log.debug('[BrokerRegistry] notifying listeners:', brokers)
    this.listeners.forEach(l => l(brokers))
  }
}

export const brokerRegistry = new BrokerRegistry()
