import { useEffect, useState } from 'react';
import { useParsedLocation } from 'src/hooks/parsed-location';
import { useDocumentTitle } from 'src/hooks/document-title';
import { capitalize, getPokemonOverview } from 'src/utils/helpers';
import { useAppDispatch, useAppState } from 'src/context/app.context';

/** @typedef {Pokemon & { loading: boolean, errorMessage: string }} PokemonDetailState */

/** @typedef {React.Dispatch<React.SetStateAction<PokemonDetailState>>} SetPokemonDetail */

/** @param {number} id */
function usePokemonDetail(id) {
  const { allPokemonList } = useAppState();
  const { getPokemonDetail } = useAppDispatch();

  /** @type {[PokemonDetailState, SetPokemonDetail]} */
  const [pokemonDetail, setPokemonDetail] = useState({
    loading: true,
    errorMessage: '',
  });

  useEffect(() => {
    if (Number.isNaN(id) || !id) return () => {};
    const storedPokemonDetail = getPokemonDetail(id);
    if (storedPokemonDetail) {
      setPokemonDetail({
        loading: false,
        errorMessage: '',
        ...storedPokemonDetail,
      });
    } else {
      getPokemonOverview({ url: `${BASE_URL}/pokemon/${id}` })
        .then(result => {
          setPokemonDetail({ loading: false, errorMessage: '', ...result });
        })
        .catch(() => {
          setPokemonDetail({ loading: false, errorMessage: 'Not Found' });
        });
    }
  }, [id, allPokemonList]);

  return pokemonDetail;
}

export function useDetails() {
  /** @type {ParsedLocationReturn<DetailsPageQS, DetailsPageParam>} */
  const { params, parsedQs } = useParsedLocation();
  const id = Number(params.id);
  const { comparison } = parsedQs;

  const firstPokemon = usePokemonDetail(id);
  const firstPokemonName = capitalize(firstPokemon.name || '');

  const secondPokemon = usePokemonDetail(comparison);
  const secondPokemonName = capitalize(secondPokemon.name || '');

  useDocumentTitle(
    firstPokemonName
      ? secondPokemonName
        ? `${firstPokemonName} vs ${secondPokemonName}`
        : firstPokemonName
      : ''
  );

  return {
    firstPokemon,
    secondPokemon,
    isComparing: Boolean(secondPokemonName),
  };
}
