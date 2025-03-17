import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Cluster } from 'ioredis';

@Injectable()
export class RedisClusterService implements OnModuleInit, OnModuleDestroy {
  private client: Cluster;
  private readonly logger = new Logger(RedisClusterService.name);

  constructor(private configService: ConfigService) { }

  onModuleInit() {
    try {
      const nodes = this.configService.get('redis.nodes');
      const options = this.configService.get('redis.options');

      this.client = new Redis.Cluster(nodes, {
        ...options,
        scaleReads: 'all',
        clusterRetryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Error:', err);
      });

      this.client.on('connect', () => {
        this.logger.log('Successfully connected to Redis');
      });

      this.client.on('ready', () => {
        this.logger.log('Redis is ready to receive commands');
      });
    } catch (error) {
      this.logger.error('Failed to initialize Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      this.logger.log('Redis connection closed'); // 移除 cluster 字样
    } catch (error) {
      this.logger.error('Error while closing Redis connection:', error);
    }
  }

  getClient(): Cluster {
    if (!this.client) {
      throw new Error('Redis client not initialized');
    }
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
    try {
      if (ttl) {
        return await this.client.set(key, value, 'EX', ttl);
      }
      return await this.client.set(key, value);
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async mget(keys: string[]): Promise<string[]> {
    try {
      console.log(keys.length)
      const results = await Promise.all(keys.map(key => this.client.get(key)));
      return results.filter(result => result !== null) as string[];
    } catch (error) {
      this.logger.error(`Error getting keys ${keys}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.client.exists(key);
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  // 扫描键
  async scan(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [newCursor, matchedKeys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = newCursor;
      keys.push(...matchedKeys);
    } while (cursor !== '0');
    return keys;
  }
}
