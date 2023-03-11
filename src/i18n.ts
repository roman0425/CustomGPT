import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const i18nLanguages = ['en', 'zh-CN'];

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  ns: 'main',
  defaultNS: 'main',
});

export default i18n;
