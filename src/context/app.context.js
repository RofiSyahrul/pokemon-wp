import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import produce from 'immer';
import storage from 'src/utils/storage';

/**
 * @typedef {import('./app.context').State} State
 * @typedef {import('./app.context').Action} Action
 * @typedef {import('./app.context').Dispatch} Dispatch
 */

/** @type {State} */
const initialState = {
  offset: storage.offset,
  allPokemonList: storage.allPokemonList,
  filterRecords: storage.filterRecords,
  matchPredictions: storage.matchPredictions,
};

/** @type {FilterKey[]} */
const filterKeys = ['ability', 'move', 'type'];

/**
 *
 * @param {State} draft
 * @param {Action} action
 */
function recipe(draft, action) {
  const { filterRecords, matchPredictions } = draft;
  const { type, payload = {} } = action;
  const { pokemonList, filterRecord, matchPrediction } = payload;
  switch (type) {
    case 'ADD_POKEMONS':
      if (Array.isArray(pokemonList)) {
        draft.allPokemonList = [...draft.allPokemonList, ...pokemonList];
        storage.allPokemonList = draft.allPokemonList;
        draft.offset += PAGINATION_LIMIT;
        storage.offset = draft.offset;
      }
      return;
    case 'ADD_FILTER_RECORD':
      if (typeof filterRecord === 'object') {
        const { key, result } = filterRecord;
        if (!filterKeys.includes(key)) return;
        const index = filterRecords.findIndex(record => record.key === key);
        if (index === -1) {
          draft.filterRecords.push({ key, results: [result] });
          storage.filterRecords = draft.filterRecords;
          return;
        }
        const { name } = result;
        const { results } = filterRecords[index];
        const resultIdx = results.findIndex(item => item.name === name);
        if (resultIdx === -1) {
          results.push(result);
        } else {
          results.splice(resultIdx, 1, result);
        }
        draft.filterRecords.splice(index, 1, { key, results });
        storage.filterRecords = draft.filterRecords;
      }
      return;
    case 'ADD_MATCH_PREDICTION':
      if (typeof matchPrediction === 'object') {
        const { pokemonIds } = matchPrediction;
        if (pokemonIds[0] === pokemonIds[1] || !pokemonIds[1]) return;
        const index = matchPredictions.findIndex(item =>
          item.pokemonIds.every(id => pokemonIds.includes(id))
        );
        if (index === -1) {
          draft.matchPredictions.push(matchPrediction);
          storage.matchPredictions = draft.matchPredictions;
          return;
        }
        draft.matchPredictions.splice(index, 1, matchPrediction);
        storage.matchPredictions = draft.matchPredictions;
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
  const { filterRecords, matchPredictions } = state;

  /** @type {Dispatch['savePokemonList']} */
  const savePokemonList = useCallback(pokemonList => {
    dispatch({ type: 'ADD_POKEMONS', payload: { pokemonList } });
  }, []);

  /** @type {Dispatch['saveFilterRecord']} */
  const saveFilterRecord = useCallback(filterRecord => {
    dispatch({ type: 'ADD_FILTER_RECORD', payload: { filterRecord } });
  }, []);

  /** @type {Dispatch['saveMatchPrediction']} */
  const saveMatchPrediction = useCallback(matchPrediction => {
    dispatch({ type: 'ADD_MATCH_PREDICTION', payload: { matchPrediction } });
  }, []);

  /** @type {Dispatch['getFilteredPokemons']} */
  const getFilteredPokemons = useCallback(
    (key, name) => {
      const filterRecord = filterRecords.find(item => item.key === key);
      if (!filterRecord) return [];
      const { results } = filterRecord;
      const result = results.find(item => item.name === name);
      if (!result) return [];
      return result.pokemonList;
    },
    [filterRecords]
  );

  const getMatchPrediction = useCallback(
    pokemonIds => {
      if (pokemonIds[0] === pokemonIds[1] || !pokemonIds[1]) return null;
      const matchPrediction = matchPredictions.find(item =>
        item.pokemonIds.every(id => pokemonIds.includes(id))
      );
      return matchPrediction || null;
    },
    [matchPredictions]
  );

  /** @type {ContextValue} */
  const contextValue = useMemo(
    () => ({
      state,
      dispatch: {
        savePokemonList,
        saveFilterRecord,
        saveMatchPrediction,
        getFilteredPokemons,
        getMatchPrediction,
      },
    }),
    [state, getFilteredPokemons, getMatchPrediction]
  );

  return contextValue;
}

const AppStateContext = createContext(initialState);

/** @type {React.Context<Dispatch>} */
const AppDispatchContext = createContext({
  savePokemonList() {},
  saveFilterRecord() {},
  saveMatchPrediction() {},
  increaseOffset() {},
  getFilteredPokemons() {
    return [];
  },
  getMatchPrediction() {
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
