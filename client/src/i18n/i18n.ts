import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

import {englishTranslations} from './en_translations';
import {frenchTranslations} from './fr_translations';

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {translation: englishTranslations},
      fr: {translation: frenchTranslations},
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        'querystring',
        'cookie',
        'localStorage',
        'navigator',
        'path',
        'subdomain',
      ],
      lookupQuerystring: 'lng',
    },
  });

export default i18next;
