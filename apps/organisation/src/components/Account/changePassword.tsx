import { Heading, PrimaryButton } from '@ethos-frontend/ui';
import styles from './account.module.scss';
import {
  FormFieldProps,
  FormFields,
  GridContainer,
} from '@ethos-frontend/components';
import { useForm } from 'react-hook-form';
import {
  API_METHODS,
  API_URL,
  EMPLOYEE_API_URL,
  ERROR_MESSAGES,
  ROLES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { useRestMutation } from '@ethos-frontend/hook';
import { useUser } from '../../context/user';
import { useEffect } from 'react';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(8, t(ERROR_MESSAGES.CHARACTER_LIMIT))
    .matches(/[a-z]/, t(ERROR_MESSAGES.LOWERCASE))
    .matches(/[A-Z]/, t(ERROR_MESSAGES.UPPERCASE))
    .matches(/[0-9]/, t(ERROR_MESSAGES.ONE_NUMBER))
    .matches(
      /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~+`]/,
      t(ERROR_MESSAGES.SPECIAL_CHARACTER),
    ),
  newPassword: Yup.string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(8, t(ERROR_MESSAGES.CHARACTER_LIMIT))
    .matches(/[a-z]/, t(ERROR_MESSAGES.LOWERCASE))
    .matches(/[A-Z]/, t(ERROR_MESSAGES.UPPERCASE))
    .matches(/[0-9]/, t(ERROR_MESSAGES.ONE_NUMBER))
    .matches(
      /[\^$*.[\]{}()?\-"!@#%&/,><':;|_~+`]/,
      t(ERROR_MESSAGES.SPECIAL_CHARACTER),
    ),
  confirmPassword: Yup.string()
    .required(ERROR_MESSAGES.REQUIRED)
    .oneOf([Yup.ref('newPassword'), ''], t(ERROR_MESSAGES.PASSWORD_MATCH)),
});

export const ChangePassword = () => {
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useResponsive();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(validationSchema), mode: 'onChange' });
  const { userData, setUserData } = useUser();

  const { mutateAsync } = useRestMutation(
    userData?.role === ROLES.EMPLOYEE?
      EMPLOYEE_API_URL.employeeUpdatePassword: API_URL.updatePassword, {
    method: API_METHODS.PATCH,
  });

  const handleSubmitForm = (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    mutateAsync({
      data: {
        oldPassword: data.currentPassword,
        password: data.newPassword,
      },
    })
      .then(() => {
        reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success(t(SUCCESS_MESSAGES.PASSWORD_UPDATE));
      })
      .catch(() => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      });
  };

  useEffect(() => {
      setUserData({
        ...userData
      });
  }, []);

  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      inputType: 'password',
      name: 'currentPassword',
      label: t('account.profileTab.currentPassword'),
      required: true,
    },
    {
      type: 'input',
      inputType: 'password',
      name: 'newPassword',
      label: t('account.profileTab.newPassword'),
      required: true,
    },
    {
      type: 'input',
      inputType: 'password',
      name: 'confirmPassword',
      label: t('account.profileTab.confirmPassword'),
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
      <Heading
        variant="h4"
        weight="semibold"
        className={`pb-4 !mb-4 ${styles.headingBorder}`}
      >
        {t('account.profileTab.changePassword')}
      </Heading>
      <GridContainer
        columns={getNumberOfCols({
          isMobile,
          isDesktop,
          desktopCol: 3,
          mobileCol: 1,
        })}
      >
        <FormFields fields={fields} control={control} errors={errors} />
      </GridContainer>
      <div className="pt-6">
        <PrimaryButton type="submit" disabled={!isValid}>
          {t('account.profileTab.updatePassword')}
        </PrimaryButton>
      </div>
    </form>
  );
};
