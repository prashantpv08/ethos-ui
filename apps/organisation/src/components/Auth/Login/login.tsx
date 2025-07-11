import styles from '../Auth.module.scss';
import { Heading, Link, Paragraph, PrimaryButton } from '@ethos-frontend/ui';
import { useRestMutation } from '@ethos-frontend/hook';
import {
  API_METHODS,
  API_URL,
  EMPLOYEE_API_URL,
  employeeLoginUrl,
  ERROR_MESSAGES,
  INFO_MESSAGES,
  loginUrl,
} from '@ethos-frontend/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLayoutEffect, useState } from 'react';
import { t } from 'i18next';
import { ForgetPasswordModal } from './forgetPasswordModal';
import i18n from '@ethos-frontend/i18n';
import { LanguageDropdown, LoginForm } from '@ethos-frontend/components';

export const Login = () => {
  const { pathname } = useLocation();
  const loginPage = pathname === '/auth/login';
  const navigate = useNavigate();

  const [forgetPasswordModal, setForgetPasswordModal] = useState(false);

  useLayoutEffect(() => {
    const defaultLanguage = navigator.language;
    i18n.changeLanguage(defaultLanguage);
  }, []);

  const { mutate } = useRestMutation(
    loginPage ? API_URL.login : EMPLOYEE_API_URL.employeeLogin,
    {
      method: API_METHODS.POST,
    },
    {
      onSuccess: (res) => {
        const data = res.data;

        const accessToken = data?.accessToken;
        const refreshToken = data?.refeshToken;

        if (accessToken) {
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/');
        toast.success(t('success.login'));
      },
      onError: (err) => {
        const errorMessage =
          (err?.response?.data as Record<string, string>)?.message ||
          'An error occurred';
        switch (errorMessage) {
          case 'Account approval pending':
            toast.info(t(INFO_MESSAGES.ACCCOUNT_APPROVAL_PENDING));
            break;
          case 'Forbidden':
            toast.error(t(INFO_MESSAGES.ACCESS_DENIED));
            break;
          case 'Invalid password':
            toast.error(t(ERROR_MESSAGES.INVALID_PASSWORD));
            break;
          case 'Email not found':
            toast.error(t(ERROR_MESSAGES.EMAIL_NOT_FOUND));
            break;
          default:
            toast.error(t(ERROR_MESSAGES.GENERAL));
        }
      },
    },
  );

  const onSubmit = (data: Record<string, unknown>) => {
    mutate(data);
  };

  return (
    <div className={styles.login}>
      <div className="flex justify-end pb-4">
        <LanguageDropdown />
      </div>
      <Heading variant="h3" weight="bold">
        {loginPage ? t('auth.signInTitle') : t('auth.employeeLogin')}
      </Heading>

      {loginPage ? (
        <Paragraph variant="subtitle1" className="pt-4">
          {t('auth.newUser')}{' '}
          <Link to="/auth/signup">{t('auth.register')}</Link>
        </Paragraph>
      ) : null}

      <LoginForm onSubmit={onSubmit} orderStatus={!loginPage} />
      <div className="flex justify-center">
        <PrimaryButton
          variant="text"
          onClick={() => setForgetPasswordModal(true)}
        >
          {t('auth.forgotPassword')}
        </PrimaryButton>
      </div>

      <div className="pt-4">
        <Paragraph variant="subtitle1">
          {t('auth.clickHereFor')}{' '}
          <Link to={loginPage ? employeeLoginUrl : loginUrl}>
            {loginPage ? t('auth.employeeLogin') : t('auth.adminLogin')}
          </Link>
        </Paragraph>
      </div>
      <ForgetPasswordModal
        forgetPasswordModal={forgetPasswordModal}
        setForgetPasswordModal={setForgetPasswordModal}
        loginPage={loginPage}
      />
    </div>
  );
};
