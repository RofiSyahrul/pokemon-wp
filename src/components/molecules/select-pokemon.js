import React, { memo, useCallback } from 'react';
import { DropdownAsync } from 'goods-ui';
import { useLazyFetch } from 'src/hooks/lazy-fetch';
import { capitalize, getId } from 'src/utils/helpers';
import { useParsedLocation } from 'src/hooks/parsed-location';

const SelectPokemon = memo(() => {
  const [fetchPokemons] = useLazyFetch('/pokemon');
  const { parsedQs, goTo } = useParsedLocation();
  const { comparison } = parsedQs;

  const fetchOptions = useCallback(async ({ page, limit }) => {
    const data = await fetchPokemons({ limit, offset: page * limit });
    return data.results.map(item => ({
      value: getId(item.url),
      label: capitalize(item.name),
    }));
  }, []);

  const onChange = useCallback(({ value }) => {
    goTo(`?comparison=${value}`, { method: 'replace' });
  }, []);

  return (
    <DropdownAsync
      label='Compare with...'
      placeholder='Compare with...'
      containerProps={{ my: '0' }}
      value={comparison}
      onChange={onChange}
      fetchOptions={fetchOptions}
      fetchLimit={PAGINATION_LIMIT}
    />
  );
});

export default SelectPokemon;
