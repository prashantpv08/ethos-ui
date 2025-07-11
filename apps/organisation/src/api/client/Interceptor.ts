import { useState } from 'react';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { handleJwtExpiration } from '@ethos-frontend/utils';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';
import i18n from 'i18next';

const useAxios = (
  url: string,
  additionalHeaders: Record<string, string> = {}
) => {
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError | any>();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const isTokenValid = handleJwtExpiration(token);

  const headers = {
    ...additionalHeaders,
    ...(isTokenValid && token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const baseURL = import.meta.env.VITE_APP_API_URL + url;

  const axiosInstance = axios.create({
    baseURL,
    headers,
  });

  const makeRequest = async (config: AxiosRequestConfig) => {
    try {
      setLoading(true);
      const result = await axiosInstance({
        ...config,
      });
      setResponse(result?.data);
    } catch (err) {
      const error = err as AxiosError;
      if (error) {
        setError(error);
        if (
          error &&
          (error?.response?.data as Record<string, unknown>)?.statusCode === 401
        ) {
          toast.error(i18n.t(ERROR_MESSAGES.NOT_AUTHORIZED));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, makeRequest };
};

export default useAxios;
