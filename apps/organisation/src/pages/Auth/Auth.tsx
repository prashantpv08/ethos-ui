import { Navigate, Route, Routes } from 'react-router-dom';
import { Login, Registration, ResetPassword } from '../../components/Auth';
import { GridContainer } from '@ethos-frontend/components';
import Logo from '../../assets/logo.svg?react';

export const Auth = () => {
  return (
    <GridContainer columns={8} className="h-screen overflow-y-auto">
      <div className="sm:col-start-2 sm:col-end-8 col-start-1 col-end-9 sm:py-10 p-5 grid self-center">
        <Logo width={200} className="m-auto" />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="user/login" element={<Login />} />
          <Route path="signup" element={<Registration />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </div>
    </GridContainer>
  );
};
