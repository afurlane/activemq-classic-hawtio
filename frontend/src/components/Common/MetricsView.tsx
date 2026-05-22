import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  Flex,
  FlexItem
} from '@patternfly/react-core'

import { Sparkline } from '../Common/Sparkline'

const flexColumnDirection = { default: 'column' } as const

interface MetricItem {
  label: string
  value: React.ReactNode
  trend?: React.ReactNode
  data?: number[]
  color?: string
}

interface Props {
  title: string
  items: MetricItem[]
}

export const MetricsView: React.FC<Props> = ({ title, items }) => {
  return (
    <Card isFlat className="pf-v5-u-mb-md">
      <CardHeader>
        <CardTitle className="pf-v5-u-font-size-md">{title}</CardTitle>
      </CardHeader>

      <CardBody>
        <Grid hasGutter>
          {items.map((m, i) => (
            <GridItem key={i} span={2}>
              <Card
                isCompact
                isFlat
                className="pf-v5-u-border-left pf-v5-u-border-color-200 pf-v5-u-p-sm"
              >
                <CardBody className="pf-v5-u-p-0">
                  <Flex direction={flexColumnDirection}>
                    
                    {/* Label + trend */}
                    <FlexItem>
                      <span className="pf-v5-u-font-size-xs pf-v5-u-color-200">
                        {m.label}
                      </span>{' '}
                      {m.trend}
                    </FlexItem>

                    {/* Value */}
                    <FlexItem className="pf-v5-u-font-size-lg pf-v5-u-font-weight-bold pf-v5-u-my-xs">
                      {m.value}
                    </FlexItem>

                    {/* Sparkline */}
                    {m.data && (
                      <FlexItem className="pf-v5-u-mt-xs">
                        <Sparkline data={m.data} color={m.color} height={28} />
                      </FlexItem>
                    )}
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </CardBody>
    </Card>
  )
}
