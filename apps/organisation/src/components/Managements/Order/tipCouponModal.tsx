import { ControlledInput, GridContainer } from '@ethos-frontend/components';
import { PrimaryButton } from '@ethos-frontend/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { t } from 'i18next';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';
interface ITipCoupon {
  handleClose: () => void;
  handleSubmitForm: (data: any) => void;
  maxDiscount: number;
}

const getTipFormSchema = (maxDiscount: number) => {
  return yup.object().shape({
    customDiscount: yup
      .number()
      .typeError(t(ERROR_MESSAGES.DISCOUNT_MUST_NUMBER))
      .required(t(ERROR_MESSAGES.REQUIRED))
      .max(maxDiscount, `${t(ERROR_MESSAGES.SHOULD_GREATER)} ${maxDiscount}`),
    discountNote: yup.string().optional(),
  });
};

export const TipForm = (props: ITipCoupon) => {
  const { handleClose, handleSubmitForm, maxDiscount } = props;

  const validationSchema = getTipFormSchema(maxDiscount);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) => {
        handleSubmitForm({ ...data });
        reset({});
      })}
    >
      <GridContainer columns={1} className="pb-5">
  
        <ControlledInput
          type="number"
          name="customDiscount"
          label={t('order.discount')}
          control={control}
          errors={errors}
          helperText={errors}
          required
        />
        <ControlledInput
          type="text"
          multiline
          name="discountNote"
          label={t('order.note')}
          control={control}
          rows={2}
          required
        />
      </GridContainer>
      <hr />
      <div className="pt-5 flex justify-end gap-4">
        <PrimaryButton variant="text" onClick={handleClose}>
          {t('cancel')}
        </PrimaryButton>
        <PrimaryButton
          disabled={
            watch('discountNote') && watch('customDiscount') ? false : true
          }
          type="submit"
        >
          {t('add')}
        </PrimaryButton>
      </div>
    </form>
  );
};
