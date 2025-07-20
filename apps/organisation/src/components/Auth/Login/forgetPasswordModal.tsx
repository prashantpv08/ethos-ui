import {
  API_METHODS,
  API_URL,
  EMPLOYEE_API_URL,
  ERROR_MESSAGES,
} from '@ethos-frontend/constants';
import { useRestMutation } from '@ethos-frontend/hook';
import { Heading, Modal } from '@ethos-frontend/ui';
import { t } from 'i18next';
import { ForgotPasswordForm } from '@ethos-frontend/components';
import { toast } from 'react-toastify';

interface IForgetPassword {
  forgetPasswordModal: boolean;
  setForgetPasswordModal: (value: boolean) => void;
  loginPage: boolean;
}

export const ForgetPasswordModal = ({
  forgetPasswordModal,
  setForgetPasswordModal,
  loginPage,
}: IForgetPassword) => {

  const { mutateAsync } = useRestMutation(
    loginPage
      ? API_URL.forgetPassword
      : EMPLOYEE_API_URL.employeeForgetPassword,
    {
      method: API_METHODS.POST,
    },
  );

  const onSubmit = (data: Record<string, string>) => {
    mutateAsync(data)
      .then(() => {
        setForgetPasswordModal(false);
        loginPage
          ? toast.success(t('success.resetLinkGenerated'))
          : toast.success(t('success.employeeResetPassword'));
      })
      .catch((err) => {
        setForgetPasswordModal(true);
        if (err.response.data.message === 'Record not found!') {
          toast.error(t(ERROR_MESSAGES.EMAIL_NOT_FOUND));
        } else {
          toast.error(t(ERROR_MESSAGES.GENERAL));
        }
      });
  };

  return (
    <Modal
      size="md"
      open={forgetPasswordModal}
      onClose={() => {
        setForgetPasswordModal(false);
      }}
      title="Forget Password"
    >
      <>
        <Heading className="pb-4" variant="h5">
          {loginPage
            ? t('auth.forgetPassword')
            : t('auth.employeeForgetPassword')}
        </Heading>
        <ForgotPasswordForm onSubmit={onSubmit} orderStatus={!loginPage} />
      </>
    </Modal>
  );
};
