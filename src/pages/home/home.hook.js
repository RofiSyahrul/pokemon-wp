import { useCallback, useEffect, useState } from 'react';
import { useInfiniteScroll } from 'goods-helper';
import { useAppDispatch, useAppState } from 'src/context/app.context';
import { useLazyFetch } from 'src/hooks/lazy-fetch';
import { getPokemonOverview } from 'src/utils/helpers';
import { openFeedback } from 'goods-ui';
import { useParsedLocation } from 'src/hooks/parsed-location';

export function useHome() {
  const { allPokemonList, offset, sidebarCollapsed } = useAppState();
  const { savePokemonList } = useAppDispatch();

  /** @type {[PokemonList, SetState<PokemonList>]} */
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  /** @type {LazyFetchReturn<ResourceRes, PaginationParams>} */
  const [fetchPokemons, { loading }] = useLazyFetch('/pokemon');

  /** @type {LazyFetchReturn<AttributeRes>} */
  const [fetchPokemonsByAbility, { loading: abilityLoading }] = useLazyFetch(
    '/ability'
  );

  /** @type {LazyFetchReturn<AttributeRes>} */
  const [fetchPokemonByType, { loading: typeLoading }] = useLazyFetch('/type');

  /** @type {ParsedLocationReturn<HomePageQS>} */
  const { parsedQs } = useParsedLocation();
  const { filterBy, ability, type } = parsedQs;
  const isFilter =
    (filterBy === 'ability' && ability) || (filterBy === 'type' && type);

  /** @type {(res: ResourceRes | AttributeRes, isOnFilter?: boolean) => Promise<PokemonList>} */
  const handleResponse = useCallback(async (res, isOnFilter = false) => {
    /** @type {PokemonList} */
    let pokemonList = [];
    try {
      if (isOnFilter) {
        pokemonList = await Promise.all(
          res.pokemon.map(item => getPokemonOverview(item.pokemon))
        );
        setFilteredPokemons(pokemonList);
      } else {
        pokemonList = await Promise.all(res.results.map(getPokemonOverview));
        savePokemonList(pokemonList);
      }
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
      return pokemonList;
    }
  }, []);

  const fetchMore = useCallback(async () => {
    if (isFilter) return [{ id: 0, name: '' }];
    const res = await fetchPokemons({ limit: PAGINATION_LIMIT, offset });
    const pokemonList = await handleResponse(res);
    return pokemonList;
  }, [offset, isFilter]);

  const { isLoading } = useInfiniteScroll({
    fetchMore,
    scrollTargetSelector: '#app',
  });

  useEffect(() => {
    const appNode = document.getElementById('app');
    if (appNode) appNode.classList.add('home');
    if (allPokemonList.length === 0) {
      fetchPokemons({ limit: PAGINATION_LIMIT, offset }).then(handleResponse);
    }
    return () => {
      if (appNode) appNode.classList.remove('home');
    };
  }, []);

  useEffect(() => {
    if (filterBy === 'ability' && ability) {
      fetchPokemonsByAbility(`/${ability}`).then(res => {
        handleResponse(res, true);
      });
    } else if (filterBy === 'type' && type) {
      fetchPokemonByType(`/${type}`).then(res => {
        handleResponse(res, true);
      });
    }
  }, [filterBy, ability, type]);

  return {
    isFilter,
    sidebarCollapsed,
    pokemons: isFilter ? filteredPokemons : allPokemonList,
    loading: loading || isLoading || abilityLoading || typeLoading,
  };
}
