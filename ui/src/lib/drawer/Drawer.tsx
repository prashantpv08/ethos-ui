import React, { ReactNode } from 'react';
import { SwipeableDrawer, SwipeableDrawerProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@emotion/styled';

export interface DrawerComponentProps extends SwipeableDrawerProps {
  children: ReactNode;
}

export const StyledDrawer: StyledComponent<DrawerComponentProps> = styled(
  SwipeableDrawer
)(({ theme }) => ({
  '& .MuiDrawer-paperAnchorBottom': {
    borderRadius: '28px 28px 0 0',
    padding: '30px 0',
  },
}));

export const Puller = styled('div')(() => ({
  width: 32,
  height: 4,
  backgroundColor: '#79747E',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 16px)',
}));

const Drawer: React.FC<DrawerComponentProps> = ({ children, ...props }) => {
  return (
    <StyledDrawer {...props}>
      <>
        <Puller />
        {children}
      </>
    </StyledDrawer>
  );
};

Drawer.displayName = 'Drawer';

export default Drawer;
