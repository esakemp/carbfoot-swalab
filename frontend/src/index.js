import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router'
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import countryList from './components/countryList'

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql'
})

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Route path="/" component={App}>
                <IndexRoute component={countryList} />
            </Route>
        </ApolloProvider>
    )

}

ReactDOM.render(<Root />, document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
