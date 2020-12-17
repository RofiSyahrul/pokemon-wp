import { cast } from './helpers';

/** @param {StorageKey} key */
function getList(key) {
  const stringified = localStorage.getItem(key) || '[]';
  const list = cast(stringified);
  if (Array.isArray(list)) return list;
  return [];
}

/** @param {StorageKey} key */
function saveList(key, list = []) {
  if (!Array.isArray(list) || !list.length) return;
  localStorage.setItem(key, JSON.stringify(list));
}

const storage = {
  get offset() {
    const value = Number(localStorage.getItem('offset') || '0');
    if (Number.isNaN(value)) return 0;
    return value;
  },
  set offset(value) {
    if (typeof value !== 'number') value = parseInt(value);
    if (Number.isNaN(value)) return;
    localStorage.setItem('offset', `${value}`);
  },

  /** @returns {PokemonList} */
  get allPokemonList() {
    return getList('all-pokemon-list');
  },
  set allPokemonList(list) {
    saveList('all-pokemon-list', list);
  },

  /** @returns {FilterItem[]} */
  get filterRecords() {
    return getList('filter-records');
  },
  set filterRecords(list) {
    saveList('filter-records', list);
  },

  /** @returns {MatchPrediction[]} */
  get matchPredictions() {
    return getList('match-predictions');
  },
  set matchPredictions(list) {
    saveList('match-predictions', list);
  },
};

export default storage;
