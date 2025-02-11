import { Context } from 'hono';
import { messages } from '../locales/locales';

export default function getLocaleValue(
  c: Context,
  key: keyof (typeof messages)['en']
) {
  const lang = c.get('language') as 'en' | 'ar';
  return messages[lang][key];
}
