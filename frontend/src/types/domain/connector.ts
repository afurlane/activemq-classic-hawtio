export interface Connector {
  name: string
  mbean: string

  protocol: string
  active: boolean
  connectionCount: number

  traffic: {
    inbound: number
    outbound: number
  }
}

export function mapConnector(mbean: string, a: any): Connector {
  const parts = mbean.split(',')

  const connectorPart = parts.find(p => p.startsWith('connector='))
  const connectorNamePart = parts.find(p => p.startsWith('connectorName='))

  const name = connectorPart?.split('=')[1] ?? 'unknown'
  const protocol = connectorNamePart?.split('=')[1] ?? 'unknown'

  return {
    name,
    mbean,

    protocol,
    active: !!a.Started,
    connectionCount:
      typeof a.MaxConnectionExceededCount === 'number' && a.MaxConnectionExceededCount >= 0
        ? a.MaxConnectionExceededCount
        : 0,

    traffic: {
      inbound: 0,
      outbound: 0,
    },
  }
}
