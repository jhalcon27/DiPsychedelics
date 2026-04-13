import { en } from './en';
import { de } from './de';
import { es } from './es';

export { en, de, es };
export type { TranslationObj } from './en';

const translations = { en, de, es } as const;
export type Locale = keyof typeof translations;

export function useTranslations(locale: string) {
  const lang = (locale in translations ? locale : 'en') as Locale;
  return translations[lang];
}

export function getOgLocale(locale: string): string {
  const map: Record<string, string> = { en: 'en_US', de: 'de_DE', es: 'es_ES' };
  return map[locale] ?? 'en_US';
}

export function getLangCode(locale: string): string {
  const map: Record<string, string> = { en: 'en-US', de: 'de-DE', es: 'es-ES' };
  return map[locale] ?? 'en-US';
}
