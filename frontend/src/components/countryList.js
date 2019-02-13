import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class countryList extends Component {
    renderCountries() {
        return this.props.data.country
            .map(country => <li>{country.name}</li>

            )
    }
}

const query = gql`
{
    allCountries {
        name
        code
    }
}`

export default graphql(query)(countryList)