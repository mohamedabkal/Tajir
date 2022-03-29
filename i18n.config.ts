import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

import en from './src/translations/en';
import ar from './src/translations/ar';

const availableLangs = RNLocalize.getLocales();
const local = availableLangs[0].languageCode;

const resources = {
    en: { translation: en },
    ar: { translation: ar },
};

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: local,
    //language to use if translations in user language are not available
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // not needed for react!!
    },
});

export default i18n;
