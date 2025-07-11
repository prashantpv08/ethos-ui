// withConditionalRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

interface WithConditionalRouteProps {
  component: React.ComponentType;
  redirectIfAuthenticated: boolean;
  redirectTo: string;
}

export const withConditionalRoute = ({
  component: Component,
  redirectIfAuthenticated,
  redirectTo,
}: WithConditionalRouteProps) => {
  const WrapperComponent = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
  ) => {
    const isAuth = isAuthenticated();

    if (redirectIfAuthenticated && isAuth) {
      // Redirect authenticated users to a specific path
      return <Navigate to={redirectTo} replace />;
    } else if (!redirectIfAuthenticated && !isAuth) {
      // Redirect unauthenticated users to a specific path
      return <Navigate to={redirectTo} replace />;
    }

    // Render the component based on authentication status
    return <Component {...props} />;
  };

  // Set a display name for the wrapped component
  WrapperComponent.displayName = `WithConditionalRoute(${getDisplayName(
    Component
  )})`;

  return WrapperComponent;
};
