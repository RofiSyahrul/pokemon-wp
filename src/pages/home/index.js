import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Box, Skeleton, Text } from 'goods-core';
import Link from 'atoms/link';
import Card from 'molecules/card';
import Header from 'organisms/header';
import Sidebar from 'organisms/sidebar';
import { capitalize, formatNumber } from 'src/utils/helpers';
import { useHome } from './home.hook';

const placeholder = {
  pokemons: Array.from({ length: 6 }, (_, i) => i),
  attributes: Array.from(
    { length: Math.floor(1 + Math.random() * 2) },
    (_, i) => `${i % 2 ? '56px' : '48px'}`
  ),
  weightAndHeights: ['80px', '78px'],
};

const AttributesPlaceholder = memo(() => {
  return (
    <>
      <Box as='span' className='top-attribute'>
        {placeholder.attributes.map((w, i) => (
          <Skeleton
            key={`attribute-${i}`}
            w={w}
            h='20px'
            bTopRightRad='l'
            bBotLeftRad='l'
            mt='xxxs'
            mr='xxxs'
          />
        ))}
      </Box>
      <Box as='span' className='bottom-attribute'>
        {placeholder.weightAndHeights.map((w, i) => (
          <Skeleton key={`weight-or-height-${i}`} w={w} h='20px' />
        ))}
      </Box>
    </>
  );
});

const LoadingPlaceholder = memo(() => {
  return (
    <>
      {placeholder.pokemons.map(i => (
        <Card key={`placeholder-${i}`} loading>
          <AttributesPlaceholder />
        </Card>
      ))}
    </>
  );
});

/** @type {React.NamedExoticComponent<Pokemon>} */
const PokemonAttributes = memo(({ weight, height, types }) => {
  return (
    <>
      <Box as='span' className='top-attribute'>
        {types.map(type => (
          <Box
            as='span'
            key={type}
            s='fit-content'
            p='xxs'
            bg='black30'
            bTopRightRad='l'
            bBotLeftRad='l'
            mr='xxxs'
          >
            <Text as='span' fSize='x-small' c='white20'>
              {type}
            </Text>
          </Box>
        ))}
      </Box>
      <Box as='span' className='bottom-attribute'>
        <Text as='span' rule='caption' weight='bold' textAlign='right'>
          {`Weight: ${formatNumber(weight)} hg`}
        </Text>
        <Text as='span' rule='caption' weight='bold' textAlign='right'>
          {`Height: ${formatNumber(height)} dm`}
        </Text>
      </Box>
    </>
  );
}, isEqual);

const Home = memo(() => {
  const { pokemons, loading, isFilter, sidebarCollapsed } = useHome();
  return (
    <>
      <Header home />
      <Sidebar />
      <Box
        as='main'
        f={1}
        w
        p={{ xs: 's', lg: 'l' }}
        pt='96px !important'
        d='grid'
        gAutoFlow='row'
        fJustify='center'
        gap={{ xs: '16px', sm: '24px' }}
        gTempCol={{
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        {...(!sidebarCollapsed && {
          pl: '292px !important',
          d: { xs: 'none', lg: 'grid' },
        })}
      >
        {isFilter && !loading && pokemons.length === 0 && (
          <Box gCol='1 / span 3' w fAlign='center'>
            <Text as='h2' rule='title' dRule='subtitle' textAlign='center'>
              No pokemon found
            </Text>
          </Box>
        )}
        {pokemons.map(({ id, name, image, types, weight, height }, i) => (
          <Link key={`${id}-${name}-${i}`} to={`${id}`} w>
            <Card title={capitalize(name)} image={image}>
              <PokemonAttributes
                types={types}
                weight={weight}
                height={height}
              />
            </Card>
          </Link>
        ))}
        {loading && <LoadingPlaceholder />}
      </Box>
    </>
  );
});

export default Home;
