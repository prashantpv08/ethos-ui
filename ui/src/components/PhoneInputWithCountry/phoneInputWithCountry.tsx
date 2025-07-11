import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import styles from './phoneInputWithCountry.module.scss';
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { useGeoLocation } from '../../hooks';
import { Label } from '@ethos-frontend/ui';
import { Controller } from 'react-hook-form';

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder: string;
  error: boolean;
  helperText: string;
  name: string;
  control: any;
  dropdownClass?: string;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value = 'us',
  onChange,
  placeholder,
  error,
  helperText,
  name,
  control,
  dropdownClass,
}) => {
  const { countryCode } = useGeoLocation(value);

  const isValidNumber = (inputNumber: string, countryCode: string) => {
    const phoneNumber = parsePhoneNumberFromString(
      inputNumber,
      countryCode?.toUpperCase() as CountryCode
    );
    return phoneNumber ? phoneNumber.isValid() : false;
  };

  const handleOnChange = (
    inputNumber: string,
    country: { countryCode?: string }
  ) => {
    const valid = isValidNumber(
      inputNumber,
      country?.countryCode?.toUpperCase() as string
    );

    onChange(inputNumber, valid);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <div className={styles['customInput']}>
          <PhoneInput
            country={countryCode}
            value={value}
            onChange={(inputNumber, country) => {
              handleOnChange(inputNumber, country);
            }}
            enableSearch
            disableSearchIcon
            inputStyle={{ width: '100%' }}
            isValid={(inputNumber, country: { iso2?: string }) => {
              if (isValidNumber(inputNumber, country?.iso2 as string)) {
                return true;
              } else if (value) {
                return 'Invalid phone number';
              } else {
                return true;
              }
            }}
            specialLabel={placeholder}
            countryCodeEditable={false}
            masks={{ se: '... ... ...' }}
            dropdownClass={dropdownClass}
          />

          {error && (
            <Label variant="subtitle2" className={styles['errorLabel']}>
              {helperText}
            </Label>
          )}
        </div>
      )}
    />
  );
};
