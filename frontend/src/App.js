import React, { Component, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { ping } from './service'
import { render } from 'react-dom'

import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Search from './Search'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql'
})

const GET_COUNTRIES = gql`
{
  allCountries {
      name
      code
  }
}
`

//graphql stuff
const Countries = ({ onCountrySelect }) => (

  <Query query={GET_COUNTRIES}>
    {({ loading, error, data }) => {
      if (loading) return null
      if (error) return `error! ${error.message}`

      console.log(data.allCountries)

      return (
        <select name='country' onChange={onCountrySelect}>
          {data.allCountries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      )
    }}
  </Query>
)

const GET_COUNTRY = gql`
query findCountry($code: String!){
  country(code:$code) {
    name
    code
    stats{
        year
        population
        emissions
    }
  }
}
`

const Country = ({ code }) => (
  <Query query={GET_COUNTRY}
    variables={{ code }}
    notifyOnNetworkStatusChange>
    {({ loading, error, data, networkStatus }) => {

      if (networkStatus === 4) return "refetching"
      if (loading) return null
      if (error) return `error! ${error.message}`

      return (
        <div>
          {data.country.name}, {data.country.code}
          <div>
            population was {data.country.stats[0].population} in year {data.country.stats[0].year}
          </div>
        </div>
      )
    }}
  </Query>
)

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  }
});


class App extends Component {


  state = { selectedCountry: null }

  onCountrySelect = ({ target }) => {
    this.setState(() => ({ selectedCountry: target.value }))
  }

  // state = {
  //   result: `Click the button to test the connection to the gateway.`
  // }
  // handleClick = async () => {
  //   const result = await ping()
  //   this.setState({ result })
  // }


  render() {
    const { classes } = this.props
    return (
      <div className={classes.main}>

        {/* ping */}

        {/* <CssBaseline />
        <Paper className={classes.paper}>
          <Typography variant="body1" paragraph>
            {this.state.result}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleClick}
            fullWidth
          >
            Ping
          </Button>
       </Paper> */}


        <ApolloProvider client={client}>
          <div>
            <h2>Country data</h2>

            {/* dropdown select */}

            {/*{this.state.selectedCountry && (
              <Country code={this.state.selectedCountry} />
            )}
            <Countries onCountrySelect={this.onCountrySelect} />*/}

            <Search/>
          </div>
        </ApolloProvider>

      </div>

    );
  }
}

export default withStyles(styles)(App);
