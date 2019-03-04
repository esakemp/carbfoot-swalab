import React from 'react'
import Highmaps from 'highcharts/highmaps'
import {
  withHighmaps,
  HighchartsMapChart,
  Chart,
  MapNavigation,
  Tooltip,
  Credits,
  MapSeries,
} from 'react-jsx-highmaps'
import map from '@highcharts/map-collection/custom/world.geo.json'

const EmissionsMap = ({ data }) => {
  return (
    <HighchartsMapChart
      map={map}
      colorAxis={{
        min: 0,
        minColor: '#EEEEFF',
        maxColor: '#4286f4',
      }}
    >
      <Chart backgroundColor={null} />
      <MapSeries
        data={data}
        name="Top emissions"
        allAreas={true}
        joinBy={['iso-a3', 'code']}
        dataLabels={{
          enabled: true,
          color: '#FFFFFF',
          format: '{point.name}',
        }}
      />
      <MapNavigation>
        <MapNavigation.ZoomIn />
        <MapNavigation.ZoomOut />
      </MapNavigation>
      <Tooltip />
      <Credits />
    </HighchartsMapChart>
  )
}

export default withHighmaps(EmissionsMap, Highmaps)
