import { ImageProps } from 'goods-core';

export interface LazyImageProps extends ImageProps {
  delay?: number;
}

const LazyImage: React.NamedExoticComponent<LazyImageProps>;
export default LazyImage;
