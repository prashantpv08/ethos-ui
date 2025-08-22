import endPoints from '../../api/endpoint';
import { deleteApiCall, getApiCall, patchApiCall } from '../../api/methods';

export const getOrgList = (
  values?: any,
  callback?: any,
  errorCallBack?: any,
) => {
  const { pageNo = 1, searchKey = '', limit = 10, sortOrder = 1, sortBy = 'email' } = values || {};
  getApiCall(
    `${endPoints.orgList}?pageNo=${pageNo}&limit=${limit}&sortOrder=${sortOrder}&sortBy=${sortBy}${searchKey ? '&searchKey=' + searchKey : ''}`,
    (s: any) => {
      callback?.(s.data.data);
    },
    (e: any) => {
      errorCallBack?.();
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const getActiveOrgList = (callback?: any, errorCallBack?: any) => {
  getApiCall(
    `${endPoints.activeOrg}`,
    (s: any) => {
      callback?.(s.data.data);
    },
    (e: any) => {
      errorCallBack?.();
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const getOrgDetails = (values?: any, callback?: any) => {
  const { id } = values || {};
  getApiCall(
    `${endPoints.deleteOrGetOrg}detail/${id}`,
    (s: any) => {
      callback?.(s);
    },
    (e: any) => {
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const updateCommission = (values: any, callback: any) => {
  patchApiCall(
    endPoints.updateComission,
    values,
    () => {
      callback?.();
    },
    (e: any) => {
      callback?.();
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const blockOrg = (values: any, callback: any) => {
  const { id } = values;
  patchApiCall(
    endPoints.blockOrg + '/' + id,
    {},
    () => {
      callback?.();
    },
    (e: any) => {
      callback?.();
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const deleteORG = (id: number, callback: Function) => {
  deleteApiCall(
    `${endPoints.deleteOrGetOrg}/${id}`,
    '',
    () => {
      callback?.();
    },
    (e: any) => {
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};

export const updateUserAction = (values: any, callback: any) => {
  const { id, type, comment } = values;
  patchApiCall(
    endPoints.approveOrg + id,
    { ...(comment && { comment }), type },
    () => {
      callback?.();
    },
    (e: any) => {
      callback?.();
      if (e?.data && e?.data.message) {
        // notify(e.data.message, 'error');
      } else {
        // notify(null, 'error');
      }
    },
  );
};
