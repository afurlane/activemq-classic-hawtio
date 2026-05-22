// components/Topics/TopicDetailsPage.tsx
import React, { useCallback, useState } from 'react'
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody,
  Alert,
  Spinner,
  Tab,
  Tabs,
  TabTitleText
} from '@patternfly/react-core'

import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useTopicMetrics } from '../../hooks/useTopicMetrics'

import { TopicInfo } from './TopicInfo'
import { TopicTrends } from './TopicTrends'
import { TopicAlerts } from './TopicAlerts'
import { TopicSubscribers } from './TopicSubscribers'
import { TopicProducers } from './TopicProducers'
import { TopicBrowser } from './TopicBrowser'
import { TopicOperations } from './TopicOperations'
import { TopicSendMessage } from './TopicSendMessage'
import { TopicDelete } from './TopicDelete'

interface Props {
  topicName: string
}

const loadingTitleStyle = { marginTop: 12 }

export const TopicDetailsPage: React.FC<Props> = ({ topicName }) => {
  const brokerName = useSelectedBrokerName()
  const [activeTab, setActiveTab] = useState('info')
  const handleTabSelect = useCallback((_: unknown, key: string | number) => {
    setActiveTab(String(key))
  }, [])
  const { data, error, isLoading } = useTopicMetrics(brokerName, topicName)
  
  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert variant="danger" title="No broker selected" isInline />
        </CardBody>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <PageSection>
        <Spinner size="lg" />
        <Title headingLevel="h3" style={loadingTitleStyle}>
          Loading topic…
        </Title>
      </PageSection>
    )
  }

  if (error || !data) {
    return (
      <PageSection>
        <Alert variant="danger" title={String(error)} isInline />
      </PageSection>
    )
  }

  const { latest, history } = data

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Topic: {latest.name}</Title>
      </PageSection>

      <PageSection>
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
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
        {activeTab === 'info' && <TopicInfo latest={latest} />}
        {activeTab === 'messages' && <TopicBrowser mbean={latest.mbean} />}
        {activeTab === 'charts' && <TopicTrends history={history} />}
        {activeTab === 'alerts' && <TopicAlerts latest={latest} />}
        {activeTab === 'subscribers' && <TopicSubscribers latest={latest} />}
        {activeTab === 'producers' && <TopicProducers latest={latest} />}
        {activeTab === 'operations' && <TopicOperations />}
        {activeTab === 'send' && <TopicSendMessage />}
        {activeTab === 'delete' && <TopicDelete mbean={latest.mbean} />}
      </PageSection>
    </>
  )
}
