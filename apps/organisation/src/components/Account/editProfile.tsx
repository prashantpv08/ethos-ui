import { ChevronLeft } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import {
  ControlledDropdown,
  ControlledInput,
  GridContainer,
} from '@ethos-frontend/components';
import { useForm } from 'react-hook-form';
import { useRestMutation } from '@ethos-frontend/hook';
import { Iconbutton, PrimaryButton } from '@ethos-frontend/ui';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import styles from './account.module.scss';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { toast } from 'react-toastify';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { IUserData, useUser } from '../../context/user';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
  orgName: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  businessType: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  orgNumber: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  restaurantName: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  ownerFName: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  ownerLName: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  email: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  phone: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  homeNumber: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  taxNumber: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  address: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  zipcode: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  city: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  state: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  country: Yup.string().required(ERROR_MESSAGES.REQUIRED),
});

const libraries: ['places'] = ['places'];

export const EditProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData, error, setUserData } = useUser();
  const { isMobile, isDesktop } = useResponsive();
  const [selectBusinessType, setSelectBusinessType] = useState<
    string | undefined
  >('');

  const mutation = useRestMutation(API_URL.profile, {
    method: API_METHODS.PUT,
  });

  const {
    isPending,
    error: mutationError,
    data: updateProfileResponse,
  } = mutation;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_PLACES_API || '',
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (userData) {
      reset({
        orgName: userData?.orgName,
        businessType: userData?.businessType,
        orgNumber: userData?.orgNumber,
        restaurantName: userData?.restaurantName,
        ownerFName: userData?.ownerFName,
        ownerLName: userData?.ownerLName,
        phone: userData?.phone,
        homeNumber: userData?.homeNumber,
        address: userData?.address,
        zipcode: userData?.zipcode,
        city: userData?.city,
        email: userData?.email,
        state: userData?.state,
        country: userData?.country,
        taxNumber: userData?.taxNumber,
      });
      setSelectBusinessType(userData?.businessType);
    }
    if (error) {
      toast.error(t(ERROR_MESSAGES.GENERAL));
    }
  }, [userData, reset, error]);

  useEffect(() => {
    if (updateProfileResponse) {
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
      navigate('/account/profile');
    }
  }, [updateProfileResponse, mutationError]);

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

  const onSubmit = async (data: Record<string, unknown>) => {
    delete data.email;

    const { mutateAsync } = mutation;
    try {
      await mutateAsync(data as unknown as void);

      if (userData) {
        const { ...updatedData } = userData;
        setUserData({ ...(data as unknown as IUserData), ...updatedData });
      }
    } catch (error) {
      toast.error(t(ERROR_MESSAGES.GENERAL));
      console.error('Mutation error:', error);
    }
  };

  const fields = [
    { type: 'input', name: 'orgName', label: 'Business Name', required: true },
    {
      type: 'input',
      name: 'orgNumber',
      label: 'Registration Code',
      required: true,
    },
  ];

  return (
    <>
      <div className={styles.header}>
        <Iconbutton
          MuiIcon={ChevronLeft}
          onClick={() => navigate('/account/profile')}
          text="Edit Profile"
          size="large"
          iconColor="var(--dark)"
        />
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <GridContainer columns={getNumberOfCols({ isDesktop, isMobile })}>
          <ControlledInput
            type="text"
            name="orgName"
            control={control}
            label="Business name"
            errors={errors}
            helperText={errors}
            required
          />
          <ControlledDropdown
            name="businessType"
            control={control}
            placeholder="Business type"
            options={[
              { value: 'Hotels', label: 'Hotel' },
              {
                value: 'Restaurants',
                label: 'Restaraunts',
              },
            ]}
            errors={errors}
            helperText={errors}
            onChange={(e: string | string[]) =>
              setSelectBusinessType(e as unknown as string)
            }
            value={selectBusinessType}
          />

          <ControlledInput
            type="text"
            name="restaurantName"
            label="Restuarant Name"
            control={control}
            errors={errors}
            helperText={errors}
            required
          />

          <ControlledInput
            type="text"
            name="orgNumber"
            label="Registration Code"
            control={control}
            errors={errors}
            helperText={errors}
            required
          />

          <ControlledInput
            type="text"
            name="ownerFName"
            label="Owner First Name"
            control={control}
            errors={errors}
            required
            helperText={errors}
          />

          <ControlledInput
            type="text"
            name="ownerLName"
            label="Owner Last Name"
            control={control}
            errors={errors}
            helperText={errors}
            required
          />

          <ControlledInput
            type="text"
            name="email"
            label="Email"
            control={control}
            errors={errors}
            required
            helperText={errors}
            disabled
          />

          <ControlledInput
            type="text"
            name="phone"
            label="Phone Number"
            control={control}
            errors={errors}
            required
            helperText={errors}
          />

          <ControlledInput
            type="text"
            name="homeNumber"
            label="Home Number"
            control={control}
            errors={errors}
            required
            helperText={errors}
          />

          <ControlledInput
            type="text"
            name="taxNumber"
            label="VAT/TAX Number"
            control={control}
            errors={errors}
            required
            helperText={errors}
          />
          {isLoaded && (
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceChanged}
            >
              <ControlledInput
                type="text"
                name="address"
                label="Address"
                control={control}
                errors={errors}
                required
                helperText={errors}
                fullWidth
              />
            </Autocomplete>
          )}

          <ControlledInput
            type="text"
            name="zipcode"
            label="Zipcode"
            control={control}
            errors={errors}
            required
            helperText={errors}
            readOnly
          />

          <ControlledInput
            type="text"
            name="city"
            label="City"
            control={control}
            errors={errors}
            required
            helperText={errors}
            readOnly
          />

          <ControlledInput
            type="text"
            name="state"
            label="State"
            control={control}
            errors={errors}
            required
            helperText={errors}
            readOnly
          />

          <ControlledInput
            type="text"
            name="country"
            label="Country"
            control={control}
            errors={errors}
            required
            helperText={errors}
            readOnly
          />
        </GridContainer>
        <div className="pt-6 flex justify-end gap-9">
          <PrimaryButton
            variant="text"
            onClick={() => navigate('/account/profile')}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton type="submit" loading={isPending} disabled={!isDirty}>
            Update Profile
          </PrimaryButton>
        </div>
      </form>
    </>
  );
};
