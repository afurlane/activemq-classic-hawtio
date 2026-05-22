import { ActiveMQDLQAttributes } from '../activemq'
import { mapQueue, Queue } from './queue'

export interface DLQ extends Queue {
  audit: {
    duplicateFromStore: number
    sendDuplicateToDLQ: boolean
    maxProducersToAudit: number
    maxAuditDepth: number
  }
}

export function mapDLQ(mbean: string, a: ActiveMQDLQAttributes): DLQ {
  const base = mapQueue(mbean, a)

  return {
    ...base,
    audit: {
      duplicateFromStore: a.DuplicateFromStoreCount,
      sendDuplicateToDLQ: a.SendDuplicateFromStoreToDLQ,
      maxProducersToAudit: a.MaxProducersToAudit,
      maxAuditDepth: a.MaxAuditDepth,
    },
  }
}
