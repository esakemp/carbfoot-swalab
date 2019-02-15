import React from 'react'
import { Query } from 'react-apollo'
import Graph from './Graph'
import fetchCountry from '../queries/fetchCountry'

const getStatsFromData = ({ country }) => ({
  name: country.name,
  population: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: parseInt(stat.population)
  })),
  emissions: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: parseInt(stat.emissions)
  }))
})

const Country = ({ code }) => (
  <Query query={fetchCountry}
    variables={{ code }}
    notifyOnNetworkStatusChange>
    {({ loading, error, data, networkStatus }) => {
      if (networkStatus === 4) return 'refetching'
      if (loading) return null
      if (error) return `error! ${error.message}`
      const stats = getStatsFromData(data)
      return (
        <div>
          {data.country.name}, {data.country.code}
          <Graph
            population={stats.population}
            emissions={stats.emissions}
            country={stats.name}
          />
        </div>
      )
    }}
  </Query>
)

export default Country
