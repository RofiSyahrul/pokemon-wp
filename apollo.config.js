/** @type {import('apollo').ApolloConfig} */
const config = {
  client: {
    excludes: ['./node_modules/**'],
    includes: ['./src/graph-query/*.js', './src/graph-query/**/*.js'],
    tagName: 'gql',
    addTypename: false,
    service: {
      name: 'graphql-pokeapi',
      url: 'https://graphql-pokeapi.vercel.app/api/graphql',
      skipSSLValidation: true,
    },
  },
};

module.exports = config;
