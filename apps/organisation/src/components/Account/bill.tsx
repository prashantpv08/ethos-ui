import { useEffect } from 'react';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import {
  Card,
  ControlledInput,
  GridContainer,
} from '@ethos-frontend/components';
import { useForm } from 'react-hook-form';
import { PrimaryButton } from '@ethos-frontend/ui';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
} from '@ethos-frontend/constants';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useUser } from '../../context/user';
import { useTranslation } from 'react-i18next';

type BillFormData = {
  billNo: string;
  note1: string;
  note2: string;
};

const validationSchema = Yup.object().shape({
  billNo: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  note1: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  note2: Yup.string().required(ERROR_MESSAGES.REQUIRED),
});

export const Bill = () => {
  const { userData } = useUser();
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useResponsive();
  const { data, refetch } = useRestQuery('fetch-bill-data', API_URL.bill, {
    enabled: Boolean(userData),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { mutate, isPending } = useRestMutation(
    API_URL.bill,
    {
      method: API_METHODS.PATCH,
    },
    {
      onSuccess: () => {
        toast.success('Bill Details updated!');
        refetch();
      },
    },
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BillFormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      reset(data.data.data);
    }
  }, [data]);

  const onSubmit = (formData: BillFormData) => {
    mutate(formData);
  };

  return (
    <div>
      <Card title={t('account.preferenceTab.billDetails')}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GridContainer columns={12}>
            <div
              data-item
              data-span={getNumberOfCols({
                isDesktop,
                isMobile,
                desktopCol: 6,
                mobileCol: 12,
              })}
            >
              <ControlledInput
                name="billNo"
                control={control}
                label={t('account.preferenceTab.billNumber')}
                type="text"
                required
                fullWidth
                errors={errors}
                helperText={errors}
              />
            </div>
            <div
              data-item
              data-span={getNumberOfCols({
                isDesktop,
                isMobile,
                desktopCol: 12,
                mobileCol: 12,
              })}
              className="flex flex-wrap sm:flex-wrap md:flex-nowrap gap-5 pb-5"
            >
              <ControlledInput
                name="note1"
                rows={4}
                multiline
                fullWidth
                control={control}
                type="texta"
                label={t('account.preferenceTab.noteOne')}
                required
                errors={errors}
                helperText={errors}
              />
              <ControlledInput
                name="note2"
                rows={4}
                multiline
                fullWidth
                control={control}
                type="text"
                label={t('account.preferenceTab.noteTwo')}
                required
                errors={errors}
                helperText={errors}
              />
            </div>
          </GridContainer>
          <div className="flex justify-end">
            <PrimaryButton
              loading={isPending}
              disabled={!isDirty}
              type="submit"
            >
              {t('account.preferenceTab.saveBillDetails')}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </div>
  );
};
