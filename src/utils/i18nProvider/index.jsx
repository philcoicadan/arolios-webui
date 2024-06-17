import { resolveBrowserLocale } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { en } from './en.js';
import { fr } from './fr.js';

const translations = { en, fr };

const i18nProvider = polyglotI18nProvider(
    locale => translations[locale] ? translations[locale] : translations.fr,
    resolveBrowserLocale(),
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' }
    ],
);

export default i18nProvider;