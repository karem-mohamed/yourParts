import { redis } from "../config/redis";

export async function saveTokenInRedis(
  key: string,
  value: number | string,
  expire: number | undefined
) {
  return await redis.set(key, value, expire ? { EX: expire } : {});
}

export async function getValueFromRedis(key: string) {
  return await redis.get(key);
}

export async function removeFromRedis(key: string) {
  return await redis.del(key);
}
