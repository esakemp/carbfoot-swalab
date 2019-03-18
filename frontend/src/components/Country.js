import React from 'react'
import SingleCountryGraph from './SingleCountryGraph'
import MultiCountryGraph from './MultiCountryGraph'

const getStatsFromData = ({ country }, perCapita) => ({
  country: country.name,
  population: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: stat.population,
  })),
  emissions: country.stats.map(stat => ({
    x: parseInt(stat.year),
    y: perCapita ? stat.perCapita : stat.emissions,
  })),
})

const Country = ({ countries, perCapita }) => {
  const countryStats = countries.map(country => getStatsFromData(country, perCapita))

  countryStats.forEach(country => {
    country.emissions.sort((e1, e2) => e1.x - e2.x)
    country.population.sort((p1, p2) => p1.x - p2.x)
  })

  if (countries.length > 1) {
    return (
      <div>
        <MultiCountryGraph statsArray={countryStats} />
      </div>
    )
  } else {
    return (
      <div>
        <SingleCountryGraph stats={countryStats[0]} />
      </div>
    )
  }
}

export default Country
