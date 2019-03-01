import gql from 'graphql-tag'

export default gql`
  query countries($codes: [String!]) {
    countries(codes: $codes) {
      name
      code
      stats {
        year
        population
        emissions
        perCapita
      }
    }
  }
`
