import { Context, Next } from 'hono';
import { messages } from '../locales/locales';

export default async function langDetector(c: Context, next: Next) {
  let lang = c.req.header('Accept-Language')?.split('-')[0] || 'en';
  if (!(lang in messages)) {
    lang = 'en';
  }
  c.set('language', lang);
  await next();
}
