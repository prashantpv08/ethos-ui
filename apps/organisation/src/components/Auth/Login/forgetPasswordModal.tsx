import {
  API_METHODS,
  API_URL,
  EMPLOYEE_API_URL,
  ERROR_MESSAGES,
} from '@ethos-frontend/constants';
import { useRestMutation } from '@ethos-frontend/hook';
import { Heading, Modal, PrimaryButton } from '@ethos-frontend/ui';
import { useForm } from 'react-hook-form';
import { t } from 'i18next';
import * as Yup from 'yup';
import { ControlledInput } from '@ethos-frontend/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

interface IForgetPassword {
  forgetPasswordModal: boolean;
  setForgetPasswordModal: (value: boolean) => void;
  loginPage: boolean;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required(t('errors.requiredField')),
});

export const ForgetPasswordModal = ({
  forgetPasswordModal,
  setForgetPasswordModal,
  loginPage,
}: IForgetPassword) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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
        reset({ email: '' });
      }}
      title="Forget Password"
    >
      <>
        <Heading className="pb-4" variant="h5">
          {loginPage
            ? t('auth.forgetPassword')
            : t('auth.employeeForgetPassword')}
        </Heading>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <ControlledInput
            fullWidth
            control={control}
            name={'email'}
            type={loginPage ? 'email' : 'text'}
            label={loginPage ? t('auth.email') : t('auth.username')}
            errors={errors}
            helperText={errors}
          />
          <div className="ml-auto">
            <PrimaryButton type="submit">{t('auth.sendEmail')}</PrimaryButton>
          </div>
        </form>
      </>
    </Modal>
  );
};
