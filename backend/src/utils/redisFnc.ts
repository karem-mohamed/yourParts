import { redis } from '../config/redis';

export async function saveValueInRedis(
  key: string,
  value: string | number,
  expire?: number
) {
  return await redis.set(key, value, expire ? { EX: expire } : {});
}

export async function getValueFromRedis(key: string) {
  return await redis.get(key);
}

export async function removeFromRedis(key: string) {
  return await redis.del(key);
}
