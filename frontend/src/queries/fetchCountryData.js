const getCountryData = `
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
export default getCountryData