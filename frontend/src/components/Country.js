import React from 'react'
import { Query } from 'react-apollo'

import SingleCountryGraph from './SingleCountryGraph'
import MultiCountryGraph from './MultiCountryGraph'
import fetchCountryWithList from '../queries/fetchCountryWithList'

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

function Country({ codes }) {
  if (codes.length > 1) {
    return (
      <Query
        query={fetchCountryWithList}
        variables={{ codes }}
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, networkStatus }) => {
          if (networkStatus === 4) return 'refetching'
          if (loading) return null
          if (error) return `error! ${error.message}`

          const countries = data.countries.map(country => ({
            country: {
              name: country.name,
              code: country.code,
              stats: country.stats
            }
          }))
          const countryStats = countries.map(country =>
            getStatsFromData(country)
          )

          return (
            <div>
              <MultiCountryGraph statsArray={countryStats} />
            </div>
          )
        }}
      </Query>
    )
  } else if (codes.length === 1) {
    return (
      <Query
        query={fetchCountryWithList}
        variables={{ codes }}
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, networkStatus }) => {
          if (networkStatus === 4) return 'refetching'
          if (loading) return null
          if (error) return `error! ${error.message}`

          const countries = data.countries.map(country => ({
            country: {
              name: country.name,
              code: country.code,
              stats: country.stats
            }
          }))
          const stats = getStatsFromData(countries[0])

          return (
            <div>
              <SingleCountryGraph stats={stats} />
            </div>
          )
        }}
      </Query>
    )
  }
  return <div />
}

export default Country
