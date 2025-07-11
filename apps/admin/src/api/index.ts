import axios, { AxiosInstance } from 'axios';
import { handleUnauthorisedUser } from './methods';
// import { redirect } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;
console.log('API_URL', API_URL);
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    //   // "Access-Control-Allow-Origin": "*",
    //   // 'WWW-Authenticate': localStorage.getItem('token')
    //   //   ? `BASIC ${localStorage.getItem('token')}`
    //   //   : '',
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    Authorization: localStorage.getItem('token')
      ? `Bearer ${localStorage.getItem('token')}`
      : ``,
    //   // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //   // language: "en",
    //   // // offset: new Date().getTimezoneOffset(),
    //   // offset: 0,
  },
});

// const UNAUTHORIZED = 401;

const clearAuthToken = () => {
  delete axiosInstance.defaults.headers['WWW-Authenticate'];
};

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Modify config.url here
//     // console.log({ config })
//     // config.url = 'https://new-url.com' + config.url;
//     if (config.url === "change-password") {
//       config.baseURL = process.env.API_URL_ONBOARDING;
//     } else if (process.env.API_URL && config.url === "studios") {
//       config.baseURL = process.env.API_URL.replace("v1/admin", "v1/common");
//     } else if (process.env.API_URL && config.url?.includes("depts")) {
//       config.baseURL = process.env.API_URL.replace("v1/admin", "v1");
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error);
    const {
      data: { statusCode, type },
    } = error?.response;

    // console.log("status", status , error.response)

    if (statusCode === 401 && type === 'SESSION_EXPIRED') {
      console.log('working');
      handleUnauthorisedUser();
      clearAuthToken();
      if (window) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthorizationToken = (token?: string) => {
  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
};
export const resetAuthorizationToken = () => {
  axiosInstance.defaults.headers['Authorization'] = `Basic ${btoa(
    'reel:reel@123'
  )}`;
};

// const deleteTokenForInstance = () => {
//   console.log("hitting");
//   axiosInstance.interceptors.request.eject(
//     axiosInstance.interceptors.request.use(() => {})
//   );
// };

// const axiosInstanceWithoutToken: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   timeout: 30000,
//   headers: {
//     // 'Access-Control-Allow-Origin': '*',
//     // 'WWW-Authenticate': localStorage.getItem('token')
//     //   ? `BASIC ${localStorage.getItem('token')}`
//     //   : '',
//     api_key: "1234",
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     Authorization: `Basic ${btoa("reel:reel@123")}`,
//     platform: 1,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     language: "en",
//     // offset: new Date().getTimezoneOffset(),
//     offset: 0,
//   },
// });

export default {
  axiosInstance,
  setAuthorizationToken,
  clearAuthToken,
  // axiosInstanceWithoutToken,
};
