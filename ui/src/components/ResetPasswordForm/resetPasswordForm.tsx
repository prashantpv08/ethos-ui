import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { PrimaryButton } from '../../lib/primaryButton';
import { FormFieldProps, FormFields } from '../FormFields';

interface IResetPasswordForm {
  onSubmit: (data: Record<string, string>) => void;
}

const getValidationSchema = () =>
  Yup.object().shape({
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

export const ResetPasswordForm = ({ onSubmit }: IResetPasswordForm) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
    mode: 'onChange',
  });

  const fields: FormFieldProps['fields'] = [
    { type: 'input', name: 'password', label: t('auth.password'), inputType: 'password' },
    { type: 'input', name: 'confirmPassword', label: t('auth.confirmPassword'), inputType: 'password' },
  ];

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormFields fields={fields} errors={errors} control={control} />
      <PrimaryButton type="submit" fullWidth disabled={!isValid}>
        {t('auth.resetPassword')}
      </PrimaryButton>
    </form>
  );
};
