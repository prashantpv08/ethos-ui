import { API_METHODS, ORDER_SCREEN_API_URL } from '@ethos-frontend/constants';
import { useRestMutation } from '@ethos-frontend/hook';
import { Heading, Modal } from '@ethos-frontend/ui';
import { t } from 'i18next';
import { ForgotPasswordForm } from '@ethos-frontend/components';
import { toast } from 'react-toastify';

interface IForgetPassword {
  forgetPasswordModal: boolean;
  setForgetPasswordModal: (value: boolean) => void;
}

export const ForgetPasswordModal = ({
  forgetPasswordModal,
  setForgetPasswordModal,
}: IForgetPassword) => {

  const { mutateAsync } = useRestMutation(
    ORDER_SCREEN_API_URL.sendForgotPasswordEmail,
    {
      method: API_METHODS.PUT,
    },
  );

  const onSubmit = (data: Record<string, string>) => {
    mutateAsync(data)
      .then(() => {
        setForgetPasswordModal(false);
        toast.success(t('info.customerScreenResetPassword'));
      })
      .catch((err) => {
        setForgetPasswordModal(true);
        if (err.response.data.message === 'Record not found!') {
          toast.error(t('errors.emailNotFound'));
        } else {
          toast.error(t('errors.general'));
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
          {t('auth.employeeForgetPassword')}
        </Heading>
        <ForgotPasswordForm onSubmit={onSubmit} orderStatus={true} />
      </>
    </Modal>
  );
};
