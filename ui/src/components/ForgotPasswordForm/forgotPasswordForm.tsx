import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { PrimaryButton } from '../../lib/primaryButton';
import { FormFieldProps, FormFields } from '../FormFields';

interface IForgotPasswordForm {
  onSubmit: (data: Record<string, string>) => void;
  orderStatus?: boolean;
}

const getValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .email(t('errors.invalidEmail'))
      .when('$orderStatus', {
        is: false,
        then: (schema) => schema.required(t('errors.requiredField')),
      }),
    username: Yup.string().when('$orderStatus', {
      is: true,
      then: (schema) => schema.required(t('errors.requiredField')),
    }),
  });

export const ForgotPasswordForm = ({ onSubmit, orderStatus = false }: IForgotPasswordForm) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
    context: { orderStatus },
  });

  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      name: orderStatus ? 'username' : 'email',
      inputType: orderStatus ? 'text' : 'email',
      label: orderStatus ? t('auth.username') : t('auth.email'),
    },
  ];

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormFields fields={fields} errors={errors} control={control} />
      <div className="ml-auto">
        <PrimaryButton type="submit">{t('auth.sendEmail')}</PrimaryButton>
      </div>
    </form>
  );
};
