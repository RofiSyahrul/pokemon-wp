import React from 'react';
import { GoodsProvider } from 'goods-core';
import ApolloInit from './apollo-init';

/** @type {React.FC} */
const App = () => {
  return (
    <ApolloInit>
      <GoodsProvider>
        <h1>Welcome to Pokemon Explorer</h1>
      </GoodsProvider>
    </ApolloInit>
  );
};

export default App;
