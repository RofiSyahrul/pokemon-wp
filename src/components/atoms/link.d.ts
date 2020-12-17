import { BoxProps, TextCssProps } from 'goods-core';
import { GoToOptions } from 'src/hooks/parsed-location';

export interface LinkProps
  extends BoxProps,
    Pick<GoToOptions, 'method'>,
    Pick<
      TextCssProps,
      | 'rule'
      | 'dRule'
      | 'fontFam'
      | 'fSize'
      | 'weight'
      | 'lineHeight'
      | 'letterSpace'
      | 'textAlign'
    >,
    React.HTMLAttributes<HTMLAnchorElement> {
  to: string;
  /** @default "_self" */
  target?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const Link: React.NamedExoticComponent<LinkProps>;
export default Link;
