import { Chart, ChartAxis, ChartGroup, ChartLine, ChartVoronoiContainer } from "@patternfly/react-charts/victory"
import { TopicMetricsHistory } from "src/hooks/useTopicMetrics"

const noDataTextStyle = { opacity: 0.6 }
const chartContainerStyle = { width: 500, height: 200 }
const chartPadding = { top: 20, bottom: 40, left: 50, right: 20 }
const chartAnimate = { duration: 500, easing: 'cubicOut' as const }
const voronoiLabels = ({ datum }: { datum: { y: number } }) => `${datum.y}`

export const TopicTrends: React.FC<{ history: TopicMetricsHistory }> = ({ history }) => {
  if (history.size.length === 0) {
    return (
      <div className="broker-panel">
        <h4>Charts</h4>
        <p style={noDataTextStyle}>No data available</p>
      </div>
    )
  }

  const metrics = [
    {
      key: 'enqueueRate',
      label: 'Enqueue',
      style: { data: { stroke: 'var(--pf-global--primary-color--100)', strokeWidth: 2 } }
    },
    {
      key: 'dequeueRate',
      label: 'Dequeue',
      style: { data: { stroke: 'var(--pf-global--success-color--100)', strokeWidth: 2 } }
    },
    {
      key: 'dispatchRate',
      label: 'Dispatch',
      style: { data: { stroke: 'var(--pf-global--warning-color--100)', strokeWidth: 2 } }
    }
  ] as const

  return (
    <div className="broker-panel">
      <h4>Charts</h4>

      <div style={chartContainerStyle}>
        <Chart
          height={200}
          width={500}
          padding={chartPadding}
          animate={chartAnimate}
          containerComponent={<ChartVoronoiContainer labels={voronoiLabels} />}
        >
          <ChartAxis fixLabelOverlap />
          <ChartAxis dependentAxis />

          <ChartGroup>
            {metrics.map(m => (
              <ChartLine
                key={m.key}
                data={history[m.key].map((y, x) => ({ x, y }))}
                style={m.style}
              />
            ))}
          </ChartGroup>
        </Chart>
      </div>
    </div>
  )
}
