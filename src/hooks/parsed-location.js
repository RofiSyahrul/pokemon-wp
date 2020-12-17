import { useCallback, useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { mergeQs, parseQs } from 'src/utils/helpers';

function isExternalLink(to = '') {
  return ['http', 'mailto:', 'tel:'].some(prefix => to.startsWith(prefix));
}

/** @returns {import('./parsed-location').ParsedLocationReturn} */
export function useParsedLocation() {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const { search, pathname, state } = location;

  const parsedQs = useMemo(() => {
    return parseQs(search);
  }, [search]);

  const getHref = useCallback(
    (to = '') => {
      if (!to) return;
      if (typeof to === 'string' && to.startsWith('/')) {
        return to;
      }
      let dest;
      if (
        (typeof to === 'string' && to.startsWith('?')) ||
        typeof to === 'object'
      ) {
        dest = mergeQs(search, to);
      } else {
        dest = to;
      }
      const slashedPath = pathname.endsWith('/');
      return isExternalLink(dest)
        ? dest
        : dest.startsWith('?') || slashedPath
        ? `${pathname}${dest}`
        : `${pathname}/${dest}`;
    },
    [pathname, search]
  );

  /** @type {import('./parsed-location').ParsedLocationReturn['goTo']} */
  const goTo = useCallback(
    (to = '', opts) => {
      if (!to) return;
      const { method, keepState = true, state: destState } = opts || {};
      const historyMethod =
        method === 'replace' ? history.replace : history.push;
      const href = getHref(to) || '';
      historyMethod(href, {
        ...(keepState && { state }),
        ...destState,
      });
    },
    [state, getHref]
  );

  return {
    ...location,
    params,
    parsedQs,
    goTo,
    getHref,
    state: typeof state !== 'object' ? {} : state || {},
  };
}
