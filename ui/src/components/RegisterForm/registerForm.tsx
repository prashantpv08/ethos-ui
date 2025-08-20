import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { PrimaryButton } from '../../lib/primaryButton';
import { FormFieldProps, FormFields } from '../FormFields';

interface IRegisterForm {
  onSubmit: (data: Record<string, string>) => void;
}

const getValidationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required(t('errors.requiredField')),
    email: Yup.string()
      .required(t('errors.requiredField'))
      .email(t('errors.invalidEmail')),
    password: Yup.string()
      .required(t('errors.requiredField'))
      .min(8, t('errors.passwordErrors.characterLimit'))
      .matches(/[a-z]/, t('errors.passwordErrors.lowerCase'))
      .matches(/[A-Z]/, t('errors.passwordErrors.upperCase'))
      .matches(/[0-9]/, t('errors.passwordErrors.oneNumber'))
      .matches(/[\^$*.[\]{}()?\-"!@#%&/,><':;|_~+`]/, t('errors.passwordErrors.specialCharacter')),
    confirmPassword: Yup.string()
      .required(t('errors.requiredField'))
      .oneOf([Yup.ref('password'), ''], t('errors.passwordMatch')),
  });

export const RegisterForm = ({ onSubmit }: IRegisterForm) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
  });

  const fields: FormFieldProps['fields'] = [
    { type: 'input', name: 'username', label: t('auth.username') },
    { type: 'input', name: 'email', label: t('auth.email'), inputType: 'email' },
    { type: 'input', name: 'password', label: t('auth.password'), inputType: 'password' },
    { type: 'input', name: 'confirmPassword', label: t('auth.confirmPassword'), inputType: 'password' },
  ];

  return (
    <form className="py-6 grid gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormFields fields={fields} errors={errors} control={control} />
      <PrimaryButton fullWidth type="submit">
        {t('auth.register')}
      </PrimaryButton>
    </form>
  );
};
