import React from 'react';
import { Checkbox } from '@ethos-frontend/ui';
import styles from './receiveConfirmation.module.scss';

interface CheckboxGroupProps {
  selectedValues: { label: string; value: string }[];
  options: { label: string; value: string }[];
  onGroupChange: (selectedValues: { label: string; value: string }[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  selectedValues,
  options,
  onGroupChange,
}) => (
  <div className={styles['toppings-list-item']}>
    <Checkbox
      variant="custom"
      selectedValues={selectedValues}
      onGroupChange={onGroupChange}
      options={options}
    />
  </div>
);
