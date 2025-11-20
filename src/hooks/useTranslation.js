import { useSelector } from 'react-redux';
import enTranslations from '../locales/en.json'
import ruTranslations from '../locales/ru.json'

const translations = {
  en: enTranslations,
  ru: ruTranslations,
};

export const useTranslation = () => {
  const language = useSelector(state => state.appSettings.language);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, language };
};