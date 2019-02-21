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
  return (
    <Query query={fetchCountryWithList}
      variables={{ codes }}
      notifyOnNetworkStatusChange>
      {({ loading, error, data, networkStatus }) => {
        if (networkStatus === 4) return 'refetching'
        if (loading) return null
        if (error) return `error! ${error.message}`
        const stats = getStatsFromData(data)
        console.log(data)
        return (
          <div>
            {data.country.name}
            <SingleCountryGraph
              stats={stats}
            />
          </div>
        )
      }}
    </Query>
  )
}

export default Country
