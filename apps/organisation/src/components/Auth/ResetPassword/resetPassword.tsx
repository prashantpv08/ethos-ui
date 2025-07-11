import { ControlledInput } from '@ethos-frontend/components';
import { Heading, Paragraph, PrimaryButton } from '@ethos-frontend/ui';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import styles from '../Auth.module.scss';
import { useLayoutEffect, useState } from 'react';
import { useRestMutation } from '@ethos-frontend/hook';
import { API_METHODS, API_URL, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@ethos-frontend/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
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
  confirmPassword: Yup.string()
    .required(t('errors.requiredField'))
    .oneOf([Yup.ref('password'), ''], t('errors.passwordMatch')),
});

export const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  const [tokenInvalid, setTokenInvalid] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { mutateAsync } = useRestMutation(API_URL.validateToken, {
    method: API_METHODS.POST,
  });

  const { mutateAsync: resetPasswordMutation } = useRestMutation(
    API_URL.resetPassword,
    {
      method: API_METHODS.POST,
    }
  );

  useLayoutEffect(() => {
    mutateAsync({ token })
      .then(() => setTokenInvalid(false))
      .catch(() => setTokenInvalid(true));
  }, [mutateAsync, token]);

  const onSubmit = (data: Record<string, string>) => {
    const body = {
      token,
      password: data.password,
    };
    resetPasswordMutation(body)
      .then(() => {
        toast.success(t(SUCCESS_MESSAGES.RESET_PASSWORD));
        setTimeout(() => {
          navigate('/');
        });
      })
      .catch(() => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      });
  };

  if (tokenInvalid) {
    return (
      <div className={styles.login}>
        <Heading variant="h4" weight="semibold" color="red" className="pb-4">
          {t('auth.invalidLink')}
        </Heading>
        <Paragraph variant="h5" color="red">
          {t('auth.linkExpired')}
        </Paragraph>
      </div>
    );
  }

  return (
    <div className={styles.login}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <ControlledInput
          control={control}
          name="password"
          label={t('auth.password')}
          fullWidth
          type="Password"
          errors={errors}
          helperText={errors}
          required
        />
        <ControlledInput
          type="password"
          name="confirmPassword"
          label={t('auth.confirmPassword')}
          control={control}
          required
          fullWidth
          errors={errors}
          helperText={errors}
        />
        <PrimaryButton type="submit" fullWidth disabled={!isValid}>
          {t('auth.resetPassword')}
        </PrimaryButton>
      </form>
    </div>
  );
};
