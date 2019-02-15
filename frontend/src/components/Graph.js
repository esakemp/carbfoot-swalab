import React from 'react'
import Highcharts from 'highcharts'
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, LineSeries, Tooltip, Legend, Title
} from 'react-jsx-highcharts'

const Graph = ({ emissions, population, country, category }) => (
  <HighchartsChart >
    <Chart marginBottom={100} />
    <Title>{country}</Title>
    <Tooltip shared />
    <XAxis tickPixelInterval={10}>
      <XAxis.Title>Year</XAxis.Title>
    </XAxis>
    <YAxis>
      <YAxis.Title>{category}</YAxis.Title>
      <LineSeries name='Emissions' data={emissions} />
    </YAxis>
    <YAxis opposite>
      <LineSeries name='Population' data={population} />
    </YAxis>
    <Legend verticalAlign='bottom' />
  </HighchartsChart>
)

export default withHighcharts(Graph, Highcharts)
