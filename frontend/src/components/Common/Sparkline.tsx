import React, { useMemo } from 'react'
import {
  Chart,
  ChartLine,
  ChartAxis,
  ChartGroup
} from '@patternfly/react-charts'

interface Props {
  data: number[]
  color?: string
}

export const Sparkline: React.FC<Props> = ({ data, color = '#00bcd4' }) => {
  // Pre-elaborazione sicura
  const chartData = useMemo(
    () => data.map((v, i) => ({ x: i, y: v })),
    [data]
  )

  // Se non ci sono dati, linea piatta
  const safe = chartData.length > 0 ? chartData : [{ x: 0, y: 0 }]

  // Dominio Y dinamico
  let yMin = Math.min(...safe.map(p => p.y))
  let yMax = Math.max(...safe.map(p => p.y))

  // Evita dominio piatto
  if (yMin === yMax) {
    const pad = Math.max(1, Math.abs(yMin) * 0.1)
    yMin -= pad
    yMax += pad
  }

  return (
    <div style={{ width: '100%', height: 40 }}>
      <Chart
        height={40}
        padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
        domain={{ y: [yMin, yMax] }}
        animate={{ duration: 300, easing: 'cubicOut' as const }}
      >
        <ChartGroup>
          <ChartLine
            data={safe}
            style={{
              data: {
                stroke: color,
                strokeWidth: 1.5
              }
            }}
          />
        </ChartGroup>

        {/* Assi nascosti */}
        <ChartAxis
          style={{
            axis: { stroke: 'none' },
            ticks: { stroke: 'none' },
            tickLabels: { fill: 'none' }
          }}
        />
        <ChartAxis
          dependentAxis
          style={{
            axis: { stroke: 'none' },
            ticks: { stroke: 'none' },
            tickLabels: { fill: 'none' }
          }}
        />
      </Chart>
    </div>
  )
}
