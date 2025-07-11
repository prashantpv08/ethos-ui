export const ROUTES = {
  LOGIN: "/login",
  VERIFY: "/verify",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/resetPassword",
  SIGNUP: "/signup",
  DASHBOARD: "/",
  WELCOME: "/welcome",
  BUSINESSINFO: "/business-info",

  ORDERS: "/orders",

  USERS: "/users",
  USERS_PROFILE: "/user-profile",
  EDIT_PROFILE: "/edit-profile",
  EDIT_PROFILE_VERIFY: "/verify-otp",
  ORGANISATION: "/organisation",
  ORGANISATION_DETAILS: "/organisation-details",

};

export const standardErrorMsg: string = "Something went wrong!";

export const ErrorMsg = (value: number | string) => {
  return {
    min: `Min. ${value} Characters allowed.`,
    max: `Max. ${value} Characters allowed`,
    required: `${value} is required.`,
    onlyLetter: `${value} should only contain letters`,
    email: `Please enter valid email address.`,
    string: ``,
    typeError: `Must be a Number`,
    positive: `Must be a positive Number`,
    integer: `Must be an Integer`,
    array: ``,
  };
};
