export type State = {
  sidebarCollapsed: boolean;
  offset: number;
  allPokemonList: PokemonList;
  filterRecords: FilterItem[];
  matchPredictions: MatchPrediction[];
};

type ActionType =
  | 'ADD_POKEMONS'
  | 'ADD_FILTER_RECORD'
  | 'ADD_MATCH_PREDICTION'
  | 'TOGGLE_SIDEBAR';

type ActionPayload = {
  pokemonList: PokemonList;
  filterRecord: { key: FilterKey; result: FilterResult };
  matchPrediction: MatchPrediction;
};

export type Action = {
  type: ActionType;
  payload: Partial<ActionPayload>;
};

export interface Dispatch {
  savePokemonList(pokemonList: PokemonList): void;
  saveFilterRecord(filterRecord: ActionPayload['filterRecord']): void;
  saveMatchPrediction(matchPrediction: MatchPrediction): void;
  getFilteredPokemons(key: FilterKey, name: string): PokemonList;
  getMatchPrediction(pokemonIds: [number, number]): MatchPrediction | null;
  getPokemonDetail(id: number): Pokemon | null;
  toggleSidebar(): void;
}

export function useAppState(): State;
export function useAppDispatch(): Dispatch;

export const AppProvider: React.FC;
