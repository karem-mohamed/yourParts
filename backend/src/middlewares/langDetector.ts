import { Context, Next } from 'hono';

export default async function langDetector(c: Context, next: Next) {
  const lang = c.req.header('Accept-Language')?.split(',')[0] || 'en';
  c.set('language', lang);
  await next();
}
