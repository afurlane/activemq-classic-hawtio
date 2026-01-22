import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  Title
} from '@patternfly/react-core'

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

import { TopicInfo } from './TopicInfo'
import { TopicCharts } from './TopicCharts'
import { TopicAlerts } from './TopicAlerts'
import { TopicOperations } from './TopicOperations'
import { TopicSendMessage } from './TopicSendMessage'
import { TopicDelete } from './TopicDelete'
import { TopicSubscribers } from './TopicSubscribers'
import { TopicProducers } from './TopicProducers'

export const TopicDetailsPage: React.FC<{ topicName: string }> = ({ topicName }) => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  const [mbean, setMbean] = useState<string | null>(null)
  const [attrs, setAttrs] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const mounted = useRef(false)

  const load = async () => {
    if (!brokerName || !mounted.current) return

    const list = await activemq.listTopics(brokerName)
    const topic = list.find(t => t.name === topicName)
    if (!topic) return

    setMbean(topic.mbean)

    const a = await activemq.getTopicAttributes(topic.mbean)
    if (!mounted.current) return

    setAttrs(a)
    setHistory(prev => [...prev, a].slice(-50))
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

  if (!attrs) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading topic…</Title>
      </PageSection>
    )
  }

  return (
    <>
      {/* Header */}
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Topic: {topicName}</Title>
      </PageSection>

      {/* Info */}
      <PageSection>
        <TopicInfo attrs={attrs} />
      </PageSection>

      {/* Charts */}
      <PageSection>
        <TopicCharts history={history} />
      </PageSection>

      {/* Alerts */}
      <PageSection>
        <TopicAlerts attrs={attrs} />
      </PageSection>

      {/* Subscribers */}
      <PageSection>
        <TopicSubscribers attrs={attrs} />
      </PageSection>

      {/* Producers */}
      <PageSection>
        <TopicProducers attrs={attrs} />
      </PageSection>

      {/* Operations */}
      <PageSection>
        <TopicOperations />
      </PageSection>

      {/* Send Message */}
      <PageSection>
        <TopicSendMessage />
      </PageSection>

      {/* Delete */}
      <PageSection>
        <TopicDelete mbean={mbean!} />
      </PageSection>
    </>
  )
}
