import { en } from './en';
import { de } from './de';
import { es } from './es';
import { zh } from './zh';
import { ja } from './ja';
import { fr } from './fr';

export { en, de, es, zh, ja, fr };
export type { TranslationObj } from './en';

const translations = { en, de, es, zh, ja, fr } as const;
export type Locale = keyof typeof translations;

export function useTranslations(locale: string) {
  const lang = (locale in translations ? locale : 'en') as Locale;
  return translations[lang];
}

export function getOgLocale(locale: string): string {
  const map: Record<string, string> = { en: 'en_US', de: 'de_DE', es: 'es_ES', zh: 'zh_CN', ja: 'ja_JP', fr: 'fr_FR' };
  return map[locale] ?? 'en_US';
}

export function getLangCode(locale: string): string {
  const map: Record<string, string> = { en: 'en-US', de: 'de-DE', es: 'es-ES', zh: 'zh-CN', ja: 'ja-JP', fr: 'fr-FR' };
  return map[locale] ?? 'en-US';
}
