import React from 'react'
import { Query } from 'react-apollo'
import top10 from '../queries/fetchTop10'
import Top10Graph from './Top10Graph'

const formatDataToSeries = emissions => {
  return emissions.map(({ name, emissions: y }) => ({ name, y }))
}

function Top10({ year }) {
  return (
    <Query query={top10} variables={{ year }} notifyOnNetworkStatusChange>
      {({ loading, error, data, networkStatus }) => {
        if (networkStatus === 4) return 'refetching'
        if (loading) return null
        if (error) return `error! ${error.message}`
        const { emissions } = data.top10
        const series = formatDataToSeries(emissions)
        console.log(data)
        return (
          <React.Fragment>
            <Top10Graph series={series} year={year} />
          </React.Fragment>
        )
      }}
    </Query>
  )
}
export default Top10
