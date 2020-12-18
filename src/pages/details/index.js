import React, { memo } from 'react';
import { Box } from 'goods-core';
import SelectPokemon from 'molecules/select-pokemon';
import PokemonDetail from 'organisms/pokemon-detail';
import Header from 'organisms/header';
import { useDetails } from './details.hook';

const Details = memo(() => {
  const { firstPokemon, secondPokemon, isComparing } = useDetails();

  return (
    <>
      <Header>
        <SelectPokemon />
      </Header>
      <Box
        as='main'
        w
        p='m'
        pt='88px'
        d='grid'
        gTempCol={isComparing ? '1fr 1fr' : '100%'}
        gap='16px'
      >
        <PokemonDetail {...firstPokemon} compareMode={isComparing} />
        {isComparing && <PokemonDetail {...secondPokemon} compareMode />}
      </Box>
    </>
  );
});

export default Details;
