import Redis from 'ioredis';

import {REDIS_HOST, REDIS_PASS, REDIS_PORT} from '../config/environment';

// eslint-disable-next-line import/no-mutable-exports
let redisClient: Redis;

const connectRedis = (): Promise<string> => {
  redisClient = new Redis({
    port: parseInt(REDIS_PORT, 10) || 6379,
    password: REDIS_PASS,
    host: REDIS_HOST,
    showFriendlyErrorStack: true,
  });

  return new Promise((resolve) => {
    redisClient.on('connect', () => {
      resolve('Redis state: connected');
    });
  });
};

export {connectRedis, redisClient};
