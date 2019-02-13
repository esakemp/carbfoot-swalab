import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import query from '../queries/fetchAll'

class CountryList extends Component {
    
    renderCountries() {
        
        return this.props.data.allCountries.map(country => {
            return(<li key = {country.code}>{country.name}, {country.code}</li>)
        })
    }
    
    render() {
        if(this.props.data.loading) {
            return <div>Loading...</div>
        }
        return (
            <div>
                {this.renderCountries()}
            </div>
        )
    }
}

export default graphql(query)(CountryList)