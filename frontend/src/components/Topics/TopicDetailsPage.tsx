import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  TabTitleText,
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
import { TopicBrowser } from './TopicBrowser'

interface Props {
  topicName: string
}

export const TopicDetailsPage: React.FC<Props> = ({ topicName }) => {
  const brokerName = useSelectedBrokerName()

  const [mbean, setMbean] = useState<string | null>(null)
  const [attrs, setAttrs] = useState<ActiveMQTopicAttributes | null>(null)
  const [history, setHistory] = useState<ActiveMQTopicAttributes[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('info')

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

      <PageSection>
        <Tabs
          activeKey={activeTab}
          onSelect={(_, key) => setActiveTab(key as string)}
        >
          <Tab eventKey="info" title={<TabTitleText>Info</TabTitleText>} />
          <Tab eventKey="messages" title={<TabTitleText>Messages</TabTitleText>} />
          <Tab eventKey="charts" title={<TabTitleText>Charts</TabTitleText>} />
          <Tab eventKey="alerts" title={<TabTitleText>Alerts</TabTitleText>} />
          <Tab eventKey="subscribers" title={<TabTitleText>Subscribers</TabTitleText>} />
          <Tab eventKey="producers" title={<TabTitleText>Producers</TabTitleText>} />
          <Tab eventKey="operations" title={<TabTitleText>Operations</TabTitleText>} />
          <Tab eventKey="send" title={<TabTitleText>Send</TabTitleText>} />
          <Tab eventKey="delete" title={<TabTitleText>Delete</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection>
        {activeTab === 'info' && <TopicInfo attrs={attrs} />}
        {activeTab === 'messages' && <TopicBrowser mbean={mbean!} />}
        {activeTab === 'charts' && <TopicCharts history={history} />}
        {activeTab === 'alerts' && <TopicAlerts attrs={attrs} />}
        {activeTab === 'subscribers' && <TopicSubscribers attrs={attrs} />}
        {activeTab === 'producers' && <TopicProducers attrs={attrs} />}
        {activeTab === 'operations' && <TopicOperations />}
        {activeTab === 'send' && <TopicSendMessage />}
        {activeTab === 'delete' && <TopicDelete mbean={mbean!} />}
      </PageSection>
    </>
)
}
