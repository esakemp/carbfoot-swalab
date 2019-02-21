import React from 'react'
import Highcharts from 'highcharts'
import {
  HighchartsChart,
  Chart,
  withHighcharts,
  XAxis,
  YAxis,
  LineSeries,
  Tooltip,
  Legend,
  Title
} from 'react-jsx-highcharts'

const MultiCountryGraph = ({ statsArray }) => (
  <div>
    <HighchartsChart>
      <Chart marginBottom={100} />
      <Title>Emissions</Title>
      <Tooltip shared />
      <XAxis tickPixelInterval={10}>
        <XAxis.Title>Year</XAxis.Title>
      </XAxis>
      <YAxis>
        <YAxis.Title>Emissions</YAxis.Title>
        {statsArray.map(({ country, emissions }) => (
          <LineSeries key={country} name={country} data={emissions} />
        ))}
      </YAxis>
      <Legend verticalAlign="bottom" />
    </HighchartsChart>
    <HighchartsChart>
      <Chart marginBottom={100} />
      <Title>Population</Title>
      <Tooltip shared />
      <XAxis tickPixelInterval={10}>
        <XAxis.Title>Year</XAxis.Title>
      </XAxis>
      <YAxis>
        <YAxis.Title>Population</YAxis.Title>
        {statsArray.map(({ country, population }) => (
          <LineSeries key={country} name={country} data={population} />
        ))}
      </YAxis>
      <Legend verticalAlign="bottom" />
    </HighchartsChart>
  </div>
)

export default withHighcharts(MultiCountryGraph, Highcharts)
