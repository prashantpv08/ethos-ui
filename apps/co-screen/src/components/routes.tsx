import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './login';
import { withConditionalRoute } from '@ethos-frontend/hoc';
import { Status } from './status';

const PublicLogin = withConditionalRoute({
  component: Login,
  redirectIfAuthenticated: true,
  redirectTo: '/',
});

// For a protected route like dashboard, where unauthenticated users are redirected to login
const PrivateDashboard = withConditionalRoute({
  component: Status,
  redirectIfAuthenticated: false,
  redirectTo: '/auth/login',
});

export const Routing = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<PublicLogin />} />
      <Route path="/*" element={<PrivateDashboard />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
