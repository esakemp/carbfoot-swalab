import React from 'react'
import { Query } from 'react-apollo'
import top10 from '../queries/fetchTop10'
import Top10Graph from './Top10Graph'
import EmissionsMap from './EmissionsMap'

const formatEmissions = emissions => {
  return emissions.map(({ name, code, emissions: y }) => ({ name, code, y }))
}

const formatPerCapita = emissions => {
  return emissions.map(({ name, code, perCapita: y }) => ({ name, code, y }))
}

const formatDataToSeries = ({ top10 }, usePerCapita) => {
  const { emissions, perCapita } = top10
  const series = usePerCapita ? formatPerCapita(perCapita) : formatEmissions(emissions)
  return series.sort((e1, e2) => e1.y - e2.y)
}

function Top10({ year, perCapita }) {
  return (
    <Query query={top10} variables={{ year }} notifyOnNetworkStatusChange>
      {({ loading, error, data, networkStatus }) => {
        if (networkStatus === 4) return 'refetching'
        if (loading) return null
        if (error) return `error! ${error.message}`
        const series = formatDataToSeries(data, perCapita)
        const mapdata = series.map(({ code, y: value }) => ({ code, value }))
        return (
          <React.Fragment>
            <Top10Graph series={series} year={year} />
            <EmissionsMap data={mapdata} />
          </React.Fragment>
        )
      }}
    </Query>
  )
}
export default Top10
