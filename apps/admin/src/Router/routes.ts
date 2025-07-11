import { lazy } from 'react';
import { ROUTES } from '../helpers/contants';
import { routeTypes } from '../types';

// import ProductManagement from '../Pages/ProductManagement'
const DashboardWrapper = lazy(() => import('../Pages/Dashboard'));
const AuthLayout = lazy(() => import('../Containers/AuthLayout'));
const Orders = lazy(() => import('../Pages/Orders'));
const Organisation = lazy(() => import('../Pages/Organisation'));

export const pageRoutes: routeTypes[] = [
  {
    id: 1,
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    Component: DashboardWrapper,
    isPrivate: true,
  },
  {
    id: 2,
    name: 'Login',
    path: ROUTES.LOGIN,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: 'Login' },
  },
  {
    id: 3,
    name: 'SignUp',
    path: ROUTES.SIGNUP,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: 'SignUp' },
  },
  {
    id: 4,
    name: 'Verify',
    path: ROUTES.VERIFY,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: 'Verify' },
  },
  {
    id: 5,
    name: 'Forgot',
    path: ROUTES.FORGOT_PASSWORD,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: 'Forgot' },
  },
  {
    id: 6,
    name: 'Reset',
    path: ROUTES.RESET_PASSWORD,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: 'Reset' },
  },

  {
    id: 12,
    name: 'Orders',
    path: ROUTES.ORDERS,
    Component: Orders,
    isPrivate: true,
    pageProp: { page: 'Orders' },
  },
  {
    id: 13,
    name: 'Organisation',
    path: ROUTES.ORGANISATION,
    Component: Organisation,
    isPrivate: true,
    pageProp: { page: 'organisation' },
  },
  {
    id: 14,
    name: 'Organisation',
    path: ROUTES.ORGANISATION_DETAILS,
    Component: Organisation,
    isPrivate: true,
    pageProp: { page: 'organisation-details' },
  },
];
