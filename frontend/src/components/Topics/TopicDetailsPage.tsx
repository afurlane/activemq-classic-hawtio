import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  Title
} from '@patternfly/react-core'

import { activemq, getBrokerMBean } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

import { TopicInfo } from './TopicInfo'
import { TopicCharts } from './TopicCharts'
import { TopicAlerts } from './TopicAlerts'
import { TopicOperations } from './TopicOperations'
import { TopicSendMessage } from './TopicSendMessage'
import { TopicDelete } from './TopicDelete'
import { TopicSubscribers } from './TopicSubscribers'
import { TopicProducers } from './TopicProducers'

import { ActiveMQTopicAttributes } from '../../types/activemq'

interface Props {
  topicName: string
}

export const TopicDetailsPage: React.FC<Props> = ({ topicName }) => {
  const brokerName = useSelectedBrokerName()

  const [mbean, setMbean] = useState<string | null>(null)
  const [attrs, setAttrs] = useState<ActiveMQTopicAttributes | null>(null)
  const [history, setHistory] = useState<ActiveMQTopicAttributes[]>([])
  const [error, setError] = useState<string | null>(null)

  const mounted = useRef(false)

  const load = async () => {
    if (!brokerName || !mounted.current) return

    try {
      const list = await activemq.listTopics(brokerName)
      const topic = list.find(t => t.name === topicName)
      if (!topic) {
        setError(`Topic "${topicName}" not found`)
        return
      }

      setMbean(topic.mbean)

      const a = await activemq.getTopicAttributes(topic.mbean)
      if (!mounted.current) return

      setAttrs(a)
      setHistory(prev => [...prev, a].slice(-50))
      setError(null)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load topic data')
    }
  }

  useEffect(() => {
    mounted.current = true
    load()
    const id = setInterval(load, 5000)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [brokerName, topicName])

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <PageSection>
        <Alert variant="danger" title={error} isInline />
      </PageSection>
    )
  }

  if (!attrs) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading topic…</Title>
      </PageSection>
    )
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Topic: {topicName}</Title>
      </PageSection>

      <PageSection><TopicInfo attrs={attrs} /></PageSection>
      <PageSection><TopicCharts history={history} /></PageSection>
      <PageSection><TopicAlerts attrs={attrs} /></PageSection>
      <PageSection><TopicSubscribers attrs={attrs} /></PageSection>
      <PageSection><TopicProducers attrs={attrs} /></PageSection>
      <PageSection><TopicOperations /></PageSection>
      <PageSection><TopicSendMessage /></PageSection>
      <PageSection><TopicDelete mbean={mbean!} /></PageSection>
    </>
  )
}
