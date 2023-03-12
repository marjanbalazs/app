import { Redis } from "ioredis";
import { SearchParams } from "./movie-datasource";
import objectHash from "object-hash";
import { getConfig } from "./config";

const {
  logger,
  redis: { password, port, host, user, defaultTTL },
} = getConfig();

const getCounterKey = (key: string) => `${key}-cntr`;

const redis = new Redis({
  port: parseInt(port, 10),
  host: host,
  password: password,
  username: user,
});

const getCacheValue = async (cacheKey: string) => {
  return await redis.get(cacheKey);
};

export const getCacheSearchResult = async <T>(
  searchParams: SearchParams
): Promise<T | null> => {
  const hash = objectHash(searchParams);

  const [cntr, value] = await Promise.all([
    await getCacheValue(getCounterKey(hash)),
    await getCacheValue(hash),
  ]);

  if (cntr && value) {
    logger.info({ msg: `Cache hit: ${hash}` });
    await redis
      .multi()
      .incrby(getCounterKey(hash), 1)
      .expire(hash, defaultTTL)
      .expire(getCounterKey(hash), defaultTTL)
      .exec();
    return JSON.parse(value) as T;
  } else {
    logger.info({ msg: `Cache miss: ${hash}` });
    return null;
  }
};

export const storeCacheSearchResult = async <T>(
  searchParams: SearchParams,
  searchResult: T
) => {
  const hash = objectHash(searchParams);

  await redis
    .multi()
    .set(hash, JSON.stringify(searchResult))
    .set(getCounterKey(hash), 0)
    .expire(hash, defaultTTL)
    .expire(getCounterKey(hash), defaultTTL)
    .exec();

  logger.info({ msg: `Cache store: ${hash}` });
  return true;
};

export const flushRedis = async () => {
  return await redis.flushall();
};
