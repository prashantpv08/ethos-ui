import { Navigate } from "react-router-dom";
import { ROUTES } from "../helpers/contants";
import React from "react";

interface Props {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

const PrivateRoute: any = ({ children, isLoggedIn }: Props) =>
  isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} />;

export default PrivateRoute;
