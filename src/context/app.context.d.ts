export type State = {
  sidebarCollapsed: boolean;
  offset: number;
  allPokemonList: PokemonList;
  abilityOptions: OptionItem[];
  typeOptions: OptionItem[];
};

type ActionType = 'ADD_POKEMONS' | 'TOGGLE_SIDEBAR' | 'SET_FILTER_OPTIONS';

type ActionPayload = {
  pokemonList: PokemonList;
  abilityOptions: OptionItem[];
  typeOptions: OptionItem[];
};

export type Action = {
  type: ActionType;
  payload: Partial<ActionPayload>;
};

export interface Dispatch {
  savePokemonList(pokemonList: PokemonList): void;
  getPokemonDetail(id: number): Pokemon | null;
  toggleSidebar(): void;
}

export function useAppState(): State;
export function useAppDispatch(): Dispatch;

export const AppProvider: React.FC;
