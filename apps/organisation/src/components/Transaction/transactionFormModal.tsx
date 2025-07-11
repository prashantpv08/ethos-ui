import { useEffect } from 'react';
import { Modal, PrimaryButton } from '@ethos-frontend/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ControlledInput,
  ControlledDropdown,
  GridContainer,
} from '@ethos-frontend/components';
import * as Yup from 'yup';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';
import { TransactionRecord } from './transaction';
import { t } from 'i18next';

export type TransactionFormData = Omit<TransactionRecord, 'id'>;

interface OptionType {
  label: string;
  value: string;
}

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
  transactionStatusOptions: OptionType[];
  title: string;
  isAddSuccess: boolean;
}

const schema = Yup.object().shape({
  name: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  description: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  transaction_status: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
});

export const TransactionFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  transactionStatusOptions,
  title,
  isAddSuccess
}: TransactionFormModalProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  useEffect(() => {
    reset({});
  }, [isAddSuccess]);

  return (
    <Modal size="md" open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <GridContainer columns={1}>
          <ControlledInput
            name="name"
            control={control}
            label={t('tableData.name')}
            errors={errors}
            helperText={errors}
            type="text"
            fullWidth
          />

          <ControlledInput
            name="code"
            control={control}
            label={t('tableData.code')}
            errors={errors}
            helperText={errors}
            type="text"
            fullWidth
          />

          <ControlledInput
            name="description"
            control={control}
            label={t('tableData.description')}
            errors={errors}
            helperText={errors}
            type="text"
            fullWidth
          />
          <ControlledDropdown
            name="transaction_status"
            control={control}
            placeholder={t('selectType')}
            options={transactionStatusOptions}
            errors={errors}
            helperText={errors}
            fullWidth
            value={initialData?.transaction_status as string}
            searchDisable
          />
          <div className="ml-auto">
            <PrimaryButton type="submit">{t('submit')}</PrimaryButton>
          </div>
        </GridContainer>
      </form>
    </Modal>
  );
};
