import { Heading, PrimaryButton } from '@ethos-frontend/ui';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  SwipeableDrawer,
  styled,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { LANGUAGE_TYPE } from '../../constant';
import styles from './homepage.module.scss';
import { getLanguageLabel, setStorage } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import { useQueryClient } from '@tanstack/react-query';

export const StyledDrawer = styled(SwipeableDrawer)(() => ({
  '& .MuiDrawer-paperAnchorBottom': {
    borderRadius: '28px 28px 0 0',
    padding: '30px 0',
  },
}));

export const Puller = styled('div')(() => ({
  width: 32,
  height: 4,
  backgroundColor: '#79747E',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

interface LanguageSwitcherProps {
  languageSwitcher: boolean;
  setLanguageSwitcher: Dispatch<SetStateAction<boolean>>;
  data: LANGUAGE_TYPE[] | undefined;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  languageSwitcher,
  setLanguageSwitcher,
  data,
}) => {
  const { i18n, t } = useTranslation();
  const queryClient = useQueryClient();
  const client = useApolloClient();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const languageHandler = () => {
    return data?.map((val: LANGUAGE_TYPE, i: number) => {
      return (
        <FormControlLabel
          key={i}
          value={val}
          control={<Radio />}
          label={getLanguageLabel(val)}
        />
      );
    });
  };

  const onHandleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedLanguage(e.target.value);
  };

  const applyLanguageChange = async () => {
    i18n.changeLanguage(selectedLanguage);
    setStorage('userSelectedLanguage', selectedLanguage);
    queryClient.removeQueries();
    await client.resetStore();
    setLanguageSwitcher(false);
  };

  return (
    <StyledDrawer
      anchor="bottom"
      open={languageSwitcher}
      onClose={() => {
        setLanguageSwitcher(false);
        setSelectedLanguage(i18n.language);
      }}
      onOpen={() => setLanguageSwitcher(true)}
    >
      <>
        <Puller />
        <FormControl>
          <FormLabel
            id="language-selector"
            className={`flex justify-between p-4 ${styles.selectorHeader}`}
          >
            <Heading variant="h5">{t('selectLanguage')}</Heading>
            <PrimaryButton variant="text" onClick={applyLanguageChange}>
              {t('done')}
            </PrimaryButton>
          </FormLabel>
          <RadioGroup
            aria-labelledby="language-selector"
            className={`${styles.listItems} mx-4`}
            onChange={onHandleChange}
            value={selectedLanguage}
          >
            {languageHandler()}
          </RadioGroup>
        </FormControl>
      </>
    </StyledDrawer>
  );
};
