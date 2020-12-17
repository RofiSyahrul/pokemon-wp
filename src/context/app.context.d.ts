export type State = {
  offset: number;
  allPokemonList: PokemonList;
  filterRecords: FilterItem[];
  matchPredictions: MatchPrediction[];
};

type ActionType = 'ADD_POKEMONS' | 'ADD_FILTER_RECORD' | 'ADD_MATCH_PREDICTION';

type ActionPayload = {
  pokemonList: PokemonList;
  filterRecord: { key: FilterKey; result: FilterResult };
  matchPrediction: MatchPrediction;
};

export type Action = {
  type: ActionType;
  payload: Partial<ActionPayload>;
};

export type Dispatch = {
  savePokemonList(pokemonList: PokemonList): void;
  saveFilterRecord(filterRecord: ActionPayload['filterRecord']): void;
  saveMatchPrediction(matchPrediction: MatchPrediction): void;
  getFilteredPokemons(key: FilterKey, name: string): PokemonList;
  getMatchPrediction(pokemonIds: [number, number]): MatchPrediction | null;
};

export function useAppState(): State;
export function useAppDispatch(): Dispatch;

export const AppProvider: React.FC;
