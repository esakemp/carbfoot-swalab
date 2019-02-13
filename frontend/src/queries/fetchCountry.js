import gql from 'graphql-tag'

export default gql`
query findCountry($code: String!){
    country(code:$code) {
      name
      code
      stats{
          year
          population
          emissions
      }
    }
  }

`