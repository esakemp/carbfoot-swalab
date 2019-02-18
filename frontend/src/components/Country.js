import React from 'react'
import { Query } from 'react-apollo'
import SingleCountryGraph from './SingleCountryGraph'
import fetchCountry from '../queries/fetchCountry'

const getStatsFromData = ({ country }) => ({
  country: country.name,
  population: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: stat.population
  })),
  emissions: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: stat.emissions
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
          <SingleCountryGraph
            stats={stats}
          />
        </div>
      )
    }}
  </Query>
)

export default Country
