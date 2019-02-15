import React from 'react'
import { Query } from 'react-apollo'
import fetchCountry from '../queries/fetchCountry'

const Country = ({ code }) => (
  <Query query={fetchCountry}
    variables={{ code }}
    notifyOnNetworkStatusChange>
    {({ loading, error, data, networkStatus }) => {
      if (networkStatus === 4) return 'refetching'
      if (loading) return null
      if (error) return `error! ${error.message}`

      return (
        <div>
          {data.country.name}, {data.country.code}
          <div>
              population was {data.country.stats[0].population} in year {data.country.stats[0].year}
          </div>
        </div>
      )
    }}
  </Query>
)

export default Country
