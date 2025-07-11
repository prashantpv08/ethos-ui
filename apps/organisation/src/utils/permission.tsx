import { matchPath, NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import withPermission from '../hoc/withPermission';
import { JSX } from 'react/jsx-runtime';
import { Label } from '@ethos-frontend/ui';
import {
  IModuleConfig,
  IModulesConfigType,
  IModuleChildConfig,
} from '../routes';

interface Access {
  module: string;
  pages: string[];
}

const hasAccess = (
  module: string,
  userType: string | null,
  access: Access[]
): boolean => {
  if (userType === 'ORGANISATION') return true;
  return access.some((acc) => acc.module === module);
};

const hasChildAccess = (
  moduleKey: string,
  userType: string | null,
  access: Access[]
): boolean => {
  if (userType === 'ORGANISATION') return true;
  return access.some((acc) => acc.module === moduleKey && acc.pages.length > 0);
};

const generateRouteForModule = (key: string, moduleConfig: IModuleConfig) => {
  const routes = [];

  if (moduleConfig.component) {
    routes.push({
      path: moduleConfig.path,
      element: React.createElement(
        withPermission(
          moduleConfig.component,
          key,
          moduleConfig.requiredPermissions
        )
      ),
    });
  }

  if (moduleConfig.children) {
    moduleConfig.children.forEach((child: any) => {
      routes.push({
        path: child.path,
        element: React.createElement(
          withPermission(child.component, child.key, child.requiredPermissions)
        ),
      });
    });
  }

  return routes;
};

export const generateRoutes = (
  access: Access[],
  userType: string | null,
  modulesConfig: IModulesConfigType
) => {
  return Object.keys(modulesConfig).flatMap((key) => {
    const moduleConfig = modulesConfig[key];

    if (hasAccess(key, userType, access)) {
      return generateRouteForModule(key, moduleConfig);
    }

    if (moduleConfig.children) {
      return moduleConfig.children.flatMap((child: IModuleChildConfig) => {
        if (hasAccess(child.key, userType, access)) {
          return generateRouteForModule(child.key, {
            ...child,
            icon: moduleConfig.icon,
          } as IModuleConfig);
        }
        return [];
      });
    }

    return [];
  });
};

const generateMenuItem = (
  key: string,
  userType: string | null,
  access: Access[],
  styles: any,
  Iconbutton: React.ComponentType<any>,
  openMenus: { [key: string]: boolean },
  setOpenMenus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >,
  location: ReturnType<typeof useLocation>,
  toggleNavigation: boolean,
  moduleConfig?: IModuleConfig
) => {
  const isChildRouteActive = moduleConfig?.children?.some(
    (child: IModuleChildConfig) =>
      matchPath(`${child.path}`, location.pathname) ||
      matchPath(`${child.path}/*`, location.pathname)
  );

  const isParentRouteActive =
    matchPath(`${moduleConfig?.path}`, location.pathname) || isChildRouteActive;

  const hasChildrenAccess = moduleConfig?.children?.some((child: any) =>
    hasChildAccess(child.key, userType, access)
  );

  if (!hasAccess(key, userType, access) && !hasChildrenAccess) return null;

  const isSubMenuOpen =
    (openMenus[key] && !toggleNavigation) || isChildRouteActive;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    if (location.pathname === path) {
      e.preventDefault();
    }
  };

  return (
    <li key={key}>
      {moduleConfig?.component ? (
        <NavLink
          className={({ isActive }) =>
            isActive || isParentRouteActive ? styles.active : ''
          }
          to={moduleConfig?.path}
          onClick={(e) => handleNavClick(e, moduleConfig.path)}
        >
          <Label
            variant="h5"
            className={`flex items-center gap-2 ${styles.activeLabel}`}
          >
            <span className="">{moduleConfig.icon}</span>{' '}
            {moduleConfig.label}
          </Label>
        </NavLink>
      ) : (
        <div
          className={`flex items-center w-full justify-between ${
            styles.hasChildren
          } ${isSubMenuOpen ? styles.activeSubMenu : ''} ${
            toggleNavigation ? styles.hoverSubMenu : ''
          }`}
          onClick={() => {
            setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
          }}
        >
          <Label
            variant="h5"
            className={`flex items-center gap-2 ${styles.activeLabel}`}
          >
            <span className="">{moduleConfig?.icon}</span>{' '}
            {moduleConfig?.label}
          </Label>
          <Iconbutton
            className={`${styles.expandIcon} !mr-2`}
            name={isSubMenuOpen ? 'line' : 'expand'}
          />
        </div>
      )}
      {hasChildrenAccess && (
        <div
          className={`${styles.submenu} ${
            isSubMenuOpen && !toggleNavigation ? styles.activeSubMenu : ''
          } ${toggleNavigation ? styles.hoverSubMenuChildren : ''}`}
        >
          <div
            className={`${styles.menus} ${
              isSubMenuOpen && !toggleNavigation ? styles.on : ''
            }`}
          >
            <ul>
              {moduleConfig?.children?.map((child: any) => {
                if (hasChildAccess(child.key, userType, access)) {
                  return (
                    <li key={child.path}>
                      <NavLink
                        className={({ isActive }) =>
                          isActive ||
                          matchPath(`${child.path}`, location.pathname)
                            ? styles.active
                            : ''
                        }
                        to={child.path}
                        onClick={(e) => handleNavClick(e, child.path)}
                      >
                        <Label
                          variant="h5"
                          className={`flex items-center gap-2 ${styles.activeLabel}`}
                        >
                          {child.label}
                        </Label>
                      </NavLink>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export const generateMenuItems = (
  access: Access[],
  userType: string | null,
  openMenus: { [key: string]: boolean },
  setOpenMenus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >,
  styles: any,
  Iconbutton: React.ComponentType<any>,
  location: ReturnType<typeof useLocation>,
  toggleNavigation: boolean,
  modulesConfig?: IModulesConfigType
) => {
  const overviewItems: JSX.Element[] = [];
  const managementItems: JSX.Element[] = [];
  let supportsLanguageTabs = false;

  if (modulesConfig) {
    Object.keys(modulesConfig).forEach((key) => {
      const moduleConfig = modulesConfig[key];

      if (moduleConfig.multiLanguage) {
        if (matchPath(moduleConfig.path, location.pathname)) {
          supportsLanguageTabs = true;
        }
      }

      if (moduleConfig.children) {
        moduleConfig.children.forEach((child) => {
          if (child.multiLanguage) {
            if (matchPath(child.path, location.pathname)) {
              supportsLanguageTabs = true;
            }
          }
        });
      }

      const item = generateMenuItem(
        key,
        userType,
        access,
        styles,
        Iconbutton,
        openMenus,
        setOpenMenus,
        location,
        toggleNavigation,
        moduleConfig
      );

      if (moduleConfig?.overview) {
        if (item) overviewItems.push(item);
      } else {
        if (item) managementItems.push(item);
      }
    });
  }

  return { overviewItems, managementItems, supportsLanguageTabs };
};
