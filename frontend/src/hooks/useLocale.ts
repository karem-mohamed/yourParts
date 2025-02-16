import { Locale } from '@/types/locale';
import { useLocale as useLocaleIntl } from 'next-intl';

export function useLocale() {
  const locale = useLocaleIntl() as Locale;
  return locale;
}
