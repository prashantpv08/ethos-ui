import type { ComponentType } from "react";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import ForgotPassword from "../Pages/Forgot/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";

interface Props {
  page?: string;
}

const pageMap: Record<string, ComponentType<any>> = {
  Login,
  SignUp: Register,
  Forgot: ForgotPassword,
  Reset: ResetPassword,
};

export default function AuthLayout({ page }: Props) {
  const Component = (page && pageMap[page]) || Login;
  return <Component />;
}
