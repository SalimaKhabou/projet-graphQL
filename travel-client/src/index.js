import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from './App';

// 🔗 Lien vers ton API GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// 🔐 Ajout automatique du token Keycloak
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('kc_token'); // ⚠️ important

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// ⚡ Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// 🚀 Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);