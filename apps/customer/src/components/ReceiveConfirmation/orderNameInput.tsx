import React from 'react';
import { TextField } from '@ethos-frontend/ui';
import { useTranslation } from 'react-i18next';

interface OrderNameInputProps {
  orderName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrderNameInput: React.FC<OrderNameInputProps> = ({
  orderName,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="toppings-list-item">
      <TextField
        fullWidth
        placeholder={t('customer.orderName')}
        value={orderName}
        onChange={onChange}
      />
    </div>
  );
};
