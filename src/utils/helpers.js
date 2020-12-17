export function decode(value = '') {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function encode(value = '') {
  try {
    return encodeURIComponent(value);
  } catch {
    return value;
  }
}

export function cast(value) {
  try {
    return JSON.parse(value);
  } catch {
    if (!value) return undefined;
    return value;
  }
}

/** @returns {ObjectBase} */
export function parseQs(qs = '', { autoCast = true } = {}) {
  qs = qs.replace('?', '');

  /** @type {ObjectBase} */
  const result = qs.split('&').reduce((obj, keyvalue) => {
    const [key, value] = keyvalue.split('=');
    const decoded = decode(value);
    if (autoCast) obj[key] = cast(decoded);
    else obj[key] = decoded;
    return obj;
  }, {});

  return result;
}

/**
 * @param {ObjectBase} queryObj
 * @returns {string}
 */
export function stringifyQs(queryObj = {}) {
  const keys = Object.keys(queryObj);
  if (!keys.length) return '';
  return keys
    .reduce((str, key) => {
      const value = queryObj[key];
      if (value) {
        if (typeof value !== 'object') {
          str += `${key}=${encode(`${value}`)}&`;
        } else {
          str += `${key}=${encode(JSON.stringify(value))}&`;
        }
      }
      return str;
    }, '?')
    .replace(/&$/, '');
}

/**
 * @param {string | ObjectBase} qs
 * @param {string | ObjectBase} mergeWith
 * @returns {string}
 */
export function mergeQs(qs = '', mergeWith = {}) {
  const queryObj = typeof qs === 'object' ? qs : parseQs(qs);
  const otherQueryObj =
    typeof mergeWith === 'object' ? mergeWith : parseQs(mergeWith);

  const newQueryObj = { ...queryObj, ...otherQueryObj };
  return stringifyQs(newQueryObj);
}

export function capitalize(str = '') {
  return str.toLowerCase().replace(/(^|\s)\S/g, v => v.toUpperCase());
}

export function getId(url = '') {
  return url
    .split('/')
    .map(Number)
    .filter(num => num && Number.isFinite(num))[0];
}

/**
 * @param {{ url?: string, id?: number }=} param
 * @returns {string}
 * */
export function getImageUrl({ url = '', id } = {}) {
  if (typeof id === 'number') return `${BASE_IMAGE_URL}/${id}.png`;
  if (url && typeof url === 'string') {
    return `${BASE_IMAGE_URL}/${getId(url)}.png`;
  }
  return '';
}

/**
 * @param {ResourceItem} resourceItem
 * @returns {Promise<Pokemon>}
 */
export async function getPokemonOverview({ url }) {
  const image = getImageUrl({ url });
  const res = await fetch(url);
  /** @type {PokemonRes} */
  const response = await res.json();
  const { id, name, weight, height, abilities, stats, moves, types } = response;
  return {
    id,
    image,
    name,
    weight,
    height,
    abilities: abilities.map(item => item.ability.name),
    moves: moves.map(item => item.move.name),
    types: types.map(item => item.type.name),
    stats: stats.map(item => ({
      base_stat: item.base_stat,
      name: item.stat.name,
    })),
  };
}
