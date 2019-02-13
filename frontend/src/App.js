import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { ping } from './service'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import CountryList from './components/CountryList'
import SingleCountry from './components/SingleCountry'

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
});


class App extends Component {
  state = {
    result: `Click the button to test the connection to the gateway.`
  }
  handleClick = async () => {
    const result = await ping()
    this.setState({ result })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.main}>
        <CssBaseline />
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
        </Paper>
        <ApolloProvider client={client}>
          <SingleCountry code="ABW" />
          <CountryList />
        </ApolloProvider>

      </div>

    );
  }
}

export default withStyles(styles)(App);
