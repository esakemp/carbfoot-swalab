import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import Search from './components/Search'
import Country from './components/Country'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql'
})

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
})


class App extends Component {

  state = { selectedCountry: null }

  onSelectCountry = (value) => {
    this.setState({ selectedCountry: value })
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.main}>

        <ApolloProvider client={client}>
          <div>
            <h2>Country data</h2>
            <Search onSelectCountry={this.onSelectCountry} />          
            {this.state.selectedCountry && (
              <Country code={this.state.selectedCountry} />
            )}
          </div>
        </ApolloProvider>
      </div>
    )
  }
}

export default withStyles(styles)(App)
