import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';

const httpLink = new HttpLink({ uri: BASE_URL });
const cache = new InMemoryCache();
const client = new ApolloClient({ link: httpLink, cache });

/** @type {React.FC} */
const ApolloInit = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloInit;
