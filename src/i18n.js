import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLanguage, resources, supportedLanguages } from "./content/siteContent";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
});

export default i18n;
