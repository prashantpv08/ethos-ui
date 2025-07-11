import { useRestQuery } from '@ethos-frontend/hook';
import { API_URL } from '@ethos-frontend/constants';

export const useProductDropdown = () => {
  return useRestQuery('productDropdown', API_URL.productsList, {
    enabled: false,
  });
};