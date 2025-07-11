import {
  FormFields,
  GridContainer,
  FormFieldProps,
} from '@ethos-frontend/components';
import { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { Iconbutton, PrimaryButton } from '@ethos-frontend/ui';
import {
  MutableRefObject,
  forwardRef,
  ForwardedRef,
  useState,
  JSX,
} from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { Currency } from '../../../commonUtils/CommonUtils';
import { useTranslation } from 'react-i18next';
import { countryOptions } from '@ethos-frontend/constants';
import { AddressAutocomplete } from '../../AddressAutocomplete';
interface IStepForm2<T extends FieldValues> {
  errors: FieldErrors<T>;
  control: Control<T>;
  handlePlaceChanged: () => void;
  setActiveStep: (val: number | ((prev: number) => number)) => void;
  loading: boolean;
  setSelectedCurrency: (val: string) => void;
  phone: string;
  mobile: string;
  setPhone: (val: string) => void;
  setMobile: (val: string) => void;
  selectedCurrency: string;
  setSelectedCountry: (val: string) => void;
  selectedCountry: string;
}

const currencyOptions = Object.keys(Currency).map((currency) => ({
  value: Currency[currency].code + ` (${Currency[currency].symbol})`,
  label: Currency[currency].name + ` (${Currency[currency].symbol})`,
}));

const StepFormTwoInner = <T extends FieldValues>(
  {
    control,
    errors,
    handlePlaceChanged,
    setActiveStep,
    loading,
    setSelectedCurrency,
    phone,
    mobile,
    setPhone,
    setMobile,
    selectedCurrency,
    setSelectedCountry,
    selectedCountry,
  }: IStepForm2<T>,
  ref: ForwardedRef<google.maps.places.Autocomplete | null>,
) => {
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useResponsive();

  const navigate = useNavigate();

  const handlePhoneChange = (name: string, value: string) => {
    if (name === 'phone') {
      setPhone(value);
    } else if (name === 'mobile') {
      setMobile(value);
    }
  };

  const handlePlaceChange = () => {
    if (ref && 'current' in ref && ref.current) {
      const place = ref.current.getPlace();
      if (place && place.address_components) {
        const countryComponent = place.address_components.find((component) =>
          component.types.includes('country'),
        );

        if (countryComponent) {
          setSelectedCountry(countryComponent.short_name);
        }
      }
    }
    handlePlaceChanged();
  };

  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      name: 'zipcode',
      label: t('auth.zipCode'),
      required: true,
    },
    { type: 'input', name: 'city', label: t('auth.city'), required: true },
    { type: 'input', name: 'state', label: t('auth.state'), required: true },
    {
      type: 'dropdown',
      name: 'country',
      placeholder: t('auth.country'),
      options: countryOptions,
      required: true,
      value: selectedCountry,
      onChange: (value: string | string[]) =>
        setSelectedCountry(value as string),
    },
    {
      type: 'phone',
      name: 'mobile',
      label: t('auth.mobile'),
      required: true,
      className: 'register',
      onPhoneChange: (name, value) => handlePhoneChange(name, value),
      value: mobile,
    },
    {
      type: 'phone',
      name: 'phone',
      label: t('auth.phone'),
      required: true,
      className: 'register',
      onPhoneChange: (name, value) => handlePhoneChange(name, value),
      value: phone,
    },
    {
      type: 'dropdown',
      name: 'currency',
      placeholder: t('auth.currency'),
      options: currencyOptions,
      required: true,
      value: selectedCurrency,
      onChange: (value: string | string[]) =>
        setSelectedCurrency(value as string),
    },
  ];

  return (
    <>
      <GridContainer
        columns={getNumberOfCols({
          isDesktop,
          isMobile,
          desktopCol: 2,
          mobileCol: 1,
        })}
      >
        {loading && (
          <AddressAutocomplete
            ref={ref}
            control={control}
            errors={errors}
            onPlaceChanged={handlePlaceChange}
          />
        )}

        <FormFields fields={fields} control={control} errors={errors} />
      </GridContainer>
      <div className="pt-4">
        <div className="flex justify-between items-center">
          <Iconbutton
            MuiIcon={ArrowBack}
            onClick={() => {
              setActiveStep((prev: number) => prev - 1);
            }}
            text={t('previous')}
            size="small"
          />

          <PrimaryButton type="submit" endIcon={<ArrowForward />}>
            {t('next')}
          </PrimaryButton>
        </div>
      </div>
      <div className="pt-4 justify-center flex">
        <PrimaryButton
          size="small"
          variant="outlined"
          onClick={() => navigate('/login')}
        >
          {t('auth.backToSign')}
        </PrimaryButton>
      </div>
    </>
  );
};

export const StepFormTwo = forwardRef(StepFormTwoInner) as <
  T extends FieldValues,
>(
  props: IStepForm2<T> & {
    ref?: MutableRefObject<google.maps.places.Autocomplete | null>;
  },
) => JSX.Element;
