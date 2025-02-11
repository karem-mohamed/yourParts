import { Context, Next } from 'hono';
import { redis } from '../config/redis';
import getLocaleValue from '../utils/getLocaleValue';
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 5;

export const loginRateLimiter = async (c: Context, next: Next) => {
  const ip =
    c.req.header('x-forwarded-for') ||
    c.req.header('cf-connecting-ip') ||
    c.env?.remoteAddr;

  if (!ip) {
    return await next();
    return c.json({ error: 'Unable to detect IP' }, 400);
  }

  const key = `call_attempts:${ip}`;
  const attempts = await redis.get(key);
  if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
    return c.json({ error: getLocaleValue(c, 'brute-force') }, 429);
  }

  await next();
  await redis.incr(key);
  await redis.expire(key, BLOCK_TIME);
};
