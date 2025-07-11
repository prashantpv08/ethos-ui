enum STATIC {
  ADMIN = 'admin',
  EMPLOYEE = 'employee'
}

export const API_URL = {
  profile: `${STATIC.ADMIN}/profile`,
  revenueReport: `${STATIC.ADMIN}/organisation/orderRevenue`,
  dashboard: `${STATIC.ADMIN}/dashboard`,
  cashierDashboardUser: `${STATIC.ADMIN}/cashierlog/dashboard`,
  mostSellingItem: `${STATIC.ADMIN}/organisation/mostSellingItems`,
  orderCount: `${STATIC.ADMIN}/organisation/orderCount`,
  stripeStatus: `${STATIC.ADMIN}/stripe-status`,
  updatePassword: `${STATIC.ADMIN}/updatePassword`,
  transactionCode: `${STATIC.ADMIN}/transaction`,
  forgetPassword: `${STATIC.ADMIN}/organisation/forgetPassword`,
  login: `${STATIC.ADMIN}/login`,
  validateToken: `${STATIC.ADMIN}/organisation/validateToken`,
  resetPassword: `${STATIC.ADMIN}/organisation/updatePassword`,
  register: `${STATIC.ADMIN}/organisation`,
  category: `${STATIC.ADMIN}/category`,
  categoryUpdate: `${STATIC.ADMIN}/category/update`,
  categoryDropdown: `${STATIC.ADMIN}/category/dropdown`,
  tax: `${STATIC.ADMIN}/tax`,
  taxDropdown: `${STATIC.ADMIN}/tax/dropdown`,
  taxElements: `${STATIC.ADMIN}/tax/dropdown?type=element`,
  exportDashboardData: `${STATIC.ADMIN}/organisation/dashboard/export`,
  exportMostSellingData: `${STATIC.ADMIN}/organisation/mostSellingItems/export`,
  resetCustomerOrderPassword: `${STATIC.ADMIN}/reset-customer-password`,
  exportOrderReport: `${STATIC.ADMIN}/order/exportCsv`,
  exportInventoryReport: `${STATIC.ADMIN}/raw/exportCsv`,
  exportRawReport: `${STATIC.ADMIN}/raw/exportListCsv`,
  linkStripeAccount: `${STATIC.ADMIN}/organisation/linkStripeConnect`,
  regenerateStripeLink: `${STATIC.ADMIN}/organisation/regenerateConnectLink`,
  bill: `${STATIC.ADMIN}/setting/bill`,
  rawMaterialList: `${STATIC.ADMIN}/raw/dropdown`,
  characteristic: `${STATIC.ADMIN}/characteristic`,
  characteristicDropdown: `${STATIC.ADMIN}/characteristic/dropdown`,
  extra: `${STATIC.ADMIN}/extra`,
  productsList: `${STATIC.ADMIN}/recipe/product/dropdown`,
  rawMaterial: `${STATIC.ADMIN}/raw`,
  adminCashier: `${STATIC.ADMIN}/cashierlog/transactions`,
  complementary: `${STATIC.ADMIN}/complementary`,
  complementaryList: `${STATIC.ADMIN}/complementary/list`,
  app: `${STATIC.ADMIN}/setting/app`,
  logout: `${STATIC.ADMIN}/logout`
};

export const EMPLOYEE_API_URL = {
  employeeLogin: `${STATIC.EMPLOYEE}/login`,
  employeeForgetPassword: `${STATIC.EMPLOYEE}/forgetPassword`,
  cashierDashboard: `${STATIC.ADMIN}/cashierlog/employee/dashboard`,
  resetPassword: `${STATIC.EMPLOYEE}/resetPassword`,
  cashierEmployee: `${STATIC.ADMIN}/cashierlog/employee/transactions`,
  employeeUpdatePassword: `${STATIC.EMPLOYEE}/updatePassword`,
};

export const ORDER_SCREEN_API_URL = {
  login: 'customer/login',
  sendForgotPasswordEmail: `${STATIC.ADMIN}/request-customer-password-change`,
};
