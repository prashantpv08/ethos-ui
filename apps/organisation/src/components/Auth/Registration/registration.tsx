import { Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from '../Auth.module.scss';
import { Heading, Label } from '@ethos-frontend/ui';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { API_METHODS, API_URL, emailRegex } from '@ethos-frontend/constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useJsApiLoader } from '@react-google-maps/api';
import { StepFormOne } from './stepFormOne';
import { StepFormTwo } from './stepFormTwo';
import { PreviewDetail } from './previewDetail';
import { useRestMutation } from '@ethos-frontend/hook';
import { getCurrencySymbol } from '@ethos-frontend/utils';
import { t } from 'i18next';
import i18n from '@ethos-frontend/i18n';

const steps = [
  'auth.companyDetails',
  'auth.companyAddress',
  'auth.reviewAndSubmit',
];

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required(t('errors.requiredField')),
  businessType: Yup.string().required(t('errors.requiredField')),
  restaurantName: Yup.string().required(t('errors.requiredField')),
  registrationNumber: Yup.string().required(t('errors.requiredField')),
  ownerFirstName: Yup.string().required(t('errors.requiredField')),
  ownerLastName: Yup.string().required(t('errors.requiredField')),
  email: Yup.string()
    .required(t('errors.requiredField'))
    .matches(emailRegex, t('errors.invalidEmail')),
  taxNumber: Yup.string().required(t('errors.requiredField')),
  language: Yup.string().required(t('errors.requiredField')),
});

interface IStepFormOne {
  businessName: string;
  businessType: string;
  restaurantName: string;
  registrationNumber: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  taxNumber: string;
  language: string;
}

interface IStepFormTwo {
  address: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  currency: string;
  mobile?: string;
  phone?: string;
}

export interface FinalSubmit extends IStepFormOne, IStepFormTwo {}

const libraries: ['places'] = ['places'];

export const Registration = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Partial<FinalSubmit>>({});
  const [selectBusinessType, setSelectBusinessType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const stepTwoValidationSchema = Yup.object().shape({
    address: Yup.string().required(t('errors.requiredField')),
    zipcode: Yup.string().required(t('errors.requiredField')),
    city: Yup.string().required(t('errors.requiredField')),
    state: Yup.string().required(t('errors.requiredField')),
    country: Yup.string().required(t('errors.requiredField')),
    mobile: !mobile
      ? Yup.string().required(t('errors.requiredField'))
      : Yup.string(),
    phone: !phone
      ? Yup.string().required(t('errors.requiredField'))
      : Yup.string(),
    currency: Yup.string().required(t('errors.requiredField')),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit: stepTwoHandleSubmit,
    control: stepTwoControl,
    setValue,
    formState: { errors: stepTwoErrors },
  } = useForm({
    resolver: yupResolver(stepTwoValidationSchema),
  });

  useLayoutEffect(() => {
    const defaultLanguage = navigator.language;
    i18n.changeLanguage(defaultLanguage);
  }, []);

  const { mutate, isPending } = useRestMutation(
    API_URL.register,
    {method: API_METHODS.POST},
    {
      onSuccess: () => {
        toast.success(<>{t('success.register')}</>, {
          autoClose: false,
        });
        navigate('/auth/login');
      },
      onError: (err) => {
        toast.error(err?.message);
      },
    }
  );

  useEffect(() => {
    if (data.country) {
      setSelectedCountry(data.country);
    }
  }, [data.country]);

  const onSubmit = async (submittedData: IStepFormOne) => {
    setActiveStep((prev) => prev + 1);
    setData((prev) => ({ ...prev, ...submittedData }));
  };

  const onSubmit2 = async (submittedData: IStepFormTwo) => {
    setActiveStep((prev) => prev + 1);
    setData((prev) => ({
      ...prev,
      ...submittedData,
      phone,
      mobile,
      country: selectedCountry, 
    }));
  };

  const handleFinalSubmit = (data: Partial<FinalSubmit>) => {
    const currencySplit = selectedCurrency.split('(');

    const currencySymbol = getCurrencySymbol(selectedCurrency);

    const currencyObj = {
      code: currencySplit[0],
      symbol: currencySymbol,
    };
    const payload = {
      email: data.email,
      orgName: data.businessName,
      country: data.country,
      state: data.state,
      city: data.city,
      businessType: data.businessType,
      ownerFName: data.ownerFirstName,
      ownerLName: data.ownerLastName,
      orgNumber: data.registrationNumber,
      address: data.address,
      zipcode: data.zipcode,
      lang: data.language,
      phone: data.phone,
      homeNumber: data.mobile,
      restaurantName: data.restaurantName,
      taxNumber: data.taxNumber,
      currency: currencyObj,
    };

    mutate(payload);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_PLACES_API || '',
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.address_components || !place.name) return;
    
    const addressComponents = place.address_components;

    let newState = '';
    let newCountry = '';
    let newCity = '';
    let newZipcode = '';

    for (const component of addressComponents) {
      const addressType = component.types[0];
      if (addressType === 'administrative_area_level_1') {
        newState = component.long_name;
      } else if (addressType === 'country') {
        newCountry = component.long_name;
      } else if (addressType === 'locality' || addressType === 'sublocality') {
        newCity = component.long_name;
      } else if (addressType === 'postal_code') {
        newZipcode = component.long_name;
      }
    }
    setValue('address', place.name);
    setValue('state', newState);
    setValue('country', newCountry);
    setValue('city', newCity);
    setValue('zipcode', newZipcode);
  };

  const formProps = {
    control,
    errors,
  };

  return (
    <div className={styles.wrapper}>
      <Stepper
        activeStep={activeStep}
        className={styles.stepper}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>
              <Label variant="subtitle2">{t(label)}</Label>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Heading variant="h3" weight="bold" className="pb-5">
        {t('auth.register')}
      </Heading>
      {activeStep === 0 && (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <StepFormOne
            {...formProps}
            setSelectBusinessType={setSelectBusinessType}
            selectBusinessType={selectBusinessType}
            setSelectedLanguage={setSelectedLanguage}
            selectedLanguage={selectedLanguage}
          />
        </form>
      )}
      {activeStep === 1 && (
        <form noValidate onSubmit={stepTwoHandleSubmit(onSubmit2)}>
          <StepFormTwo
            control={stepTwoControl}
            errors={stepTwoErrors}
            loading={isLoaded}
            ref={autocompleteRef}
            handlePlaceChanged={handlePlaceChanged}
            setActiveStep={setActiveStep}
            setSelectedCurrency={setSelectedCurrency}
            setMobile={setMobile}
            setPhone={setPhone}
            mobile={mobile}
            phone={phone}
            selectedCurrency={selectedCurrency}
            setSelectedCountry={setSelectedCountry}
            selectedCountry={selectedCountry}
          />
        </form>
      )}
      {activeStep === 2 && (
        <PreviewDetail
          setActiveStep={setActiveStep}
          onSubmit={handleFinalSubmit}
          data={data}
          loading={isPending}
        />
      )}
    </div>
  );
};
