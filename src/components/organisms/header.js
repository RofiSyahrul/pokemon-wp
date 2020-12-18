import React, { memo } from 'react';
import { Box, Icon } from 'goods-core';
import { useAppDispatch, useAppState } from 'src/context/app.context';
import { Button } from 'goods-ui';
import { useHistory } from 'react-router-dom';

const Header = memo(({ home = false, children }) => {
  const { sidebarCollapsed } = useAppState();
  const { toggleSidebar } = useAppDispatch();
  const history = useHistory();

  return (
    <Box
      as='header'
      posi='fixed'
      top='0px'
      left={sidebarCollapsed || !home ? '0px' : '260px'}
      w={sidebarCollapsed || !home ? '100%' : 'calc(100% - 260px)'}
      h='64px'
      bg='white'
      shadow='high'
      fDir='row'
      fJustify='space-between'
      fAlign='center'
      px='s'
      z='appBar'
    >
      {!home ? (
        <Icon
          name='arrow'
          c='black30'
          onClick={history.goBack}
          cursor='pointer'
        />
      ) : (
        sidebarCollapsed && (
          <Button
            bg='blue60'
            w='fit-content'
            py='xxs'
            px='xs'
            minH='fit-content'
            onClick={toggleSidebar}
          >
            Filter
          </Button>
        )
      )}
      {children}
    </Box>
  );
});

export default Header;
