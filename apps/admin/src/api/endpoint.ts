const endPoints = {
  login: "admin/login",
  logout: "admin/logout",
  orgList: "admin/organisation",
  approveOrg: "admin/organisation/approval/",
  updateComission: "admin/organisation/updateCommission",
  deleteOrGetOrg: "admin/organisation/",
  activeOrg: 'admin/organisation/activeOrgs',
  blockOrg: 'admin/organisation/status',
  resetOTP: "/resend-otp",
  forget_password: "/forgot-password",
  resetpassword: "reset-password",
  change_password: "change-password",
  updateProfile: "profile",
  getProfile: "admin-details",
  template: "template",
  banner: {
    getBannersList: "banner-management",
    addBanner: "client/add-banner",
    editBanner: "client/edit-banner",
    deleteBanner: "client/delete-banner",
  },

  clientManagement: {
    addStudio: "client/add-studio",
    editStudio: "client/edit-studio",
    addDepartment: "client/add-department",
    editDepartment: "client/edit-department",
    addCategory: "client/add-category",
    editCategory: "client/edit-category",
    addRole: "client/add-role",
    editRole: "client/edit-role",
    getallClientManagementList: "client-management",
  },
  vendorManagement: {
    vendorManagementList: "vendor-management",
    vendorManagementApproval: "vendor-approval",
    vendorStatus: "vendor/status",
  },

  staticContentManagement: {
    getStaticContent: "client/get-static-content",
    getFAQ: "client/faq",
    getAddContactInfo: "client/contact-info",
    addStaticContent: "client/add-static-content",
    editStaticContent: "client/edit-static-content",
    addContactInfo: "client/add-contact-info",
  },

  productionManagement: {
    getProductionList: "productions",
    createProduction: "production",
    productionStatus: "production/status",
    department: "department",
  },

  user_management: {
    getUserManagementList: "/user-management",
    user_action: "admin-user-action",
    updateUser: "/user",
    getAssociateList: "/request_management",
  },

  verify: "verify-otp",
  businessRegister: "business/registration",
  common: {
    deparmentList: "dept-list",
    countryList: "user/country-list",
    categories: "category/list",
    studioList: "studios",
  },
  product: {
    create: "/template",
    list: "/template",
  },

  commonApi: {
    countryList: "/country",
  },
  department: "/depts",
  companyManagement: {
    getUserDetailsWithPhone: "mobile/user",
    getCompnayList: "/studio",
    updateStatus: "studio/status",
    create: "/studio",
  },

  roleAndResponsiblity: {
    getRoles: "/role-management",
    updateStatus: "role/status",
  },

  requestManagement: {
    getRequest: "/request_management",
    editRequest: "/request",
  },
};

export default endPoints;
