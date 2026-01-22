import { useEffect, useState } from 'react'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Subscription } from '../types/domain'

export function useSubscriptions(mbean: string) {
  const [subs, setSubs] = useState<Subscription[]>([])

  useEffect(() => {
    activemq.listSubscriptions(mbean).then(setSubs)
  }, [mbean])

  return subs
}
