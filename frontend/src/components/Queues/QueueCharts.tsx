import React, { useMemo } from 'react';
import {
  Card,
  CardBody,
  Title,
  Grid,
  GridItem
} from '@patternfly/react-core';

import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartArea,
  ChartVoronoiContainer
} from '@patternfly/react-charts';

import { ActiveMQQueueAttributes } from '../../types/activemq';

interface Props {
  history: ActiveMQQueueAttributes[];
}

export const QueueCharts: React.FC<Props> = ({ history }) => {

  const data = useMemo(() => {
    return history.map(h => ({
      time: new Date().toLocaleTimeString(),
      queueSize: h.QueueSize,
      enqueueCount: h.EnqueueCount,
      dequeueCount: h.DequeueCount,
      memoryPercent: h.MemoryPercentUsage,
      inflight: h.InflightCount,
      cursorPercent: h.CursorPercentUsage,
      producers: h.ProducerCount,
      dispatch: h.DispatchCount,
    }));
  }, [history]);

  const chartProps = {
    height: 200,
    padding: { top: 20, bottom: 40, left: 50, right: 20 },
    animate: { duration: 500, easing: 'ease-out' },
    containerComponent: (
      <ChartVoronoiContainer
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
      />
    )
  };

  return (
    <Grid hasGutter>
      {/* Queue Size */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Queue Size</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartGroup>
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.queueSize }))}
                  style={{ data: { stroke: '#007bff', strokeWidth: 2 } }}
                />
              </ChartGroup>
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Enqueue / Dequeue */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Enqueue / Dequeue Count</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartGroup>
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.enqueueCount }))}
                  style={{ data: { stroke: '#28a745', strokeWidth: 2 } }}
                />
                <ChartLine
                  data={data.map(d => ({ x: d.time, y: d.dequeueCount }))}
                  style={{ data: { stroke: '#dc3545', strokeWidth: 2 } }}
                />
              </ChartGroup>
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Memory Usage */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Memory Usage (%)</Title>
            <Chart {...chartProps} domain={{ y: [0, 100] }}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartArea
                data={data.map(d => ({ x: d.time, y: d.memoryPercent }))}
                style={{
                  data: {
                    stroke: '#6f42c1',
                    fill: '#d8c8ff',
                    strokeWidth: 2
                  }
                }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Inflight */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Inflight Messages</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartLine
                data={data.map(d => ({ x: d.time, y: d.inflight }))}
                style={{ data: { stroke: '#ff8800', strokeWidth: 2 } }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Cursor Usage */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Cursor Usage (%)</Title>
            <Chart {...chartProps} domain={{ y: [0, 100] }}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartArea
                data={data.map(d => ({ x: d.time, y: d.cursorPercent }))}
                style={{
                  data: {
                    stroke: '#17a2b8',
                    fill: '#b8ecf2',
                    strokeWidth: 2
                  }
                }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Producer Count */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Producer Count</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartLine
                data={data.map(d => ({ x: d.time, y: d.producers }))}
                style={{ data: { stroke: '#6610f2', strokeWidth: 2 } }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>

      {/* Dispatch Count */}
      <GridItem span={12}>
        <Card isFlat isCompact>
          <CardBody>
            <Title headingLevel="h4">Dispatch Count</Title>
            <Chart {...chartProps}>
              <ChartAxis fixLabelOverlap />
              <ChartAxis dependentAxis />
              <ChartLine
                data={data.map(d => ({ x: d.time, y: d.dispatch }))}
                style={{ data: { stroke: '#20c997', strokeWidth: 2 } }}
              />
            </Chart>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
