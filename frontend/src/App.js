import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import CssBaseline from '@material-ui/core/CssBaseline'
import Search from './components/Search'
import Country from './components/Country'
import Top10 from './components/Top10'
import YearDropdown from './components/YearDropdown'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

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
  state = {
    countries: [],
    selectedYear: null,
    showCountries: false,
    perCapita: false
  }

  onSelectCountry = value => {
    this.setState({ countries: value, showCountries: true })
  }

  onSelectYear = value => {
    this.setState({ selectedYear: value, showCountries: false })
  }

  togglePerCapita = () => {
    this.setState({ perCapita: !this.state.perCapita })
  }

  render() {
    const { classes } = this.props
    const { countries, selectedYear, showCountries, perCapita } = this.state
    return (
      <div className={classes.main}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <img src={logo} alt="carbfoot" className={classes.logo} />
          <Search onSelectCountry={this.onSelectCountry} />
          <YearDropdown onSelectYear={this.onSelectYear} />
          <FormControlLabel
            control={
              <Checkbox
                checked={perCapita}
                onChange={this.togglePerCapita}
              />
            }
            label="Per Capita"
          />
          {
            showCountries
              ? (countries.length > 0) && <Country codes={countries} perCapita={perCapita} />
              : selectedYear && <Top10 year={selectedYear} perCapita={perCapita} />
          }
        </ApolloProvider>
      </div>
    )
  }
}

export default withStyles(styles)(App)
