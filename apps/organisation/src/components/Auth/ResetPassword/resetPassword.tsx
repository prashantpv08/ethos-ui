import { Heading, Paragraph } from '@ethos-frontend/ui';
import { ResetPasswordForm } from '@ethos-frontend/components';
import { t } from 'i18next';
import styles from '../Auth.module.scss';
import { useLayoutEffect, useState } from 'react';
import { useRestMutation } from '@ethos-frontend/hook';
import { API_METHODS, API_URL, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@ethos-frontend/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  const [tokenInvalid, setTokenInvalid] = useState(false);


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
      <ResetPasswordForm onSubmit={onSubmit} />
    </div>
  );
};
