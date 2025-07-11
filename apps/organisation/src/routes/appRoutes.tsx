import { createElement, useMemo, lazy, Suspense, useState, Key } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from '../components/Dashboard';
import { generateRoutes } from '../utils/permission';
import withPermission from '../hoc/withPermission';
import { NoAccess } from '../pages/noAccess';
import { useUser } from '../context/user';
import { ModulesConfig } from './privateRoutes';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useModuleLanguage } from '@ethos-frontend/context';
import { PrimaryButton } from '@ethos-frontend/ui';
import { useApolloClient } from '@apollo/client';
import i18n from '@ethos-frontend/i18n';

const Profile = lazy(() =>
  import('../pages/Profile').then((module) => ({ default: module.Profile })),
);
const EditProfile = lazy(() =>
  import('../components/Account/editProfile').then((module) => ({
    default: module.EditProfile,
  })),
);
const CombosView = lazy(() =>
  import('../components/Managements/Product').then((module) => ({
    default: module.CombosView,
  })),
);
const CombosForm = lazy(() =>
  import('../components/Managements/Product').then((module) => ({
    default: module.CombosForm,
  })),
);
const AddReceipeForm = lazy(() =>
  import('../components/Managements/Inventory/Recipe').then((module) => ({
    default: module.RecipeForm,
  })),
);
const ProductView = lazy(() =>
  import('../components/Managements/Product').then((module) => ({
    default: module.ProductView,
  })),
);
const ProductForm = lazy(() =>
  import('../components/Managements/Product').then((module) => ({
    default: module.ProductForm,
  })),
);
const CashierReport = lazy(() =>
  import('../components/Managements').then((module) => ({
    default: module.CashierReport,
  })),
);
const OrderDetails = lazy(() =>
  import('../components/Managements').then((module) => ({
    default: module.OrderDetails,
  })),
);
const PayCounter = lazy(() =>
  import('../components/Managements').then((module) => ({
    default: module.PayCounter,
  })),
);
const OrderList = lazy(() =>
  import('../components/Managements').then((module) => ({
    default: module.OrderList,
  })),
);
const KitchenList = lazy(() =>
  import('../components/Kitchen').then((module) => ({
    default: module.Kitchen,
  })),
);

export const AppRoutes = ({
  supportsLanguageTabs,
}: {
  supportsLanguageTabs: boolean;
}) => {
  const { userData } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  const dynamicModulesConfig = userData ? ModulesConfig(userData) : null;
  const queryClient = useQueryClient();
  const apolloClient = useApolloClient();
  const { moduleLanguage, setModuleLanguage } = useModuleLanguage();
  const storedLang = localStorage.getItem('interface_lang');
  const SUPPORTED_LANGUAGES =
    userData && storedLang ? JSON.parse(storedLang) : null;
  const currentLang = moduleLanguage[location.pathname] || i18n.language;

  const routes = useMemo(() => {
    if (userData && dynamicModulesConfig) {
      const access = userData?.access ?? [];
      return generateRoutes(
        access,
        userData?.type as string,
        dynamicModulesConfig,
      );
    }
  }, [userData]);

  const handleChangeLang = (lang: string) => {
    setModuleLanguage(location.pathname, lang);
    queryClient.invalidateQueries({ queryKey: [location.pathname] });
    apolloClient.refetchQueries({ include: 'active' });
  };

  return (
    <Suspense fallback={<CircularProgress />}>
      {supportsLanguageTabs && (
        <div className="flex gap-2 mb-4">
          {SUPPORTED_LANGUAGES?.map((lang: string) => (
            <PrimaryButton
              key={lang}
              size="small"
              variant={currentLang === lang ? 'contained' : 'outlined'}
              className={currentLang === lang ? 'active' : ''}
              onClick={() => handleChangeLang(lang)}
            >
              {t(`languages.${lang}`)}
            </PrimaryButton>
          ))}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {routes?.map((route, index) => <Route key={index} {...route} />)}
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/profile/edit" element={<EditProfile />} />
        <Route path="/account/settings" element={<Profile />} />
        <Route path="/account/qr" element={<Profile />} />
        <Route path="no-access" element={<NoAccess />} />
        <Route
          path="orders/progress"
          element={createElement(withPermission(OrderList, 'order', ['list']))}
        />
        <Route
          path="orders/ready"
          element={createElement(withPermission(OrderList, 'order', ['list']))}
        />
        <Route
          path="orders/completed"
          element={createElement(withPermission(OrderList, 'order', ['list']))}
        />
        <Route
          path="orders/cancelled"
          element={createElement(withPermission(OrderList, 'order', ['list']))}
        />
        <Route
          path="orders/:id/payAtCounter"
          element={createElement(
            withPermission(PayCounter, 'order', ['list', 'edit']),
          )}
        />
        <Route
          path="orders/:id"
          element={createElement(
            withPermission(OrderDetails, 'order', ['list']),
          )}
        />
        <Route
          path="kitchen-order/progress"
          element={createElement(withPermission(KitchenList, 'kds', ['list']))}
        />
        <Route
          path="combos/:id"
          element={createElement(withPermission(CombosView, 'combo', ['list']))}
        />
        <Route
          path="combos/add"
          element={createElement(withPermission(CombosForm, 'combo', ['add']))}
        />
        <Route
          path="combos/edit/:id"
          element={createElement(withPermission(CombosForm, 'combo', ['edit']))}
        />
        <Route
          path="add-recipe-card"
          element={createElement(
            withPermission(AddReceipeForm, 'recipe', ['add']),
          )}
        />
        <Route
          path="editReceipe/:id"
          element={createElement(
            withPermission(AddReceipeForm, 'recipe', ['edit']),
          )}
        />
        <Route
          path="product/:id"
          element={createElement(
            withPermission(ProductView, 'product', ['list']),
          )}
        />
        <Route
          path="product/add"
          element={createElement(
            withPermission(ProductForm, 'product', ['add']),
          )}
        />
        <Route
          path="product/edit/:id"
          element={createElement(
            withPermission(ProductForm, 'product', ['edit']),
          )}
        />
        <Route
          path="cashier-report/user/:id/name/:name"
          element={<CashierReport />}
        />
      </Routes>
    </Suspense>
  );
};
