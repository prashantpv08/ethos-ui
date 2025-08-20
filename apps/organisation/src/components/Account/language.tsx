import { AutoComplete, Heading, PrimaryButton } from '@ethos-frontend/ui';
import { IUserData, useUser } from '../../context/user';
import { useTranslation } from 'react-i18next';
import { useRestMutation } from '@ethos-frontend/hook';
import {
  API_METHODS,
  API_URL,
  getLanguageOptions,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import { toast } from 'react-toastify';
import styles from './account.module.scss';
import { GridContainer } from '@ethos-frontend/components';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useEffect, useState } from 'react';

export const Language = () => {
  const { t, i18n } = useTranslation();
  const { userData, setUserData } = useUser();
  const languageOptions = getLanguageOptions();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { isDesktop, isMobile } = useResponsive();

  const mutation = useRestMutation(API_URL.profile, {
    method: API_METHODS.PUT,
  });

  useEffect(() => {
    if (userData?.lang) {
      setSelectedLanguage(userData?.lang);
    }
  }, [userData?.lang]);

  

  const { isPending, mutateAsync } = mutation;

  const handleLanguageChange = (e: any, selectedLanguage: any) => {
    setSelectedLanguage(selectedLanguage?.value);
  };

  const onUpdateLanguage = async () => {
    try {
      await mutateAsync({
        lang: selectedLanguage,
      });
      i18n.changeLanguage(selectedLanguage);
      setUserData({
        ...(userData as unknown as IUserData),
        lang: selectedLanguage,
      });
      toast.success(t(SUCCESS_MESSAGES.LANGUAGE_UPDATED));
    } catch (error) {
      toast.error(t(ERROR_MESSAGES.GENERAL));
      console.error('Mutation error:', error);
    }
  };

  const currentLanguage =
    languageOptions.find((option) => option.value === selectedLanguage) || null;
  
  return (
    <>
      <Heading
        variant="h4"
        weight="semibold"
        className={`py-4 !my-4 ${styles.headingBorder}`}
      >
        {t('account.profileTab.language')}
      </Heading>
      <GridContainer
        columns={getNumberOfCols({
          isMobile,
          isDesktop,
          desktopCol: 3,
          mobileCol: 1,
        })}
      >
        <AutoComplete
          fullWidth
          label={t('selectLanguage')}
          options={languageOptions}
          onChange={handleLanguageChange}
          value={currentLanguage}
        />
      </GridContainer>
      <div className="mt-4">
        <PrimaryButton onClick={onUpdateLanguage} loading={isPending}>
          {t('account.profileTab.updateLanguage')}
        </PrimaryButton>
      </div>
    </>
  );
};
