import gql from 'graphql-tag'

export default gql`
  query top10($year: String!) {
    top10(year: $year) {
      name
      year
      population
      emissions
      normalized
    }
  }
`
