import React, { memo, useCallback } from 'react';
import { Box, Icon } from 'goods-core';
import { Button, Dropdown } from 'goods-ui';
import { useParsedLocation } from 'src/hooks/parsed-location';
import { capitalize } from 'src/utils/helpers';
import { useAppDispatch, useAppState } from 'src/context/app.context';

/** @type {(FilterKey | 'none')[]} */
const filterKeys = ['none', 'ability', 'type'];

/** @type {import('goods-ui').OptionItem[]} */
const filterKeyOptions = filterKeys.map(key => ({
  value: key,
  label: capitalize(key) || 'None',
}));

const Sidebar = memo(() => {
  const { sidebarCollapsed, abilityOptions, typeOptions } = useAppState();
  const { toggleSidebar } = useAppDispatch();

  /** @type {ParsedLocationReturn<HomePageQS>} */
  const { parsedQs, goTo } = useParsedLocation();
  const { filterBy = '', ability = '', type = '' } = parsedQs;

  /** @type {OnChangeDropdown} */
  const onChangeDropdown = useCallback(
    ({ value, name }) => {
      if (name === 'filterBy') {
        goTo(`?filterBy=${value === 'none' ? '' : value}&ability=&type=`, {
          method: 'replace',
        });
        return;
      }
      goTo({ [name]: value }, { method: 'replace' });
    },
    [goTo]
  );

  return (
    <Box
      as='aside'
      d={sidebarCollapsed ? 'none' : 'flex'}
      w='260px'
      h='100vh'
      posi='fixed'
      top='0px'
      left='0px'
      py='xl'
      px='s'
      bg='blue60'
      shadow='high'
      z='drawer'
    >
      <Button
        w='fit-content'
        minH='fit-content'
        bg='transparent'
        p='xxs'
        posi='absolute'
        top='12px'
        right='12px'
        onClick={toggleSidebar}
      >
        <Icon name='close' size='normal' c='white' />
      </Button>
      <Dropdown
        label='Filter by'
        placeholder='Filter by'
        name='filterBy'
        autoComplete='off'
        value={filterBy}
        options={filterKeyOptions}
        onChange={onChangeDropdown}
        containerProps={{ mt: 'xs' }}
      />
      {filterBy === 'type' && (
        <Dropdown
          label='Select pokemon type'
          placeholder='Select pokemon type'
          name='type'
          autoComplete='off'
          value={type}
          options={typeOptions}
          onChange={onChangeDropdown}
        />
      )}
      {filterBy === 'ability' && (
        <Dropdown
          label='Select pokemon ability'
          placeholder='Select pokemon ability'
          name='ability'
          autoComplete='off'
          value={ability}
          options={abilityOptions}
          onChange={onChangeDropdown}
        />
      )}
    </Box>
  );
});

export default Sidebar;
