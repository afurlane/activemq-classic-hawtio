import React, { useEffect, useState } from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Checkbox,
  TextInput,
  Card,
  CardBody,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core';

import { activemq } from '../../services/activemq';
import { Sparkline } from '../Common/Sparkline';
import { BrokerTrends } from './BrokerTrends';
import { Label } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';


export const BrokerOverview: React.FC = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [history, setHistory] = useState<Record<
    string,
    { queueSize: number[]; inflight: number[]; lag: number[] }
  >>({});

  const [filter, setFilter] = useState({
    critical: false,
    backlog: false,
    name: '',
  });

  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await activemq.listQueuesWithAttributes();

    const newHistory = { ...history };

    data.forEach(({ info, attrs }) => {
      const key = info.name;
      const lag = attrs.QueueSize - attrs.InflightCount;

      if (!newHistory[key]) {
        newHistory[key] = { queueSize: [], inflight: [], lag: [] };
      }

      newHistory[key].queueSize = [...newHistory[key].queueSize, attrs.QueueSize].slice(-30);
      newHistory[key].inflight = [...newHistory[key].inflight, attrs.InflightCount].slice(-30);
      newHistory[key].lag = [...newHistory[key].lag, lag].slice(-30);
    });

    setHistory(newHistory);
    setQueues(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <p>Loading broker overview…</p>;

  // Filtri
  const filtered = queues.filter(({ info, attrs }) => {
    if (filter.critical && attrs.MemoryPercentUsage < 80 && attrs.QueueSize < 10000) return false;
    if (filter.backlog && attrs.QueueSize < 1000) return false;
    if (filter.name && !info.name.toLowerCase().includes(filter.name.toLowerCase())) return false;
    return true;
  });

  // Top 5 slowest queues
  const slowest = [...queues]
    .map(({ info, attrs }) => {
      const lag = attrs.QueueSize - attrs.InflightCount;
      const score = lag + attrs.InflightCount * 2 - attrs.DispatchCount;
      return { info, attrs, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Broker Overview</Title>
      </PageSection>

      <PageSection>
        <BrokerTrends />
      </PageSection>

      {/* FILTRI */}
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <Checkbox
                  id="filter-critical"
                  label="Critical only"
                  isChecked={filter.critical}
                  onChange={(event, checked) => setFilter({ ...filter, critical: checked })}
                />
              </ToolbarItem>

              <ToolbarItem>
                <Checkbox
                  id="filter-backlog"
                  label="Backlog > 1000"
                  isChecked={filter.backlog}
                  onChange={(event, checked) => setFilter({ ...filter, backlog: checked })}
                />
              </ToolbarItem>

              <ToolbarItem>
                <TextInput
                  value={filter.name}
                  type="text"
                  placeholder="Filter by name..."
                  onChange={(event, value) => setFilter({ ...filter, name: value })}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>

      {/* TOP 5 SLOWEST */}
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Top 5 Slowest Queues</Title>
            <ul>
              {slowest.map(({ info, attrs }) => (
                <li key={info.name}>
                  <b>{info.name}</b> — lag {attrs.QueueSize - attrs.InflightCount}, inflight {attrs.InflightCount}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </PageSection>

      {/* GRID PRINCIPALE */}
      <PageSection isFilled>
        <Grid hasGutter md={6} lg={4} xl={3}>
          {filtered.map(({ info, attrs }) => {
            const lag = attrs.QueueSize - attrs.InflightCount;
            const severity =
              attrs.MemoryPercentUsage > 80 || lag > 10000
                ? 'red'
                : attrs.MemoryPercentUsage > 60 || lag > 1000
                ? 'yellow'
                : 'green';

            const h = history[info.name] ?? { queueSize: [], inflight: [], lag: [] };

            return (
              <GridItem key={info.name}>
                <Card isFlat isCompact>
                  <CardBody>
                    <Title headingLevel="h4">{info.name}</Title>

                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Size</DescriptionListTerm>
                        <DescriptionListDescription>{attrs.QueueSize}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <Sparkline data={h.queueSize} color="#007bff" />

                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Inflight</DescriptionListTerm>
                        <DescriptionListDescription>{attrs.InflightCount}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <Sparkline data={h.inflight} color="#ff8800" />

                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Lag</DescriptionListTerm>
                        <DescriptionListDescription>{lag}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <Sparkline data={h.lag} color="#dc3545" />

                    <p><b>Consumers:</b> {attrs.ConsumerCount}</p>
                    <p><b>Memory:</b> {attrs.MemoryPercentUsage}%</p>

                  {severity === 'red' && (
                    <Label color="red" icon={<ExclamationCircleIcon />}>
                      Critical
                    </Label>
                  )}

                  {severity === 'yellow' && (
                    <Label color="orange" icon={<ExclamationTriangleIcon />}>
                      Warning
                    </Label>
                  )}

                  {severity === 'green' && (
                    <Label color="green" icon={<CheckCircleIcon />}>
                      Healthy
                    </Label>
                  )}
                  </CardBody>
                </Card>
              </GridItem>
            );
          })}
        </Grid>
      </PageSection>
    </>
  );
};
