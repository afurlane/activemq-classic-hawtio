import { useEffect, useState } from 'react'
import { activemq } from '../services/activemq/ActiveMQClassicService'
import { Message } from '../types/domain'

export function useMessages(mbean: string, page: number, pageSize: number) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    activemq.browseQueue(mbean, page, pageSize).then(setMessages)
  }, [mbean, page, pageSize])

  return messages
}
