import React, { useEffect, useState } from 'react'
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
  DescriptionListDescription,
  Label,
  Alert
} from '@patternfly/react-core'

import { activemq } from '../../services/activemq/ActiveMQClassicService'
import { Sparkline } from '../Common/Sparkline'
import { BrokerTrends } from './BrokerTrends'
import { useSelectedBrokerName } from '../../hooks/useSelectedBroker'

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons'
import { Queue } from 'src/types/domain'

export const BrokerOverview: React.FC = () => {
  const brokerName = useSelectedBrokerName()

  if (!brokerName) {
    return (
      <Card isFlat isCompact>
        <CardBody>
          <Alert
            variant="danger"
            title="No broker selected"
            isInline
          />
        </CardBody>
      </Card>
    )
  }

  const [queues, setQueues] = useState<Queue[]>([])
  const [history, setHistory] = useState<Record<
    string,
    { queueSize: number[]; inflight: number[]; lag: number[] }
  >>({})

  const [filter, setFilter] = useState({
    critical: false,
    backlog: false,
    name: '',
  })

  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!brokerName) return

    setLoading(true)
    const data = await activemq.listQueues(brokerName)

    const newHistory = { ...history }

    data.forEach(q => {
      const key = q.name
      const inflight = q.stats.inflight ?? 0
      const size = q.size ?? 0
      const lag = size - inflight

      if (!newHistory[key]) {
        newHistory[key] = { queueSize: [], inflight: [], lag: [] }
      }

      newHistory[key].queueSize = [...newHistory[key].queueSize, size].slice(-30)
      newHistory[key].inflight = [...newHistory[key].inflight, inflight].slice(-30)
      newHistory[key].lag = [...newHistory[key].lag, lag].slice(-30)
    })

    setHistory(newHistory)
    setQueues(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [brokerName])

  if (!brokerName) return <p>No broker selected</p>
  if (loading) return <p>Loading broker overview…</p>

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
                  id="broker-filter"
                  aria-label = "Filter by name"
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
              {slowest.map(({ q }) => {
                const inflight = q.stats.inflight ?? 0
                const size = q.size ?? 0
                const lag = size - inflight

                return (
                  <li key={q.name}>
                    <b>{q.name}</b> — lag {lag}, inflight {inflight}
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      </PageSection>

      {/* GRID PRINCIPALE */}
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
                ? 'yellow'
                : 'green'

            const h = history[q.name] ?? { queueSize: [], inflight: [], lag: [] }

            return (
              <GridItem key={q.name}>
                <Card isFlat isCompact>
                  <CardBody>
                    <Title headingLevel="h4">{q.name}</Title>

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

                    <p><b>Consumers:</b> {q.consumers}</p>
                    <p><b>Memory:</b> {mem}%</p>

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
            )
          })}
        </Grid>
      </PageSection>
    </>
  )
}
