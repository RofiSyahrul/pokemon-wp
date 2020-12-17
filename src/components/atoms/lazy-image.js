import React, { memo, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Image } from 'goods-core';

const placeholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+B8AAqcB0ialKdoAAAAASUVORK5CYII=';

/** @param {React.SyntheticEvent<HTMLImageElement>} e */
function handleError(e) {
  e.currentTarget.src = require('src/img/pokeball.png');
}

/** @type {React.NamedExoticComponent<import('./lazy-image').LazyImageProps>} */
const LazyImage = memo(({ src, delay = 0, objectFit, radius, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const isLoading = imageSrc !== src;

  /** @type {React.MutableRefObject<HTMLImageElement>} */
  const imageRef = useRef(null);

  useEffect(() => {
    /** @type {IntersectionObserver} */
    let observer;
    let didCancel = false;
    const imageEl = imageRef.current;

    if (imageEl && isLoading) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setTimeout(() => {
                  setImageSrc(src);
                }, delay);
                observer.unobserve(imageEl);
              }
            });
          },
          {
            threshold: 0.65,
            rootMargin: '0%',
          }
        );
        observer.observe(imageEl);
      } else {
        // Old browsers fallback
        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      // on component cleanup, we remove the listner
      if (observer && observer.unobserve) {
        observer.unobserve(imageEl);
      }
    };
  }, [src, isLoading, imageRef]);

  return (
    <Image
      ref={imageRef}
      src={imageSrc}
      objectFit={isLoading ? 'cover' : objectFit}
      radius={isLoading ? 'full' : radius}
      onError={handleError}
      {...props}
    />
  );
}, isEqual);

export default LazyImage;
