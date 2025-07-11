import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { English, Spanish, Swedish, French } from './locale';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    resources: {
      en: {
        translation: English,
      },
      es: {
        translation: Spanish,
      },
      sv: {
        translation: Swedish,
      },
      fr: {
        translation: French
      }
    },
  });

const detectedLang = i18n.language;
if (detectedLang.startsWith('en')) {
  i18n.changeLanguage('en-US');
}

export default i18n;
