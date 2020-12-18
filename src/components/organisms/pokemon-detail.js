import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Box, mergeClass, Spinner, Text } from 'goods-core';
import LazyImage from 'atoms/lazy-image';
import { capitalize, formatNumber } from 'src/utils/helpers';
import pokeBallImg from 'src/img/pokeball-sm.png';

/**
 * @typedef {Object} AttributeListProps
 * @property {string} title
 * @property {string[]} attributes
 * */

/** @type {React.NamedExoticComponent<AttributeListProps>} */
const AttributeList = memo(({ title, attributes }) => {
  return (
    <Box w>
      <Text as='h5' rule='body' weight='bold'>
        {title}
      </Text>
      <Box
        as='ul'
        listImage={`url(${pokeBallImg})`}
        listPosi='inside'
        w
        d='block'
      >
        {attributes.map(attribute => (
          <Box key={attribute} as='li' d='list-item'>
            <Text as='span' rule='body'>
              {attribute}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}, isEqual);

/**
 * @typedef {Partial<Pokemon> & {
 *  loading?: boolean, errorMessage?: string, compareMode?: boolean
 * }} PokemonDetailProps
 * */

/** @type {React.NamedExoticComponent<PokemonDetailProps>} */
const PokemonDetail = memo(
  ({
    name,
    image,
    height,
    weight,
    abilities = [],
    types = [],
    stats = [],
    totalScore,
    loading = false,
    errorMessage = '',
    compareMode = false,
  }) => {
    const basicAttributes = [
      `weight: ${formatNumber(weight)} hg`,
      `height: ${formatNumber(height)} dm`,
    ];
    const totalAbilities = abilities.length;
    const totalTypes = types.length;
    const statistics = (stats || []).map(
      stat => `${stat.name} (${stat.base_stat})`
    );
    return (
      <Box
        as='section'
        className='pokemon-detail-container'
        w
        radius='l'
        shadow='low'
        bg='white'
        p={{ xs: 'xxs', sm: 's' }}
        fAlign='center'
        posi='relative'
      >
        {loading ? (
          <Box posi='absolute' top='0px' left='0px'>
            <Spinner s='32px' />
          </Box>
        ) : errorMessage ? (
          <Text
            as='h2'
            rule='title'
            dRule='subtitle'
            textAlign='center'
            c='black40'
          >
            {errorMessage}
          </Text>
        ) : (
          <>
            <Text
              as='h2'
              rule='title'
              dRule='subtitle'
              textAlign='center'
              c='black40'
            >
              {capitalize(name)}
            </Text>
            <Box
              w
              mt='l'
              d='grid'
              gTempCol='repeat(auto-fit, 160px)'
              gap='16px'
              gAutoFlow='row'
              fJustify={{ xs: 'center', sm: 'flex-start' }}
              className={mergeClass(
                compareMode ? 'grid-compare-mode' : '',
                'grid-pokemon-detail'
              )}
            >
              <LazyImage
                src={image}
                alt={`Image of ${name}`}
                s='160px'
                objectFit='contain'
              />
              <AttributeList
                title='Basic attributes'
                attributes={basicAttributes}
              />
              <AttributeList
                title={`Type${totalTypes > 1 ? 's' : ''}`}
                attributes={types}
              />
              <AttributeList
                title={`Abilit${totalAbilities > 1 ? 'ies' : 'y'}`}
                attributes={abilities}
              />
              <AttributeList
                title={`Stats (score: ${formatNumber(totalScore)})`}
                attributes={statistics}
              />
            </Box>
          </>
        )}
      </Box>
    );
  },
  isEqual
);

export default PokemonDetail;
