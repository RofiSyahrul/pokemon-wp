import React from 'react';
import { GoodsProvider, overrideGoodsTheme } from 'goods-core';
import { AppProvider } from './context/app.context';
import Pages from './pages';

const customTheme = overrideGoodsTheme({
  breakpoints: { sm: '481px', md: '561px', xl: '1081px' },
});

/** @type {React.FC} */
const App = () => {
  return (
    <GoodsProvider theme={customTheme}>
      <AppProvider>
        <Pages />
      </AppProvider>
    </GoodsProvider>
  );
};

export default App;
