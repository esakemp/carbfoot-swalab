import React from 'react'
import { Query } from 'react-apollo'
import SingleCountryGraph from './SingleCountryGraph'
import fetchCountry from '../queries/fetchCountry'
import fetchCountryWithList from '../queries/fetchCountryWithList';

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

  console.log("country.js", codes)

  if (codes.length > 1) {
    return (
      <div>
        W.I.P.
      </div>
    )
  } else {
    return (
      <Query query={fetchCountryWithList}
        variables={{ codes }}
        notifyOnNetworkStatusChange>
        {({ loading, error, data, networkStatus }) => {
          if (networkStatus === 4) return 'refetching'
          if (loading) return null
          if (error) return `error! ${error.message}`
          const countries = data.countries.map(country => country)
          const stats = getStatsFromData(countries[0])
          console.log(countries[0])
          return (
            <div>
              {data.countries[0].name}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Country
