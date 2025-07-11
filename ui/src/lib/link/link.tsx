import { NavLink, NavLinkProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { CommonColors, styled } from '@mui/material';

export interface CustomLinkProps extends NavLinkProps {
  children: ReactNode | string;
  to: string;
}

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '16px',
  fontWeight: 500,
  textDecoration: 'none',
  fontFamily: theme.typography.fontFamily,
  '&:hover': {
    color: theme.palette.primary.dark,
  },
  '&:visited': {
    color: theme.palette.action.selected,
  },
}));

const Link = ({ children, to, ...props }: CustomLinkProps) => {
  return (
    <StyledNavLink to={to} {...props}>
      {children}
    </StyledNavLink>
  );
};

Link.displayName = 'Link';
export default Link;
