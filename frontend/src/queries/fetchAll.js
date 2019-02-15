import gql from 'graphql-tag'

export default gql`
{
    allCountries {
        name
        code
    }
}`
