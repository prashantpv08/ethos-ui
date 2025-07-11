import { Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from '../pages/Auth';
import { Layout } from '../layout/Layout';
import { withConditionalRoute } from '@ethos-frontend/hoc';

const PublicLogin = withConditionalRoute({
  component: Auth,
  redirectIfAuthenticated: true,
  redirectTo: '/',
});

// For a protected route like dashboard, where unauthenticated users are redirected to login
const PrivateDashboard = withConditionalRoute({
  component: Layout,
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
