import React, { useMemo } from 'react'
import {
  Chart,
  ChartLine,
  ChartVoronoiContainer,
  ChartTooltip
} from '@patternfly/react-charts'

interface Props {
  data: number[]
  color?: string
  height?: number
}

export const Sparkline: React.FC<Props> = ({
  data,
  color = 'var(--pf-v5-global--primary-color--100)',
  height = 28
}) => {

  const safe = useMemo(() => {
    const mapped = data.map((v, i) => ({ x: i, y: v }))
    return mapped.length > 0 ? mapped : [{ x: 0, y: 0 }]
  }, [data])

  let yMin = Math.min(...safe.map(p => p.y))
  let yMax = Math.max(...safe.map(p => p.y))

  if (yMin === yMax) {
    const pad = Math.max(1, Math.abs(yMin) * 0.1)
    yMin -= pad
    yMax += pad
  }

  return (
    <div style={{ width: '100%', height }}>
      <Chart
        height={height}
        padding={{ top: 2, bottom: 2, left: 2, right: 2 }}
        domain={{ y: [yMin, yMax] }}
        animate={{ duration: 200, easing: 'cubicOut' as const }}
        containerComponent={
          <ChartVoronoiContainer
            labels={({ datum }) => `${datum.y}`}
            labelComponent={
              <ChartTooltip
                flyoutStyle={{
                  fill: 'var(--pf-v5-global--palette--black-700)',
                  stroke: 'none',
                  padding: 2
                }}
                style={{
                  fill: 'white',
                  fontSize: 7
                }}
              />
            }
          />
        }
      >
        <ChartLine
          data={safe}
          style={{
            data: {
              stroke: color,
              strokeWidth: 1
            }
          }}
        />
      </Chart>
    </div>
  )
}
