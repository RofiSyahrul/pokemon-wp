import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Box, Skeleton, Text } from 'goods-core';
import LazyImage from 'atoms/lazy-image';

const LoadingPlaceholder = memo(() => {
  return (
    <>
      <Skeleton
        className='card-title'
        w='120px'
        maxW='100%'
        h='32px'
        transform='scale(1, 0.7)'
      />
      <Skeleton className='card-img' radius='full' s />
    </>
  );
});

/** @type {React.NamedExoticComponent<{title?: string, image?: string}>} */
const CardContent = memo(({ title, image }) => {
  return (
    <>
      <Box as='span' className='card-title' bg='blue60' p='xxs' w='fit-content'>
        <Text as='span' rule='body' weight='bold' textAlign='center' c='white'>
          {title}
        </Text>
      </Box>
      <LazyImage
        src={image}
        alt={`Image of ${title}`}
        className='card-img'
        s
        objectFit='contain'
        radius='full'
        shadow='high'
        bg='white'
      />
    </>
  );
});

/** @type {React.NamedExoticComponent<import('./card').CardProps>} */
const Card = memo(({ loading, image, title, children, ...props }) => {
  return (
    <Box
      title={loading ? 'Loading...' : title}
      as='span'
      w
      bg='white20'
      shadow='high'
      bTopLeftRad='l'
      bBotRightRad={{ xs: '48px', sm: '32px', lg: '36px', xl: '48px' }}
      fAlign='center'
      d='grid'
      gap='8px'
      gTempCol={{
        xs: '1fr 96px',
        sm: '1fr 64px',
        lg: '1fr 72px',
        xl: '1fr 96px',
      }}
      gTempRow={{
        xs: 'max-content 1fr 96px',
        sm: 'max-content 1fr 64px',
        lg: 'max-content 1fr 72px',
        xl: 'max-content 1fr 96px',
      }}
      {...props}
    >
      {loading ? (
        <LoadingPlaceholder />
      ) : (
        <CardContent title={title} image={image} />
      )}
      {children}
    </Box>
  );
}, isEqual);

export default Card;
