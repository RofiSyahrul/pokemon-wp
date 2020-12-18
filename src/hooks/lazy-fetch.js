import { useCallback, useEffect, useReducer } from 'react';
import produce from 'immer';
import { openFeedback } from 'goods-ui';
import { stringifyQs } from 'src/utils/helpers';

/**
 * @typedef {'BEFORE_FETCH'
 * | 'FETCH_ERROR'
 * | 'FETCH_SUCCESS'
 * | 'RESET_ERROR'} ActionType
 * */

/**
 * @typedef {{
 *  type: ActionType, payload?: Partial<Pick<LazyFetchState, 'error'>>
 * }} Action
 * */

/** @type {LazyFetchState} */
const initialState = {
  loading: false,
  error: null,
};

/**
 * @param {LazyFetchState} draft
 * @param {Action} action
 */
function recipe(draft, action) {
  const { type, payload = {} } = action;
  const { error } = payload;
  switch (type) {
    case 'BEFORE_FETCH':
      draft.loading = true;
      draft.error = null;
      return;
    case 'FETCH_ERROR':
      draft.loading = false;
      if (error instanceof Error) {
        draft.error = error;
      }
      return;
    case 'FETCH_SUCCESS':
      draft.loading = false;
      draft.error = null;
      return;
    case 'RESET_ERROR':
      draft.error = null;
      return;
    default:
      throw new Error('Unknown action type');
  }
}

const reducer = produce(recipe);

/**
 * @returns {LazyFetchReturn}
 */
export function useLazyFetch(endpoint = '/') {
  const [{ loading, error }, dispatch] = useReducer(reducer, initialState);

  /** @type {FetchDataFn} */
  const fetchData = useCallback(async (params = {}) => {
    const qs = typeof params === 'string' ? params : stringifyQs(params);
    dispatch({ type: 'BEFORE_FETCH' });
    try {
      const res = await fetch(`${BASE_URL}${endpoint}${qs}`);
      const { status } = res;
      if (status >= 400) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: {
            error: new Error(`Failed to fetch data. Status: ${status}`),
          },
        });
        return null;
      }
      /** @type {ObjectBase} */
      const response = await res.json();
      dispatch({ type: 'FETCH_SUCCESS' });
      return response;
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: { error: err } });
    }
  }, []);

  useEffect(() => {
    if (error && error.message) {
      openFeedback({
        title: 'Error',
        body: error.message,
        prefix: { icName: 'rejected', icColor: 'red60' },
        closeText: 'Close',
        onClose() {
          dispatch({ type: 'RESET_ERROR' });
        },
      });
    }
  }, [error]);

  return [fetchData, { loading, error }];
}
