import { notify } from '../../Utils/toastify';
import endPoints from '../../api/endpoint';
import { deleteApiCall, getApiCall, patchApiCall } from '../../api/methods';

export const getOrgList = (
  values?: any,
  callback?: any,
  errorCallBack?: any
) => {
  const {
    pageNo = 1,
    searchKey = '',
    limit = 10,
    sortOrder = 1,
    sortBy = 'email',
  } = values || {};

  return (dispatch: any, getState: any) => {
    getApiCall(
      `${
        endPoints.orgList
      }?pageNo=${pageNo}&limit=${limit}&sortOrder=${sortOrder}&sortBy=${sortBy}${
        searchKey ? '&searchKey=' + searchKey : ''
      }`,
      (s: any) => {
        const {
          data: { statusCode },
          data,
        } = s;

        // console.log('RESSS', data)

        // console.log("RES DD =>", data);
        callback(data.data);
      },
      (e: any) => {
        //   setLoad(false)
        errorCallBack();
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};

export const getActiveOrgList = (callback?: any, errorCallBack?: any) => {
  return (dispatch: any, getState: any) => {
    getApiCall(
      `${endPoints.activeOrg}`,
      (s: any) => {
        const {
          data: { statusCode },
          data,
        } = s;

        // console.log('RESSS', data)

        // console.log("RES DD =>", data);
        callback(data.data);
      },
      (e: any) => {
        //   setLoad(false)
        errorCallBack();
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};

export const getOrgDetails = (values?: any, callback?: any) => {
  const { id } = values || {};

  return (dispatch: any, getState: any) => {
    // console.log('dataToSend', values)
    getApiCall(
      `${endPoints.deleteOrGetOrg}detail/${id}`,

      (s: any) => {
        const {
          data: { statusCode },
          data,
        } = s;

        // console.log('RESSS', data)
        // if (statusCode && statusCode === 200) {
        // console.log('RES Products =>', data)

        callback(data);
        // }
      },
      (e: any) => {
        //   setLoad(false)
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};

export const updateCommission = (values: any, callback: any) => {
  // console.log(values)
  // const { id, type } = values;
  return (dispatch: any, getState: any) => {
    patchApiCall(
      endPoints.updateComission,
      values,
      (s: any) => {
        const {
          data: { statusCode },
        } = s;

        console.log('RESSS  edit actionssssss', s);
        // if (statusCode && statusCode === 200) {
        callback();

        // notify('Product created successfully', 'success')
        // }
      },
      (e: any) => {
        //   setLoad(false)
        callback();
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};

export const blockOrg = (values: any, callback: any) => {
  // console.log(values)
  const { id, type } = values;
  return (dispatch: any, getState: any) => {
    patchApiCall(
      endPoints.blockOrg + '/' + id,
      {},
      (s: any) => {
        const {
          data: { statusCode },
        } = s;

        console.log('RESSS  edit actionssssss', s);
        // if (statusCode && statusCode === 200) {
        callback();

        // notify('Product created successfully', 'success')
        // }
      },
      (e: any) => {
        //   setLoad(false)
        callback();
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};

export const deleteORG = (id: number, callback: Function) => {
  return (dispatch: any, getState: any) => {
    // console.log('dataToSend', values)

    deleteApiCall(
      `${endPoints.deleteOrGetOrg}/${id}`,
      '',
      (s: any) => {
        const {
          data: { statusCode },
        } = s;

        // console.log('RESSS banner update', s)
        // if (statusCode && statusCode === 200) {
        callback();
        // navigate(ROUTES.PRODUCTS)
        // notify('Product created successfully', 'success')
        // }
      },
      (e: any) => {
        //   setLoad(false)
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};
// updateUserAction

export const updateUserAction = (values: any, callback: any) => {
  // console.log(values)
  const { id, type, comment } = values;
  return (dispatch: any, getState: any) => {
    patchApiCall(
      endPoints.approveOrg + id,
      { ...(comment && { comment }), type },
      (s: any) => {
        const {
          data: { statusCode },
        } = s;

        console.log('RESSS  edit actionssssss', s);
        // if (statusCode && statusCode === 200) {
        callback();

        // notify('Product created successfully', 'success')
        // }
      },
      (e: any) => {
        //   setLoad(false)
        callback();
        if (e?.data && e?.data.message) {
          notify(e?.data.message, 'error');
        } else {
          notify(null, 'error');
        }
      }
    );
  };
};
