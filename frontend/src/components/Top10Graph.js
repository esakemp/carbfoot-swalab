import React from 'react'
import Highcharts from 'highcharts'
import {
  HighchartsChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  ColumnSeries,
  Tooltip,
  Title
} from 'react-jsx-highcharts'

const Top10Graph = ({ series, year }) => {
  return (
    <HighchartsChart>
      <Chart marginBottom={100} zoomType="x" backgroundColor={null} />
      <Title>{`Top emissions ${year}`}</Title>
      <XAxis type="category" />
      <YAxis labels={{ align: 'left', x: 0, y: -5 }}>
        <ColumnSeries name="emissions" data={series} />
      </YAxis>
      <Tooltip />
    </HighchartsChart>
  )
}

export default withHighcharts(Top10Graph, Highcharts)
