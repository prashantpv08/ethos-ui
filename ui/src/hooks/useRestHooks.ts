import {
  useQuery as useCustomQuery,
  useMutation as useCustomMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { ERROR_MESSAGES } from '../constants';
import { useModuleLanguage } from '@ethos-frontend/context';
import { apiFetcher, createAxiosInstance, getLangHeader } from '../utils/api';
import i18n from 'i18next';

const EXCLUDE_LANG_APIS = ['userProfile', 'stripe-status'];

const useRestQuery = <
  TData = AxiosResponse,
  TError = AxiosError,
  TReturn = TData | false,
>(
  key: QueryKey | string,
  url: string,
  options?: Omit<
    UseQueryOptions<TData, TError, TData>,
    'queryKey' | 'queryFn'
  > & {
    onSuccess?: (data: TData) => void;
    onError?: (errorPayload: any) => void;
  },
  config: AxiosRequestConfig = {},
) => {
  const { moduleLanguage } = useModuleLanguage();
  const moduleLang = getLangHeader(moduleLanguage);

  const queryKey: QueryKey = EXCLUDE_LANG_APIS.includes(String(key))
    ? Array.isArray(key)
      ? key
      : [key]
    : [key, moduleLang];

  return useCustomQuery<TData, TError>({
    queryKey,
    queryFn: async (): Promise<TData> => {
      try {
        const data = await apiFetcher(url, config, moduleLang);
        if (options?.onSuccess) {
          options.onSuccess(data);
        }
        return data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const payload = axiosError.response?.data ?? axiosError;
        if (axiosError?.response?.status === 401) {
          toast.error(i18n.t(ERROR_MESSAGES.NOT_AUTHORIZED));
          return false as TData;
        }
        if (axiosError?.response?.status === 409) {
          toast.error(i18n.t(ERROR_MESSAGES.IN_USE));
          return false as TData;
        }
        if (axiosError?.response?.status === 404) {
          toast.error(i18n.t(ERROR_MESSAGES.NOT_FOUND));
          return false as TData;
        }
        options?.onError?.(payload);
        return false as TData;
      }
    },
    retry: options?.retry ?? false,
    refetchOnWindowFocus: false,
    throwOnError: options?.throwOnError ?? false,
    ...options,
  });
};

const useRestMutation = <
  TData = AxiosResponse,
  TError = AxiosError,
  TVariables = unknown,
>(
  url: string,
  config: AxiosRequestConfig = {},
  options: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn'
  > = {},
): UseMutationResult<TData, TError, TVariables> => {
  const { moduleLanguage } = useModuleLanguage();
  const moduleLang = getLangHeader(moduleLanguage);
  const axiosInstance = createAxiosInstance(moduleLang);
  const { onError: userOnError, ...restOptions } = options;

  // Mutation request handler
  const fetcher = async (variables: TVariables): Promise<TData> => {
    try {
      const response = await axiosInstance({
        ...config,
        url,
        data: variables,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const payload = axiosError.response?.data ?? {
        message: axiosError.message,
        statusCode: axiosError.response?.status,
      };
      return Promise.reject(payload);
    }
  };

  const mutation = useCustomMutation<TData, TError, TVariables>({
    mutationFn: fetcher,
    onError: (error, variables, context) => {
      const status: number | undefined = (error as any).statusCode;
      if (status === 401) {
        toast.error(i18n.t(ERROR_MESSAGES.NOT_AUTHORIZED));
        return false;
      } else if (status === 409) {
        if (config.method?.toLowerCase() === 'delete') {
          toast.error(i18n.t(ERROR_MESSAGES.IN_USE));
        } else {
          toast.error(i18n.t(ERROR_MESSAGES.ALREADY_EXIST));
        }
        return false;
      } else if (status === 404) {
        toast.error(i18n.t(ERROR_MESSAGES.NOT_FOUND));
        return false;
      }
      userOnError?.(error as TError, variables, context);
      return false;
    },
    ...restOptions,
  });

  return {
    ...mutation,
  };
};

export { useRestQuery, useRestMutation };
