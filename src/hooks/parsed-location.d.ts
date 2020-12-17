import { useLocation } from 'react-router-dom';

export type GoToOptions = {
  state?: Record<string, unknown>;
  /** @default "push" */
  method?: 'replace' | 'push';
  /** @default true */
  keepState?: boolean;
};

export interface ParsedLocationReturn<
  QS extends Record<keyof QS, any> | Record<keyof QS, string> = Record<
    string,
    string | number | boolean
  >,
  Params extends { [K in keyof Params]?: string } = Record<string, string>
> extends ReturnType<typeof useLocation> {
  state: Partial<Record<string, unknown>>;
  params: Params;
  parsedQs: QS;
  goTo(to: string | QS, opts?: GoToOptions): void;
  getHref(to: string | QS): string | undefined;
}

export function useParsedLocation<
  QS extends Record<keyof QS, any> | Record<keyof QS, string> = Record<
    string,
    string | number | boolean
  >,
  Params extends { [K in keyof Params]?: string } = Record<string, string>
>(): ParsedLocationReturn<QS, Params>;
