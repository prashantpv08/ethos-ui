import { API_METHODS, ORDER_SCREEN_API_URL } from '@ethos-frontend/constants';
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
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required(t('errors.requiredField')),
});

export const ForgetPasswordModal = ({
  forgetPasswordModal,
  setForgetPasswordModal,
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
        reset({ email: '' });
      }}
      title="Forget Password"
    >
      <>
        <Heading className="pb-4" variant="h5">
          {t('auth.employeeForgetPassword')}
        </Heading>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <ControlledInput
            fullWidth
            control={control}
            name="email"
            type="text"
            label={t('auth.username')}
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
