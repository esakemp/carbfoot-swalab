import React from 'react'
import Highcharts from 'highcharts'
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, LineSeries, Tooltip, Legend, Title
} from 'react-jsx-highcharts'

const SingleCountryGraph = ({ stats }) => (
  <HighchartsChart >
    <Chart marginBottom={100} />
    <Title>{stats.country}</Title>
    <Tooltip shared />
    <XAxis tickPixelInterval={10}>
      <XAxis.Title>Year</XAxis.Title>
    </XAxis>
    <YAxis>
      <YAxis.Title>Emissions</YAxis.Title>
      <LineSeries name='Emissions' data={stats.emissions} />
    </YAxis>
    <YAxis opposite>
      <LineSeries name='Population' data={stats.population} />
    </YAxis>
    <Legend verticalAlign='bottom' />
  </HighchartsChart>
)

export default withHighcharts(SingleCountryGraph, Highcharts)
