import { useCallback, useEffect } from 'react';
import { useInfiniteScroll } from 'goods-helper';
import { useAppDispatch, useAppState } from 'src/context/app.context';
import { useLazyFetch } from 'src/hooks/lazy-fetch';
import { getPokemonOverview } from 'src/utils/helpers';
import { openFeedback } from 'goods-ui';

export function useHome() {
  const { allPokemonList, offset } = useAppState();
  const { savePokemonList } = useAppDispatch();

  /** @type {LazyFetchReturn<ResourceRes, PaginationParams>} */
  const [fetchPokemons, { loading }] = useLazyFetch('/pokemon');

  /** @type {(res: ResourceRes) => Promise<PokemonList>} */
  const handleResponse = useCallback(async res => {
    try {
      const pokemonList = await Promise.all(
        res.results.map(getPokemonOverview)
      );
      savePokemonList(pokemonList);
      return pokemonList;
    } catch (error) {
      if (error instanceof Error || error?.message) {
        openFeedback({
          title: 'Error',
          body: error.message,
          prefix: { icName: 'rejected', icColor: 'red60' },
          closeText: 'Close',
        });
      }
      return [];
    }
  }, []);

  const fetchMore = useCallback(async () => {
    const res = await fetchPokemons({ limit: PAGINATION_LIMIT, offset });
    const pokemonList = await handleResponse(res);
    return pokemonList;
  }, [offset]);

  const { isLoading } = useInfiniteScroll({
    fetchMore,
    scrollTargetSelector: '#app',
  });

  useEffect(() => {
    if (allPokemonList.length === 0) {
      fetchPokemons({ limit: PAGINATION_LIMIT, offset }).then(handleResponse);
    }
  }, []);

  return {
    pokemons: allPokemonList,
    loading: loading || isLoading,
  };
}
