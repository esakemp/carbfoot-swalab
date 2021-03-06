import gql from 'graphql-tag'

export default gql`
  query fetchTop10($year: String!) {
    top10(year: $year) {
      emissions {
        code
        name
        year
        population
        emissions
        perCapita
      }
      perCapita {
        code
        name
        year
        population
        emissions
        perCapita
      }
    }
  }
`
