import { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { Iconbutton, PrimaryButton } from '@ethos-frontend/ui';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import {
  ControlledDropdown,
  ControlledInput,
  GridContainer,
} from '@ethos-frontend/components';
import {
  getBusinessType,
  getLanguageOptions,
  loginUrl,
} from '@ethos-frontend/constants';
import { useTranslation } from 'react-i18next';

interface StepForm1<T extends FieldValues> {
  errors: FieldErrors<T>;
  control: Control<T>;
  setSelectBusinessType: (val: string) => void;
  selectBusinessType: string;
  setSelectedLanguage: (val: string) => void;
  selectedLanguage: string;
}

export const StepFormOne = <T extends FieldValues>({
  control,
  errors,
  setSelectBusinessType,
  selectBusinessType,
  setSelectedLanguage,
  selectedLanguage,
}: StepForm1<T>) => {
  const { t } = useTranslation();
  const { isMobile, isDesktop } = useResponsive();
  const navigate = useNavigate();
  const businessType = getBusinessType();
  const languageOptions = getLanguageOptions();
  
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
        <ControlledInput
          fullWidth
          type="text"
          name="businessName"
          control={control}
          required
          label={t('auth.businessName')}
          errors={errors}
          helperText={errors}
        />
        <ControlledDropdown
          name="businessType"
          control={control}
          placeholder={t('auth.businessType')}
          options={businessType}
          errors={errors}
          helperText={errors}
          onChange={(e) => setSelectBusinessType(e as unknown as string)}
          value={selectBusinessType}
          required
        />
        <ControlledInput
          fullWidth
          type="text"
          name={'restaurantName'}
          label={t('restaurantName')}
          control={control}
          required
          errors={errors}
          helperText={errors}
        />

        <ControlledInput
          fullWidth
          type="text"
          name={'ownerFirstName'}
          label={t('auth.representativeFirstName')}
          control={control}
          required
          errors={errors}
          helperText={errors}
        />

        <ControlledInput
          fullWidth
          type="text"
          name={'ownerLastName'}
          label={t('auth.representativeLastName')}
          control={control}
          required
          rows={5}
          errors={errors}
          helperText={errors}
        />

        <ControlledInput
          fullWidth
          type="text"
          name={'registrationNumber'}
          label={t('auth.registrationNumber')}
          control={control}
          required
          errors={errors}
          helperText={errors}
        />

        <ControlledInput
          fullWidth
          type="text"
          name="taxNumber"
          label={t('auth.vat')}
          control={control}
          required
          rows={5}
          errors={errors}
          helperText={errors}
        />

        <ControlledInput
          fullWidth
          type="text"
          name="email"
          label={t('auth.email')}
          control={control}
          required
          errors={errors}
          helperText={errors}
        />
        <ControlledDropdown
          name="language"
          errors={errors}
          control={control}
          placeholder={t('auth.preferredLanguage')}
          options={languageOptions}
          helperText={errors}
          onChange={(e) => setSelectedLanguage(e as unknown as string)}
          value={selectedLanguage}
          required
        />
      </GridContainer>
      <div className="pt-4 flex justify-between items-center">
        <Iconbutton
          MuiIcon={ArrowBack}
          onClick={() => navigate(loginUrl)}
          text={t('auth.backToSign')}
          size="small"
        />

        <PrimaryButton type="submit" endIcon={<ArrowForward />}>
          {t('next')}
        </PrimaryButton>
      </div>
    </>
  );
};
