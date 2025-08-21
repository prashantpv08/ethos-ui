import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { PrimaryButton } from '../../lib/primaryButton';
import { FormFieldProps, FormFields } from '../FormFields';

interface ILoginForm {
  onSubmit: (data: Record<string, string>) => void;
  orderStatus?: boolean;
  loading?: boolean;
}

const getValidationSchema = () => {
  return Yup.object().shape({
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
    password: Yup.string()
      .required(t('errors.requiredField'))
      .min(8, t('errors.passwordErrors.characterLimit'))
      .matches(/[a-z]/, t('errors.passwordErrors.lowerCase'))
      .matches(/[A-Z]/, t('errors.passwordErrors.upperCase'))
      .matches(/[0-9]/, t('errors.passwordErrors.oneNumber'))
      .matches(
        /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~+`]/,
        t('errors.passwordErrors.specialCharacter')
      ),
  });
};

export const LoginForm = ({ onSubmit, orderStatus = false, loading }: ILoginForm) => {
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
      inputType: orderStatus ? 'text' : 'email',
      name: orderStatus ? 'username' : 'email',
      label: orderStatus ? t('auth.username') : t('auth.email'),
    },
    {
      type: 'input',
      name: 'password',
      inputType: 'password',
      label: t('auth.password'),
    },
  ];

  return (
    <form
      className="py-6 grid gap-5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormFields fields={fields} errors={errors} control={control} />

      <PrimaryButton fullWidth type="submit" loading={loading}>
        {t('auth.signIn')}
      </PrimaryButton>
    </form>
  );
};
