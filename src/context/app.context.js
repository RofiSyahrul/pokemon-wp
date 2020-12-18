import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import produce from 'immer';
import storage from 'src/utils/storage';
import { getId } from 'src/utils/helpers';

/**
 * @typedef {import('./app.context').State} State
 * @typedef {import('./app.context').Action} Action
 * @typedef {import('./app.context').Dispatch} Dispatch
 */

/** @type {State} */
const initialState = {
  offset: storage.offset,
  allPokemonList: storage.allPokemonList,
  abilityOptions: storage.abilityOptions,
  typeOptions: storage.typeOptions,
  sidebarCollapsed: window.innerWidth <= 1080,
};

/**
 *
 * @param {State} draft
 * @param {Action} action
 */
function recipe(draft, action) {
  const { type, payload = {} } = action;
  const { pokemonList, abilityOptions, typeOptions } = payload;
  switch (type) {
    case 'ADD_POKEMONS':
      if (Array.isArray(pokemonList)) {
        draft.allPokemonList = [...draft.allPokemonList, ...pokemonList];
        storage.allPokemonList = draft.allPokemonList;
        draft.offset += PAGINATION_LIMIT;
        storage.offset = draft.offset;
      }
      return;
    case 'TOGGLE_SIDEBAR':
      draft.sidebarCollapsed = !draft.sidebarCollapsed;
      return;
    case 'SET_FILTER_OPTIONS':
      if (Array.isArray(abilityOptions) && Array.isArray(typeOptions)) {
        storage.abilityOptions = abilityOptions;
        storage.typeOptions = typeOptions;
        draft.abilityOptions = abilityOptions;
        draft.typeOptions = typeOptions;
      }
      return;
    default:
      throw new Error('Unknown action type');
  }
}

const reducer = produce(recipe);

/** @typedef {{ state: State, dispatch: Dispatch }} ContextValue */

/** @returns {ContextValue} */
function useApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { typeOptions, abilityOptions, allPokemonList } = state;
  const isAnyFilterOptions =
    typeOptions.length > 0 && abilityOptions.length > 0;

  /** @type {Dispatch['savePokemonList']} */
  const savePokemonList = useCallback(pokemonList => {
    dispatch({ type: 'ADD_POKEMONS', payload: { pokemonList } });
  }, []);

  /** @type {Dispatch['getPokemonDetail']} */
  const getPokemonDetail = useCallback(
    id => {
      const pokemonDetail = allPokemonList.find(pokemon => pokemon.id === id);
      return pokemonDetail || null;
    },
    [allPokemonList]
  );

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  /** @type {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch: {
        savePokemonList,
        getPokemonDetail,
        toggleSidebar,
      },
    }),
    [state, getPokemonDetail]
  );

  useEffect(() => {
    if (!isAnyFilterOptions) {
      const promises = [
        fetch(`${BASE_URL}/ability?limit=327&offset=0`),
        fetch(`${BASE_URL}/type?limit=20&offset=0`),
      ];
      Promise.all(promises).then(async responses => {
        /** @type {ResourceRes[]} */
        const responsesData = await Promise.all(
          responses.map(res => res.json())
        );
        const filterOptionsData = responsesData.map(res =>
          res.results.map(({ name, url }) => {
            const id = getId(url);
            return { key: `${name}-${id}`, label: name, value: name };
          })
        );
        dispatch({
          type: 'SET_FILTER_OPTIONS',
          payload: {
            abilityOptions: filterOptionsData[0],
            typeOptions: filterOptionsData[1],
          },
        });
      });
    }
  }, [isAnyFilterOptions]);

  return contextValue;
}

const AppStateContext = createContext(initialState);

/** @type {React.Context<Dispatch>} */
const AppDispatchContext = createContext({
  savePokemonList() {},
  toggleSidebar() {},
  getPokemonDetail() {
    return null;
  },
});

export function useAppState() {
  return useContext(AppStateContext);
}

export function useAppDispatch() {
  return useContext(AppDispatchContext);
}

/** @type {React.FC} */
export const AppProvider = ({ children }) => {
  const { state, dispatch } = useApp();
  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        {children}
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  );
};
