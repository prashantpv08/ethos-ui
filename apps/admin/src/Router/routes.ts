import { lazy } from "react";
import { ROUTES } from "../helpers/constants";
import { routeTypes } from "../types";
import Login from "../pages/Login/login";

const Organisation = lazy(() => import("../pages/Organisation"));

export const pageRoutes: routeTypes[] = [
  {
    id: 2,
    name: "Login",
    path: ROUTES.LOGIN,
    Component: Login,
    isPrivate: false,
    pageProp: { page: "Login" },
  },

  {
    id: 13,
    name: "Organisation",
    path: ROUTES.DASHBOARD,
    Component: Organisation,
    isPrivate: true,
    pageProp: { page: "organisation" },
  },
];
