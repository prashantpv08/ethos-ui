import { useRestQuery } from '@ethos-frontend/hook';
import { API_URL } from '@ethos-frontend/constants';

export interface TransactionCodeOption {
  value: string;
  label: string;
}

export const useTransactionCodes = () => {
  const { data, isLoading, refetch, isFetching, error } = useRestQuery(
    'fetch-transaction-codes',
    API_URL.transactionCode,
    {
      enabled: false,
    },
  );

  const loadTransactionCodes = () => {
    refetch();
  };

  const options: TransactionCodeOption[] =
    data?.data?.data?.map(
      (val: { _id: string; name: string; transaction_status: string }) => ({
        value: val._id,
        label: `${val.name} - ${val.transaction_status}`,
      }),
    ) || [];

  return {
    options,
    isLoading,
    isFetching,
    loadTransactionCodes,
    error,
  };
};
