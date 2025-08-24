import { lazy } from "react";
import { ROUTES } from "../helpers/constants";
import { routeTypes } from "../types";
import Login from "../pages/Login/login";

const Organisation = lazy(() => import("../Pages/Organisation"));
const OrganisationDetails = lazy(
  () => import("../Pages/Organisation/Details")
);

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
  {
    id: 14,
    name: "Organisation Details",
    path: ROUTES.ORG_DETAIL,
    Component: OrganisationDetails,
    isPrivate: true,
    pageProp: { page: "organisation" },
  },
];
