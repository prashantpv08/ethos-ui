import {
  GlobalStyles,
  ThemeOptions,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import theme from './theme';
import { ReactNode, useEffect, useState } from 'react';
import { LicenseInfo } from '@mui/x-license';
import { typography } from './theme/typography';
import '../../fonts/font.css';
import { enUS, esES, Localization, svSE } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { locales } from '../../utils';

const globalFont = (
  <GlobalStyles
    key="global-styles"
    styles={`@import url("https://fonts.googleapis.com/css2?family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap");`}
  />
);

const EOThemeProvider = ({
  children,
  customTheme,
}: {
  children: ReactNode;
  customTheme?: ThemeOptions;
}) => {
  LicenseInfo.setLicenseKey(
    'e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y',
  );

  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLocale(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const ctheme = createTheme(
    {
      ...theme,
      ...customTheme,
      typography,
    },
    enUS,
    locales[locale],
  );

  return (
    <ThemeProvider theme={ctheme}>
      {globalFont}
      {children}
    </ThemeProvider>
  );
};

export default EOThemeProvider;
