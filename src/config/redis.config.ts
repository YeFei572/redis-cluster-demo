import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  nodes: [
    {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  ],
  options: {
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0', 10),
    },
    enableReadyCheck: true,
    slotsRefreshTimeout: 2000,
    enableOfflineQueue: true,
  },
}));
