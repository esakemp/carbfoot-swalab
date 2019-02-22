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
    Title,
} from 'react-jsx-highcharts'

const SingleCountryGraph = ({ stats }) => (
    <HighchartsChart>
        <Chart marginBottom={100} zoomType="x" backgroundColor={null} />
        <Title>{stats.country}</Title>
        <Tooltip shared />
        <XAxis tickPixelInterval={10}>
            <XAxis.Title>Year</XAxis.Title>
        </XAxis>
        <YAxis labels={{ align: 'left', x: 0, y: -5 }}>
            <LineSeries
                marker={{ enabled: false }}
                name="Emissions"
                data={stats.emissions}
            />
        </YAxis>
        <YAxis opposite labels={{ align: 'right', x: 0, y: -5 }}>
            <LineSeries
                marker={{ enabled: false }}
                name="Population"
                data={stats.population}
            />
        </YAxis>
        <Legend verticalAlign="bottom" />
    </HighchartsChart>
)

export default withHighcharts(SingleCountryGraph, Highcharts)
