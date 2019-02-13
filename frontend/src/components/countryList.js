import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class countryList extends Component {
    renderCountries() {
        console.log(this.props)
        return this.props.data
            .countries.map(country => <li>{country.name}</li>)
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