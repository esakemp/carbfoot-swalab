import gql from "graphql-tag";

export default gql`
  query findCountries($codes: [String!]) {
    countries(codes: $codes) {
      name
      code
      stats {
        year
        population
        emissions
      }
    }
  }
`;
