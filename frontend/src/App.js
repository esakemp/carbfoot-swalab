import React, { Component } from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import CssBaseline from '@material-ui/core/CssBaseline'
import Main from './components/Main'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
})

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
          <CssBaseline />
          <Main />
        </ApolloProvider>
    )
  }
}

export default App
