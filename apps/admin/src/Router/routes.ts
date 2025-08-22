import { lazy } from "react";
import { ROUTES } from "../helpers/contants";
import { routeTypes } from "../types";

const DashboardWrapper = lazy(() => import("../Pages/Dashboard"));
const AuthLayout = lazy(() => import("../Containers/AuthLayout"));
const Organisation = lazy(() => import("../Pages/Organisation"));

export const pageRoutes: routeTypes[] = [
  {
    id: 1,
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    Component: DashboardWrapper,
    isPrivate: true,
  },
  {
    id: 2,
    name: "Login",
    path: ROUTES.LOGIN,
    Component: AuthLayout,
    isPrivate: false,
    pageProp: { page: "Login" },
  },

  {
    id: 13,
    name: "Organisation",
    path: ROUTES.ORGANISATION,
    Component: Organisation,
    isPrivate: true,
    pageProp: { page: "organisation" },
  },
];
