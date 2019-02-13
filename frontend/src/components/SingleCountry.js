import React, { Component } from 'react'
import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import fetchCountry from '../queries/fetchCountry';


class SingleCountry extends Component {

    renderEmissions() {
        return this.props.data.country.stats.map(stats => {
            return (
                <li>year {stats.year}: {stats.population}, {stats.emissions}</li>
            )
        })
    }

    render() {

        console.log("country data", this.props)
        
        if (this.props.data.loading) {
            return (
                <div>loading...</div>
            )
        }
        return this.props.data.country.stats.map(stats => {
            return (
                <li>{stats.year}, {stats.population}, {stats.emissions}</li>
            )
        })
    }
}

export default graphql(fetchCountry, {
    options: (props) => { return { variables: { code: "FIN" } } }
})(SingleCountry)