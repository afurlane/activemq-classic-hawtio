import React, { useEffect, useState } from 'react';
import { activemq } from '../../services/activemq';
import { buildQueuesUrl } from '../../router/router';

import {
  PageSection,
  PageSectionVariants,
  Title,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody
} from '@patternfly/react-core';

import { QueueBrowser } from './QueueBrowser';
import { QueueOperations } from './QueueOperations';
import { QueueAttributes } from './QueueAttributes';
import { QueueCharts } from './QueueCharts';
import { QueueInfo } from '../../types/activemq';
import { useQueueMetrics } from '../../hooks/useQueueMetrics';
import { QueueHealth } from './QueueHealth';
import { QueueThroughput } from './QueueThroughput';
import { QueueLag } from './QueueLag';
import { QueueAlerts } from './QueueAlerts';
import { QueueStorage } from './QueueStorage';
import { QueueDLQ } from './QueueDLQ';
import { QueueConsumers } from './QueueConsumers';

interface Props {
  queueName: string;
}

export const QueueDetailsPage: React.FC<Props> = ({ queueName }) => {
  const [info, setInfo] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInfo = async () => {
    setLoading(true);

    const queues = await activemq.listQueues();
    const q = queues.find(q => q.name === queueName);

    if (!q) {
      setInfo(null);
      setLoading(false);
      return;
    }

    const full = await activemq.getQueueInfo(q.mbean);
    setInfo(full);
    setLoading(false);
  };

  useEffect(() => {
    loadInfo();
  }, [queueName]);

  const { latest: raw, history, loading: metricsLoading } =
    useQueueMetrics(info?.mbean ?? '');

  if (loading || metricsLoading || !info || !raw) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading queue {queueName}…</Title>
      </PageSection>
    );
  }

  return (
    <>
      {/* Header */}
      <PageSection variant={PageSectionVariants.light}>
        <Grid hasGutter>
          <GridItem span={8}>
            <Title headingLevel="h2">Queue: {info.name}</Title>
          </GridItem>
          <GridItem span={4} style={{ textAlign: 'right' }}>
            <Button
              variant="secondary"
              onClick={() => (window.location.hash = buildQueuesUrl())}
            >
              Back to queues
            </Button>
          </GridItem>
        </Grid>
      </PageSection>

      {/* Summary */}
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={2}><b>Size:</b> {info.queueSize}</GridItem>
              <GridItem span={2}><b>Enqueue:</b> {info.enqueueCount}</GridItem>
              <GridItem span={2}><b>Dequeue:</b> {info.dequeueCount}</GridItem>
              <GridItem span={2}><b>Consumers:</b> {info.consumerCount}</GridItem>
              <GridItem span={2}><b>Memory:</b> {info.memoryPercentUsage}%</GridItem>
              <GridItem span={2}>
                <b>State:</b>{' '}
                {info.stopped ? 'Stopped' : info.paused ? 'Paused' : 'Running'}
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </PageSection>

      {/* Operations */}
      <PageSection>
        <Title headingLevel="h3">Operations</Title>
        <QueueOperations queue={info} onAction={loadInfo} />
      </PageSection>

      {/* Health */}
      <PageSection>
        <Title headingLevel="h3">Health</Title>
        <QueueHealth attributes={raw} />
      </PageSection>

      {/* Throughput */}
      <PageSection>
        <Title headingLevel="h3">Throughput</Title>
        <QueueThroughput history={history} />
      </PageSection>

      {/* Lag */}
      <PageSection>
        <Title headingLevel="h3">Consumer Lag</Title>
        <QueueLag attributes={raw} />
      </PageSection>

      {/* Charts */}
      <PageSection>
        <Title headingLevel="h3">Charts</Title>
        <QueueCharts history={history} />
      </PageSection>

      {/* Attributes */}
      <PageSection>
        <Title headingLevel="h3">Attributes</Title>
        <QueueAttributes attributes={raw} />
      </PageSection>

      {/* Alerts */}
      <PageSection>
        <Title headingLevel="h3">Alerts</Title>
        <QueueAlerts attributes={raw} history={history} />
      </PageSection>

      {/* Storage */}
      <PageSection>
        <Title headingLevel="h3">Storage</Title>
        <QueueStorage attributes={raw} />
      </PageSection>

      {/* DLQ */}
      <PageSection>
        <Title headingLevel="h3">DLQ</Title>
        <QueueDLQ attributes={raw} />
      </PageSection>

      {/* Consumers */}
      <PageSection>
        <Title headingLevel="h3">Consumers</Title>
        <QueueConsumers attributes={raw} history={history} />
      </PageSection>

      {/* Messages */}
      <PageSection>
        <Title headingLevel="h3">Messages</Title>
        <QueueBrowser queue={info} />
      </PageSection>
    </>
  );
};
