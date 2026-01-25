import React, { useState } from 'react'
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
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Alert,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import { Sparkline } from '../Common/Sparkline'
import { BrokerTrends } from './BrokerTrends'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'
import { useQueues } from '../../hooks/useQueues'
import { useQueueHistoryAccumulated } from '../../hooks/useQueueHistory'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'

export const BrokerOverview: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <PageSection>
        <Card isFlat isCompact>
          <CardBody>
            <Alert variant="danger" title="No broker selected" isInline />
          </CardBody>
        </Card>
      </PageSection>
    )
  }

  // SWR: queues
  const { data: queues = [], isLoading, error } = useQueues(brokerName)

  // SWR: history accumulata
  const history = useQueueHistoryAccumulated(brokerName)

  const [filter, setFilter] = useState({
    critical: false,
    backlog: false,
    name: '',
  })

  if (isLoading) {
    return (
      <PageSection>
        <Title headingLevel="h3">Loading broker overview…</Title>
      </PageSection>
    )
  }

  if (error) {
    return (
      <PageSection>
        <Alert variant="danger" title="Failed to load broker data" isInline />
      </PageSection>
    )
  }

  // FILTRI
  const filtered = queues.filter(q => {
    const inflight = q.stats.inflight ?? 0
    const size = q.size ?? 0
    const lag = size - inflight
    const mem = q.memory.percent ?? 0

    if (filter.critical && mem < 80 && size < 10000) return false
    if (filter.backlog && size < 1000) return false
    if (filter.name && !q.name.toLowerCase().includes(filter.name.toLowerCase())) return false

    return true
  })

  // TOP 5 SLOWEST
  const slowest = [...queues]
    .map(q => {
      const inflight = q.stats.inflight ?? 0
      const size = q.size ?? 0
      const lag = size - inflight
      const score = lag + inflight * 2 - q.stats.dequeue
      return { q, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <>
      {/* HEADER PF5 */}
      <PageSection variant={PageSectionVariants.light}>
        <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h2">Broker Overview</Title>
            <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>
              Operational metrics and health indicators for <strong>{brokerName}</strong>
            </div>
          </FlexItem>

          <FlexItem>
            <Label color="green" icon={<CheckCircleIcon />}>
              Connected
            </Label>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* TRENDS */}
      <PageSection>
        <Card isFlat>
          <CardHeader>
            <CardTitle>Broker Trends</CardTitle>
          </CardHeader>
          <CardBody>
            <BrokerTrends />
          </CardBody>
        </Card>
      </PageSection>

      {/* FILTRI PF5 */}
      <PageSection>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>

              <ToolbarItem>
                <Checkbox
                  id="filter-critical"
                  label="Critical only"
                  isChecked={filter.critical}
                  onChange={(_, checked) => setFilter({ ...filter, critical: checked })}
                />
              </ToolbarItem>

              <ToolbarItem>
                <Checkbox
                  id="filter-backlog"
                  label="Backlog > 1000"
                  isChecked={filter.backlog}
                  onChange={(_, checked) => setFilter({ ...filter, backlog: checked })}
                />
              </ToolbarItem>

              <ToolbarItem>
                <TextInput
                  id="broker-filter"
                  aria-label="Filter by name"
                  value={filter.name}
                  type="text"
                  placeholder="Filter by name..."
                  onChange={(_, value) => setFilter({ ...filter, name: value })}
                />
              </ToolbarItem>

            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </PageSection>

      {/* TOP 5 SLOWEST */}
      <PageSection>
        <Card isFlat>
          <CardHeader>
            <CardTitle>Top 5 Slowest Queues</CardTitle>
          </CardHeader>
          <CardBody>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {slowest.map(({ q }) => {
                const inflight = q.stats.inflight ?? 0
                const size = q.size ?? 0
                const lag = size - inflight

                return (
                  <li key={q.name}>
                    <strong>{q.name}</strong> — lag {lag}, inflight {inflight}
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      </PageSection>

      {/* GRID PRINCIPALE PF5 */}
      <PageSection isFilled>
        <Grid hasGutter md={6} lg={4} xl={3}>
          {filtered.map(q => {
            const inflight = q.stats.inflight ?? 0
            const size = q.size ?? 0
            const lag = size - inflight
            const mem = q.memory.percent ?? 0

            const severity =
              mem > 80 || lag > 10000
                ? 'red'
                : mem > 60 || lag > 1000
                ? 'orange'
                : 'green'

            const h = history[q.name] ?? { queueSize: [], inflight: [], lag: [] }

            return (
              <GridItem key={q.name}>
                <Card isFlat isCompact>
                  <CardHeader>
                    <CardTitle>{q.name}</CardTitle>
                  </CardHeader>

                  <CardBody>
                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Size</DescriptionListTerm>
                        <DescriptionListDescription>{size}</DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                    <Sparkline data={h.queueSize} color="#007bff" />

                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Inflight</DescriptionListTerm>
                        <DescriptionListDescription>{inflight}</DescriptionListDescription>
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

                    <p><strong>Consumers:</strong> {q.consumers}</p>
                    <p><strong>Memory:</strong> {mem}%</p>

                    <Label color={severity} icon={
                      severity === 'red'
                        ? <ExclamationCircleIcon />
                        : severity === 'orange'
                        ? <ExclamationTriangleIcon />
                        : <CheckCircleIcon />
                    }>
                      {severity === 'red'
                        ? 'Critical'
                        : severity === 'orange'
                        ? 'Warning'
                        : 'Healthy'}
                    </Label>
                  </CardBody>
                </Card>
              </GridItem>
            )
          })}
        </Grid>
      </PageSection>
    </>
  )
}
