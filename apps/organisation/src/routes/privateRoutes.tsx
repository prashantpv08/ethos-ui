import { Iconbutton } from '@ethos-frontend/ui';
import {
  AccountBalanceOutlined,
  CardMembershipOutlined,
  RestaurantOutlined,
  ScaleOutlined,
} from '@mui/icons-material';
import { Units } from '../components/Units';
import {
  Characterstics,
  Combos,
  ComplementaryProduct,
  ProductManagement,
  Modifier,
  Category,
} from '../components/Managements/Product';
import { IUserData } from '../context/user';
import { Tax } from '../components/Tax';
import {
  Inventory,
  RawMaterial,
  TransactionLogs,
  Cashier,
  CashierReport,
  OrderList,
  UserList,
} from '../components/Managements';
import { RecipeCards } from '../components/Managements/Inventory/Recipe';
import { Kitchen } from '../components/Kitchen';
import { Transaction } from '../components/Transaction';
import { t } from 'i18next';
import { JSX } from 'react';

export interface IModuleChildConfig {
  key: string;
  label: string;
  path: string;
  component: React.ComponentType;
  requiredPermissions: string[];
  overview?: boolean;
  multiLanguage?: boolean;
}

export interface IModuleConfig {
  icon: JSX.Element;
  label: string;
  path: string;
  component?: React.ComponentType;
  requiredPermissions: string[];
  overview?: boolean;
  children?: IModuleChildConfig[];
  multiLanguage?: boolean;
}

export interface IModulesConfigType {
  [key: string]: IModuleConfig;
}

export const ModulesConfig = (userData: IUserData): IModulesConfigType => {
  const isEmployee = userData?.role === 'EMPLOYEE';

  return {
    product: {
      icon: <Iconbutton name="product" />,
      label: t('navigation.product'),
      path: '',
      requiredPermissions: ['list'],
      children: [
        {
          key: 'category',
          label: t('navigation.category'),
          path: '/category',
          component: Category,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
        {
          key: 'extra',
          label: t('navigation.modifier'),
          path: '/modifier',
          component: Modifier,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
        {
          key: 'characteristics',
          label: t('navigation.characteristics'),
          path: '/characterstics',
          component: Characterstics,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
        {
          key: 'product',
          label: t('navigation.product'),
          path: '/product',
          component: ProductManagement,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
        {
          key: 'combo',
          label: t('navigation.combo'),
          path: '/combos',
          component: Combos,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
        {
          key: 'complimentaryProduct',
          label: t('navigation.complimentaryProduct'),
          path: '/complimentaryproduct',
          component: ComplementaryProduct,
          requiredPermissions: ['list'],
          multiLanguage: true,
        },
      ],
    },
    inventory: {
      icon: <Iconbutton name="inventory" />,
      label: t('navigation.inventory'),
      path: '',
      requiredPermissions: ['list'],
      children: [
        {
          key: 'inventory',
          label: t('navigation.inventoryTransactions'),
          path: '/inventory',
          component: Inventory,
          requiredPermissions: ['list'],
        },
        {
          key: 'raw',
          label: t('navigation.raw'),
          path: '/raw',
          component: RawMaterial,
          requiredPermissions: ['list'],
        },
        {
          key: 'recipe',
          label: t('navigation.recipe'),
          path: '/receipeCard',
          component: RecipeCards,
          requiredPermissions: ['list'],
        },
        {
          key: 'transactionLogs',
          label: t('navigation.transactionLogs'),
          path: '/logs',
          component: TransactionLogs,
          requiredPermissions: ['list'],
        },
      ],
    },

    cashier: {
      icon: <Iconbutton MuiIcon={AccountBalanceOutlined} />,
      label: t('navigation.cashier'),
      path: '',
      requiredPermissions: ['list'],
      children: [
        {
          key: 'cashier',
          label: t('navigation.cashierBalance'),
          path: isEmployee
            ? `/cashier/user/${userData?._id}`
            : `/cashier/admin/${userData?._id}`,
          component: CashierReport,
          requiredPermissions: ['list'],
        },
        {
          key: 'cashierReports',
          label: t('navigation.cashierReports'),
          path: `/cashier-report`,
          component: Cashier,
          requiredPermissions: ['list'],
        },
      ],
    },

    order: {
      icon: <Iconbutton name="orders" />,
      label: t('navigation.order'),
      path: '/orders/received',
      component: OrderList,
      requiredPermissions: ['list'],
    },

    transactionCode: {
      icon: <Iconbutton MuiIcon={CardMembershipOutlined} />,
      label: t('navigation.transactionCode'),
      path: '/transaction',
      component: Transaction,
      requiredPermissions: ['list'],
      overview: true,
    },

    tax: {
      icon: <Iconbutton name="tax" />,
      label: t('navigation.tax'),
      path: '/tax',
      component: Tax,
      requiredPermissions: ['list'],
      overview: true,
    },

    unit: {
      icon: <Iconbutton MuiIcon={ScaleOutlined} />,
      label: t('navigation.unit'),
      path: '/units',
      component: Units,
      requiredPermissions: ['list'],
      overview: true,
    },

    user: {
      icon: <Iconbutton name="user" />,
      label: t('navigation.user'),
      path: '/user',
      component: UserList,
      requiredPermissions: ['list'],
      overview: true,
    },
    kds: {
      icon: <Iconbutton MuiIcon={RestaurantOutlined} />,
      label: t('navigation.kds'),
      path: '/kitchen-order/received',
      component: Kitchen,
      requiredPermissions: ['list'],
    },
  };
};
