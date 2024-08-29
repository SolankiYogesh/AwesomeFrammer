import {initReactI18next} from 'react-i18next'
import i18n from 'i18next'

import en from './Locales/en.json'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en
  },
  interpolation: {
    escapeValue: false
  }
})

export default i18n
