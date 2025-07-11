import { AxiosError } from "axios";
import Api from "./index";
// import { store } from '../redux/store';
// import { logout } from '../modules/Auth/auth.slice';

export const handleUnauthorisedUser = () => {
  //   localStorage.clear();
  //   store.dispatch(logout());
  //   // window.location.reload();
};

export const apiErrorCode = {
  unauthorized: 401,
  accessDenied: 430,
  sessionExpired: 440,
  validationError: 400,
  emailNotVerified: 403,
};

export const checkUserValidation = (statusCode: number) => {
  if (statusCode) {
    return (
      statusCode === apiErrorCode.sessionExpired ||
      statusCode === apiErrorCode.unauthorized ||
      statusCode === apiErrorCode.accessDenied
    );
  }
  return false;
};

/**
 * post api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */
const postApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  // console.log("params==>", params)
  Api.axiosInstance
    .post(endPoint, params)
    .then((response) => {
      successCallback(response);
    })
    .catch((error: AxiosError) => {
      if (error.message === "Network Error") {
        // TODO: netword error
      } else if (error.code === "ECONNABORTED") {
        const payload = {
          data: {
            statusCode: 408,
          },
        };
        errorCalback(payload);
      } else if (error.response) {
        if (checkUserValidation(error.response.status)) {
          handleUnauthorisedUser();
        }
        errorCalback(error.response);
      } else if (!error.response) {
        const payload = {
          data: {
            statusCode: "",
          },
        };
        errorCalback(payload);
      }
    });
};

/**
 * put api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */
const putApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  Api.axiosInstance
    .put(endPoint, params)
    .then((response) => {
      successCallback(response);
    })
    .catch((error) => {
      if (error.message === "Network Error") {
        // TODO: netword error
      } else if (error.code === "ECONNABORTED") {
        const payload = {
          data: {
            statusCode: 408,
          },
        };
        errorCalback(payload);
      } else if (error.response) {
        if (checkUserValidation(error.response.status)) {
          handleUnauthorisedUser();
        }
        errorCalback(error.response);
      } else if (!error.response) {
        const payload = {
          data: {
            statusCode: "",
          },
        };
        errorCalback(payload);
      }
    });
};

/**
 * get api
 *
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const getApiCall = (
  endPoint: string,
  successCallback: Function,
  errorCalback: Function,
  customHeaders: any = {}
) => {
  Api.axiosInstance
    .get(endPoint, { data: null, headers: customHeaders })
    .then((response) => {
      successCallback(response);
    })
    .catch((error) => {
      if (error.message === "Network Error") {
        // TODO: netword error
      } else if (error.code === "ECONNABORTED") {
        const payload = {
          data: {
            statusCode: 408,
          },
        };
        errorCalback(payload);
      } else if (error.response) {
        if (checkUserValidation(error.response.status)) {
          handleUnauthorisedUser();
        }
        errorCalback(error.response);
      } else if (!error.response) {
        const payload = {
          data: {
            statusCode: "",
          },
        };
        errorCalback(payload);
      }
    });
};

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const patchApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  Api.axiosInstance
    .patch(endPoint, params)
    .then((response) => {
      successCallback(response);
    })
    .catch((error) => {
      if (error.message === "Network Error") {
        // TODO: netword error
      } else if (error.code === "ECONNABORTED") {
        const payload = {
          data: {
            statusCode: 408,
          },
        };
        errorCalback(payload);
      } else if (error.response) {
        if (checkUserValidation(error.response.status)) {
          handleUnauthorisedUser();
        }
        errorCalback(error.response);
      } else if (!error.response) {
        const payload = {
          data: {
            statusCode: "",
          },
        };
        errorCalback(payload);
      }
    });
};

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const deleteApiCall = (
  endPoint: string,
  body = {},
  successCallback: Function,
  errorCallback: Function,
  params = ""
) => {
  body = body || {};
  Api.axiosInstance
    .delete(endPoint + params, { data: body })
    .then((response) => {
      successCallback(response);
    })
    .catch((error) => {
      if (error.message === "Network Error") {
        // TODO: netword error
      } else if (error.code === "ECONNABORTED") {
        const payload = {
          data: {
            status: 408,
          },
        };
        errorCallback(payload);
      } else if (error.response) {
        if (checkUserValidation(error.response.status)) {
          handleUnauthorisedUser();
        }
        errorCallback(error.response);
      } else if (!error.response) {
        const payload = {
          data: {
            status: "",
          },
        };
        errorCallback(payload);
      }
    });
};

export { getApiCall, putApiCall, postApiCall, patchApiCall, deleteApiCall };
