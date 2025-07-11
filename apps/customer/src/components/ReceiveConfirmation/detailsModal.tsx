import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, Label, Modal, PrimaryButton } from '@ethos-frontend/ui';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ControlledInput,
  PhoneInputWithCountry,
} from '@ethos-frontend/components';
import { emailRegex, ERROR_MESSAGES } from '@ethos-frontend/constants';
import { useTranslation } from 'react-i18next';

interface DetailsModalProps {
  open: boolean;
  handleClose: () => void;
  selectedOptions: string[];
  email: string;
  sms: string;
  whatsapp: string;
  setEmail: (value: string) => void;
  setSms: (value: string) => void;
  setWhatsapp: (value: string) => void;
  onSubmit: () => void;
  isSmsValid: boolean;
  isWhatsappValid: boolean;
  setIsSmsValid: (value: boolean) => void;
  setIsWhatsappValid: (value: boolean) => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  open,
  handleClose,
  selectedOptions,
  email,
  sms,
  whatsapp,
  setEmail,
  setSms,
  setWhatsapp,
  onSubmit,
  isSmsValid,
  isWhatsappValid,
  setIsSmsValid,
  setIsWhatsappValid,
}) => {
  const { t } = useTranslation();
  const [isWhatsappSameAsSms, setIsWhatsappSameAsSms] = useState(false);

  const validationSchema = yup.object().shape({
    email:
      selectedOptions.includes('email') && !email
        ? yup
            .string()
            .required(t('errors.requiredField'))
            .matches(emailRegex, ERROR_MESSAGES.EMAIL)
        : yup.string().matches(emailRegex, t('errors.invalidEmail')),
    sms:
      selectedOptions.includes('sms') && !sms
        ? yup.string().required(t('errors.requiredField'))
        : yup.string(),

    whatsapp:
      selectedOptions.includes('whatsapp') && !whatsapp
        ? yup.string().required(t('errors.requiredField'))
        : yup.string(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (email) setValue('email', email);
    if (sms) setValue('sms', sms);
    if (whatsapp) setValue('whatsapp', whatsapp);
  }, [setValue, email, sms, whatsapp]);

  useEffect(() => {
    if (sms && whatsapp && sms === whatsapp) {
      setIsWhatsappSameAsSms(true);
    } else {
      setIsWhatsappSameAsSms(false);
    }
  }, [sms, whatsapp]);

  const handlePhoneChange = (name: string, value: string, isValid: boolean) => {
    if (name === 'sms') {
      setSms(value);
      setIsSmsValid(isValid);
      if (isWhatsappSameAsSms) {
        setWhatsapp(value);
        setIsWhatsappValid(isValid);
      }
    } else if (name === 'whatsapp') {
      setWhatsapp(value);
      setIsWhatsappValid(isValid);
    }
  };

  const onSubmitHandler = (data: {
    email?: string;
    isSmsValid?: boolean;
    isWhatsappValid?: boolean;
  }) => {
    if (selectedOptions.includes('email') && !data.email) {
      return;
    }

    if (selectedOptions.includes('sms') && !isSmsValid) {
      return;
    }
    if (
      selectedOptions.includes('whatsapp') &&
      !isWhatsappValid &&
      !isWhatsappSameAsSms
    ) {
      return;
    }
    onSubmit();
  };

  const showCheckbox =
    selectedOptions.includes('sms') && selectedOptions.includes('whatsapp');

  return (
    <Modal open={open} onClose={handleClose} title={t('customer.enterContactDetails')}>
      <>
        <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
          <div className="flex flex-col gap-4">
            {selectedOptions.includes('email') && (
              <ControlledInput
                name="email"
                type="email"
                control={control}
                fullWidth
                label={t('emailAddress')}
                errors={errors}
                helperText={errors}
                onChange={(e) => {
                  setEmail(e);
                }}
              />
            )}
            {selectedOptions.includes('sms') && (
              <PhoneInputWithCountry
                value={sms}
                name="sms"
                control={control}
                onChange={(value, isValid) =>
                  handlePhoneChange('sms', value, isValid)
                }
                placeholder={t('sms')}
                error={!!errors.sms}
                helperText={errors.sms?.message as string}
              />
            )}
            {showCheckbox && (
              <>
                <Checkbox
                  variant="single"
                  label={t('customer.whatsappSameSms')}
                  checked={isWhatsappSameAsSms}
                  onChange={(e) => {
                    setIsWhatsappSameAsSms(e.target.checked);
                    if (e.target.checked) {
                      setWhatsapp(sms);
                      setIsWhatsappValid(isSmsValid);
                    }
                  }}
                />
              </>
            )}
            {selectedOptions.includes('whatsapp') && !isWhatsappSameAsSms && (
              <PhoneInputWithCountry
                value={whatsapp}
                name="whatsapp"
                control={control}
                onChange={(value, isValid) =>
                  handlePhoneChange('whatsapp', value, isValid)
                }
                placeholder={t('whatsapp')}
                error={!!errors.whatsapp}
                helperText={errors.whatsapp?.message as string}
              />
            )}
          </div>
          {selectedOptions.includes('whatsapp') ||
          selectedOptions.includes('sms') ? (
            <Label variant="subtitle2" className="block pt-2">
              {t('customer.doNotIncludeZero')}
            </Label>
          ) : null}
          <Label variant="subtitle2" className="block py-2">
            {t('customer.orderUpdatesDeliver')}
          </Label>
          <PrimaryButton className="mt-5" type="submit">
            {t('submit')}
          </PrimaryButton>
        </form>
      </>
    </Modal>
  );
};
