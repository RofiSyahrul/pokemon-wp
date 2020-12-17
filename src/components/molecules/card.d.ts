import { BoxProps } from 'goods-core';

export interface CardProps extends BoxProps {
  loading?: boolean;
  image?: string;
  title?: string;
}

declare const Card: React.NamedExoticComponent<CardProps>;
export default Card;
