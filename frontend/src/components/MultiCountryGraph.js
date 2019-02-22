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
      <Chart marginBottom={100} zoomType="x" backgroundColor={null} />
      <Title>Emissions</Title>
      <Tooltip shared />
      <XAxis tickPixelInterval={10}>
        <XAxis.Title>Year</XAxis.Title>
      </XAxis>
      <YAxis labels={{ align: 'left', x: 0 }}>
        {statsArray.map(({ country, emissions }) => (
          <LineSeries key={country} name={country} data={emissions} marker={{ enabled: false }} />
        ))}
      </YAxis>
      <Legend verticalAlign="bottom" />
    </HighchartsChart>
    <HighchartsChart>
      <Chart marginBottom={100} zoomType="x" backgroundColor={null} />
      <Title>Population</Title>
      <Tooltip shared />
      <XAxis tickPixelInterval={10}>
        <XAxis.Title>Year</XAxis.Title>
      </XAxis>
      <YAxis labels={{ align: 'left', x: 0 }}>
        {statsArray.map(({ country, population }) => (
          <LineSeries marker={{ enabled: false }} key={country} name={country} data={population} />
        ))}
      </YAxis>
      <Legend verticalAlign="bottom" />
    </HighchartsChart>
  </div>
)

export default withHighcharts(MultiCountryGraph, Highcharts)
