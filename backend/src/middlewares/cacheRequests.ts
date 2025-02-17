import { Context, Next } from 'hono';
import { redis } from '../config/redis';

const cacheRequests = (route: string) => {
  return async (c: Context, next: Next) => {
    const key = c.req.url;
    const cachedData = await redis.get(`${route}:${key}`);
    if (cachedData) {
      return c.json(JSON.parse(cachedData));
    }
    await next();
  };
};
export default cacheRequests;
