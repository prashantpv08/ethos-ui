import React, { useEffect, useState } from 'react';
import styles from './receiveConfirmation.module.scss';
import { Heading, Iconbutton, Label, PrimaryButton } from '@ethos-frontend/ui';
import { useRouter } from 'next/router';
import { setStorage, getStorage } from '@ethos-frontend/utils';
import { OrderNameInput } from './orderNameInput';
import { CheckboxGroup } from './checkboxGroup';
import { DetailsModal } from './detailsModal';
import { useTranslation } from 'react-i18next';
import { getToppingsOptions } from '@ethos-frontend/constants';

export const ReceiveConfirmation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const getToppings = getToppingsOptions();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [checkboxOptions, setCheckboxOptions] = useState(getToppings);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const [orderName, setOrderName] = useState('');
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [restaurantType, setRestaurantType] = useState('');
  const [isSmsValid, setIsSmsValid] = useState(false);
  const [isWhatsappValid, setIsWhatsappValid] = useState(false);

  useEffect(() => {
    setIsContinueDisabled(selectedOptions.length === 0);
  }, [selectedOptions]);

  useEffect(() => {
    const storedSelectedOptions = JSON.parse(
      getStorage('selectedOptions') || '[]',
    );
    const storedEmail = getStorage('email') || '';
    const storedSms = getStorage('sms') || '';
    const storedWhatsapp = getStorage('whatsapp') || '';
    const storedOrderName = getStorage('orderName') || '';
    const { restaurantType } = JSON.parse(getStorage('restaurantData') || '{}');
    setRestaurantType(restaurantType);

    setSelectedOptions(
      Array.isArray(storedSelectedOptions) ? storedSelectedOptions : [],
    );
    setEmail(storedEmail);
    setSms(storedSms);
    setWhatsapp(storedWhatsapp);
    setOrderName(storedOrderName);
    setIsWhatsappValid(storedWhatsapp ? true : false);
    setIsSmsValid(storedSms ? true : false);

    const newCheckboxOptions = getToppings.map((option) => {
      switch (option.value) {
        case 'email':
          return {
            ...option,
            label: storedEmail || t('email'),
            icon: <Iconbutton name="email" />,
          };
        case 'sms':
          return {
            ...option,
            label: storedSms ? `*** *** ${storedSms.slice(-4)}` : t('sms'),
            icon: <Iconbutton name="sms" />,
          };
        case 'whatsapp':
          return {
            ...option,
            label: storedWhatsapp
              ? `*** *** ${storedWhatsapp.slice(-4)}`
              : t('whatsapp'),
            icon: <Iconbutton name="message" />,
          };
        default:
          return option;
      }
    });

    setCheckboxOptions(newCheckboxOptions);
  }, []);

  const handleCheckboxChange = (
    selectedValues: { label: string; value: string }[],
  ) => {
    const values = selectedValues.map((option) => option.value);

    if (values.includes('not')) {
      setSelectedOptions(['not']);
      setStorage('selectedOptions', JSON.stringify(['not']));
      setOpen(false);
    } else {
      setSelectedOptions(values);
      setStorage('selectedOptions', JSON.stringify(values));
      setOpen(false);
    }
  };

  const onSubmit = () => {
    if (selectedOptions.includes('email') && email) setStorage('email', email);

    if (selectedOptions.includes('sms') && sms && isSmsValid)
      setStorage('sms', sms);

    if (selectedOptions.includes('whatsapp') && whatsapp && isWhatsappValid)
      setStorage('whatsapp', whatsapp);

    const newCheckboxOptions = getToppings.map((option) => {
      switch (option.value) {
        case 'email':
          return { ...option, label: email || t('email') };
        case 'sms':
          return {
            ...option,
            label: sms ? `*** *** ${sms.slice(-4)}` : t('sms'),
          };
        case 'whatsapp':
          return {
            ...option,
            label: whatsapp ? `*** *** ${whatsapp.slice(-4)}` : t('whatsapp'),
          };
        default:
          return option;
      }
    });

    setCheckboxOptions(newCheckboxOptions);
    handleClose();
    router.push('/checkout');
  };

  const handleContinueClick = () => {
    if (orderName) setStorage('orderName', orderName);
    if (
      selectedOptions.includes('email') ||
      selectedOptions.includes('sms') ||
      selectedOptions.includes('whatsapp')
    ) {
      handleOpen();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <>
      <div className="pageHolder">
        <div className="pb-4">
          <Heading className="pb-1" variant="h5" weight="semibold">
            {t('customer.receiveConfirmation')}
          </Heading>
          <Label className="pb-4 block" variant="subtitle2">
            {t('customer.orderStatusUpdates')}
          </Label>
          <CheckboxGroup
            selectedValues={selectedOptions.map((value) => ({
              label:
                checkboxOptions.find((option) => option.value === value)
                  ?.label || '',
              value,
            }))}
            options={checkboxOptions}
            onGroupChange={handleCheckboxChange}
          />
        </div>

        <div className="pt-4">
          <Heading className="pb-4" variant="h5" weight="semibold">
            {t('customer.identifyOrder')}
          </Heading>
          <OrderNameInput
            orderName={orderName}
            onChange={(e) => setOrderName(e.target.value)}
          />
        </div>

        <div className="sticky-footer-container">
          <PrimaryButton
            className={styles.continueBtn}
            disabled={isContinueDisabled}
            onClick={handleContinueClick}
            fullWidth
          >
            {t('continue')}
          </PrimaryButton>
        </div>
      </div>
      <DetailsModal
        open={open}
        handleClose={handleClose}
        selectedOptions={selectedOptions}
        email={email}
        sms={sms}
        whatsapp={whatsapp}
        setEmail={setEmail}
        setSms={setSms}
        setWhatsapp={setWhatsapp}
        onSubmit={onSubmit}
        isSmsValid={isSmsValid}
        isWhatsappValid={isWhatsappValid}
        setIsSmsValid={setIsSmsValid}
        setIsWhatsappValid={setIsWhatsappValid}
      />
    </>
  );
};
