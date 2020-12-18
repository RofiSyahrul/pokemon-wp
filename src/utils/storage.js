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

  /** @returns {OptionItem[]} */
  get abilityOptions() {
    return getList('ability-options');
  },
  set abilityOptions(list) {
    saveList('ability-options', list);
  },

  /** @returns {OptionItem[]} */
  get typeOptions() {
    return getList('type-options');
  },
  set typeOptions(list) {
    return saveList('type-options', list);
  },
};

export default storage;
