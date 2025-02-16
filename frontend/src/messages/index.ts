import { Locale } from '@/types/locale';
import ar from './ar.json';
import en from './en.json';

export const messages: Record<
  Locale,
  Record<string, string | Record<string, string>>
> = {
  ar: ar,
  en: en,
};
