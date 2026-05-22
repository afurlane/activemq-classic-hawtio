import React, { useCallback, useMemo } from 'react'
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

  const containerStyle = useMemo(() => ({ width: '100%', height }), [height])
  const chartPadding = useMemo(() => ({ top: 2, bottom: 2, left: 2, right: 2 }), [])
  const chartDomain = useMemo(() => ({ y: [yMin, yMax] as [number, number] }), [yMin, yMax])
  const chartAnimate = useMemo(() => ({ duration: 200, easing: 'cubicOut' as const }), [])
  const chartLabels = useCallback(({ datum }: { datum: { y: number } }) => `${datum.y}`, [])
  const tooltipFlyoutStyle = useMemo(
    () => ({
      fill: 'var(--pf-v5-global--palette--black-700)',
      stroke: 'none',
      padding: 2
    }),
    []
  )
  const tooltipStyle = useMemo(
    () => ({
      fill: 'white',
      fontSize: 7
    }),
    []
  )
  const lineStyle = useMemo(
    () => ({
      data: {
        stroke: color,
        strokeWidth: 1
      }
    }),
    [color]
  )

  return (
    <div style={containerStyle}>
      <Chart
        height={height}
        padding={chartPadding}
        domain={chartDomain}
        animate={chartAnimate}
        containerComponent={
          <ChartVoronoiContainer
            labels={chartLabels}
            labelComponent={
              <ChartTooltip
                flyoutStyle={tooltipFlyoutStyle}
                style={tooltipStyle}
              />
            }
          />
        }
      >
        <ChartLine
          data={safe}
          style={lineStyle}
        />
      </Chart>
    </div>
  )
}
