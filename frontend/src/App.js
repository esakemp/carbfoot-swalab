import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import CssBaseline from '@material-ui/core/CssBaseline'
import Search from './components/Search'
import Country from './components/Country'
import Top10 from './components/Top10'
import YearDropdown from './components/YearDropdown'

import logo from './logo.png'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
})

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  logo: {
    width: 75,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})

class App extends Component {
  state = { selectedCountry: [], selectedYear: null }

  onSelectCountry = value => {
    this.setState({ selectedCountry: value })
    this.setState({ selectedYear: null })
  }
  onSelectYear = value => {
    this.setState({ selectedYear: value })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.main}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <img src={logo} alt="carbfoot" className={classes.logo} />
          <Search onSelectCountry={this.onSelectCountry} />
          {this.state.selectedCountry && (
            <Country codes={this.state.selectedCountry} />
          )}
          {this.state.selectedCountry.length < 1 && (
            <div>
              <YearDropdown onSelectYear={this.onSelectYear} />
              {this.state.selectedYear && (
                <Top10 year={this.state.selectedYear} />
              )}
            </div>
          )}
        </ApolloProvider>
      </div>
    )
  }
}

export default withStyles(styles)(App)
