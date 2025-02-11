import { Context, Next } from 'hono';
import { redis } from '../config/redis';

const cacheRequests = async (c: Context, next: Next) => {
  const key = c.req.url;
  const cachedData = await redis.get(key);
  if (cachedData) {
    return c.json(JSON.parse(cachedData));
  }
  await next();
};

export default cacheRequests;
