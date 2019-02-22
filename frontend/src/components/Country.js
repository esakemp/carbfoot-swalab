import React from 'react'
import { Query } from 'react-apollo'

import SingleCountryGraph from './SingleCountryGraph'
import MultiCountryGraph from './MultiCountryGraph'
import fetchCountryWithList from '../queries/fetchCountryWithList'

const getStatsFromData = ({ country }) => ({
  country: country.name,
  population: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: stat.population,
  })),
  emissions: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: stat.emissions,
  })),
})

function Country({ codes }) {
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
            stats: country.stats,
          },
        }))

        const countryStats = countries.map(country => getStatsFromData(country))

        if (countries.length > 1) {
          return (
            <div>
              <MultiCountryGraph statsArray={countryStats} />
            </div>
          )
        } else if (countries.length === 1) {
          return (
            <div>
              <SingleCountryGraph stats={countryStats[0]} />
            </div>
          )
        } else {
          return <div />
        }
      }}
    </Query>
  )
}

export default Country
