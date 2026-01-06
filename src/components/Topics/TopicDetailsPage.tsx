import React, { useEffect, useState } from 'react';
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

  if (!attrs) return <div>Loading topic…</div>;

  return (
    <div>
      <h2>Topic: {topicName}</h2>

      <TopicInfo attrs={attrs} />
      <TopicCharts history={history} />
      <TopicAlerts attrs={attrs} history={history} />
      <TopicSubscribers topicName={topicName} />
      <TopicProducers topicName={topicName} />
      <TopicOperations mbean={mbean!} />
      <TopicSendMessage mbean={mbean!} />
      <TopicDelete mbean={mbean!} />
    </div>
  );
};
