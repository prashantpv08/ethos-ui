import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useUser } from '../context/user';

const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  module: string,
  requiredPermissions: string[]
) => {
  return (props: P) => {
    const { userData } = useUser();

    const { loading, hasAccess, userPermissions } = useMemo(() => {
      if (!userData) {
        return { loading: true, hasAccess: false, userPermissions: [] };
      }

      if (userData.type === 'ORGANISATION') {
        return {
          loading: false,
          hasAccess: true,
          userPermissions: ['list', 'edit', 'add', 'delete'],
        };
      }

      const modulePermission = userData.access?.find(
        (perm) => perm.module === module
      );

      if (!modulePermission) {
        return { loading: false, hasAccess: false, userPermissions: [] };
      }

      const hasAccess = requiredPermissions.some((permission) =>
        modulePermission.pages.includes(permission)
      );

      return {
        loading: false,
        hasAccess,
        userPermissions: modulePermission.pages,
      };
    }, [userData, module, requiredPermissions]);

    if (loading) {
      return <CircularProgress />;
    }

    if (!hasAccess) {
      return <Navigate to={userData ? '/no-access' : '/'} />;
    }

    return <WrappedComponent {...props} permissions={userPermissions} />;
  };
};

export default withPermission;
