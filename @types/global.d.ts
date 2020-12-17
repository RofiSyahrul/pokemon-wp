export {};

declare global {
  declare const __DEV__: boolean;
  declare const BASE_URL: string;
  declare const BASE_IMAGE_URL: string;
  declare const PAGINATION_LIMIT: number;

  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BUILD_ENV: 'local' | 'prod';
      BASE_URL: string;
      BASE_IMAGE_URL: string;
      PAGINATION_LIMIT: string;
    }
  }

  type StorageKey =
    | 'all-pokemon-list'
    | 'filter-records'
    | 'match-predictions'
    | 'offset'
    | (string & {});

  interface Storage {
    getItem(key: StorageKey): string | null;
    removeItem(key: StorageKey): void;
    setItem(key: StorageKey, value: string): void;
  }

  type ObjectBase = { [x: string]: unknown };

  type FilterKey = 'ability' | 'type' | 'move';

  type HomePageQS = {
    filterBy: FilterKey[];
    ability: string;
    type: string;
    move: string;
  };

  type DetailsPageQS = {
    comparison: number;
  };

  type DetailsPageParam = {
    id: number;
  };

  type ResourceItem = {
    url: string;
    name: string;
  };

  type ResourceRes = {
    results: ResourceItem[];
  };

  type PokemonRes = {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
    moves: { move: { name: string } }[];
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
  };

  type Pokemon = {
    id: number;
    name: string;
    image: string;
    height: number;
    weight: number;
    abilities: string[];
    moves: string[];
    types: string[];
    stats: { base_stat: number; name: string }[];
  };

  type PokemonList = Pokemon[];

  type FilterResult = {
    name: string;
    pokemonList: PokemonList;
  };

  type FilterItem = {
    key: FilterKey;
    results: FilterResult[];
  };

  type MatchPrediction = {
    pokemonIds: [number, number];
    winner: number;
    winRate: number;
  };

  type FetchDataFn<TData = ObjectBase, TParams = ObjectBase> = (
    params?: TParams
  ) => Promise<TData | null>;

  type LazyFetchState = {
    loading: boolean;
    error: Error | null;
  };

  type LazyFetchReturn<TData = ObjectBase, TParams = ObjectBase> = [
    FetchDataFn<TData, TParams>,
    LazyFetchState
  ];

  type PaginationParams = {
    limit: number;
    offset: number;
  };
}
