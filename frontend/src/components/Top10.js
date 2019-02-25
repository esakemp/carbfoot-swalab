import React from 'react'
import { Query } from 'react-apollo'
import top10 from '../queries/fetchTop10'

function Top10({ year }) {
  return (
    <Query
      query={top10}
      variables={{ year: '2014' }}
      notifyOnNetworkStatusChange
    >
      {({ loading, error, data, networkStatus }) => {
        if (networkStatus === 4) return 'refetching'
        if (loading) return null
        if (error) return `error! ${error.message}`

        return <div></div>
      }}
    </Query>
  )
}
export default Top10
