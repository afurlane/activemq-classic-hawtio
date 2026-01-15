import React, { useEffect, useState } from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Card,
  CardBody
} from '@patternfly/react-core';

import { topics } from '../../services/topics';
import { TopicInfo } from './TopicInfo';
import { TopicCharts } from './TopicCharts';
import { TopicAlerts } from './TopicAlerts';
import { TopicOperations } from './TopicOperations';
import { TopicSendMessage } from './TopicSendMessage';
import { TopicDelete } from './TopicDelete';
import { TopicSubscribers } from './TopicSubscribers';
import { TopicProducers } from './TopicProducers';

export const TopicDetailsPage: React.FC<{ topicName: string }> = ({ topicName }) => {
  const [mbean, setMbean] = useState<string | null>(null);
  const [attrs, setAttrs] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const load = async () => {
    const list = await topics.listTopics();
    const topic = list.find(t => t.name === topicName);
    if (!topic) return;

    setMbean(topic.mbean);

    const a = await topics.getTopicAttributes(topic.mbean);
    setAttrs(a);

    setHistory(prev => [...prev, a].slice(-50));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [topicName]);

  if (!attrs) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading topic…</Title>
      </PageSection>
    );
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
        <TopicAlerts attrs={attrs} history={history} />
      </PageSection>

      {/* Subscribers */}
      <PageSection>
        <TopicSubscribers topicName={topicName} />
      </PageSection>

      {/* Producers */}
      <PageSection>
        <TopicProducers topicName={topicName} />
      </PageSection>

      {/* Operations */}
      <PageSection>
        <TopicOperations mbean={mbean!} />
      </PageSection>

      {/* Send Message */}
      <PageSection>
        <TopicSendMessage mbean={mbean!} />
      </PageSection>

      {/* Delete */}
      <PageSection>
        <TopicDelete mbean={mbean!} />
      </PageSection>
    </>
  );
};
