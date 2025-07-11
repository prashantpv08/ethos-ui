export enum PRODUCT_TYPE {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
}

export enum PRODUCT_VALUE {
  VEG = 'Vegeterian',
  NON_VEG = 'Non Vegenterian',
}

export enum STRIPE_CONNECT_STATUS {
  NOT_CONNECTED = 'Not Connected',
  LINK_CREATED = 'Link Created',
  CONNECTED_WITHOUT_APPROVED = 'Connected Without Approved',
  CONNECTED = 'Connected',
}

export enum MODULES {
  RAW = 'raw',
  TAX = 'tax',
  CATEGORY = 'category',
  PRODUCT = 'product',
  COMBO = 'combo',
  COUPON = 'coupon',
  EXTRA = 'extra',
  ORDER = 'order',
  INVETORY = 'inventory',
  RECIPE = 'recipe',
  TRANSACTION = 'transactionCode',
  TRANSACTION_LOGS = 'transactionLogs',
  UNIT = 'unit',
  CASHIER = 'cashier',
  CHARACTERISTIC = 'characteristics',
  KITCHEN = 'kds',
  DASHBOARD = 'dashboard'
}

export enum MODULE_PAGES {
  LIST = 'list',
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}

export const moduleWithPages = [
  {
    key: MODULES.DASHBOARD,
    label: 'Dashboard',
    pages: [MODULE_PAGES.LIST],
  },
  {
    key: MODULES.TAX,
    label: 'Tax Codes',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.UNIT,
    label: 'Unit of Measures',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.TRANSACTION,
    label: 'Transactions Codes',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.CATEGORY,
    label: 'Category',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.EXTRA,
    label: 'Modifier/Extras',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.CHARACTERISTIC,
    label: 'Characterstics',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.PRODUCT,
    label: 'Product',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.COMBO,
    label: 'Combos',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  // {
  //   key: MODULES.COUPON,
  //   label: 'Coupons',
  //   pages: [
  //     MODULE_PAGES.LIST,
  //     MODULE_PAGES.ADD,
  //     MODULE_PAGES.EDIT,
  //     MODULE_PAGES.DELETE,
  //   ],
  // },

  {
    key: MODULES.ORDER,
    label: 'Orders',
    pages: [MODULE_PAGES.LIST, MODULE_PAGES.EDIT],
  },
  {
    key: MODULES.INVETORY,
    label: 'Inventory',
    pages: [MODULE_PAGES.LIST, MODULE_PAGES.EDIT],
  },
  {
    key: MODULES.RAW,
    label: 'Raw Material',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },
  {
    key: MODULES.RECIPE,
    label: 'Recipe',
    pages: [
      MODULE_PAGES.LIST,
      MODULE_PAGES.ADD,
      MODULE_PAGES.EDIT,
      MODULE_PAGES.DELETE,
    ],
  },

  {
    key: MODULES.TRANSACTION_LOGS,
    label: 'Transaction Logs',
    pages: [MODULE_PAGES.LIST],
  },

  {
    key: MODULES.CASHIER,
    label: 'Cashier',
    pages: [MODULE_PAGES.LIST],
  },
  {
    key: MODULES.KITCHEN,
    label: 'KDS',
    pages: [MODULE_PAGES.LIST, MODULE_PAGES.EDIT],
  },
  
];
