import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cluster } from "ioredis";
import { RedisEnv } from "./redis.module";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(RedisService.name);

    constructor(
        @InjectRedis() private readonly redis: Cluster
    ) { }

    onModuleInit() {

    }

    onModuleDestroy() {
        this.redis.quit();
    }

    // 获取redis客户端
    getClient(connection: RedisEnv = RedisEnv.GAME) {
        // return connection === RedisEnv.AVATAR ? this.avatarClient : this.gameClient;
        return this.redis;
    }

    // 基础操作 - 设置键值对
    async set(key: string, value: any, expires?: number, connection: RedisEnv = RedisEnv.GAME): Promise<'OK'> {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (expires) {
            return await this.getClient(connection).set(key, stringValue, 'EX', expires);
        }
        return await this.getClient(connection).set(key, stringValue);
    }

    // 获取值
    async get<T = any>(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<T | null> {
        const value = await this.getClient(connection).get(key);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    // 删除键
    async del(connection: RedisEnv = RedisEnv.GAME, ...keys: string[]): Promise<number> {
        return await this.getClient(connection).del(...keys);
    }

    // 检查键是否存在
    async exists(connection: RedisEnv = RedisEnv.GAME, ...keys: string[]): Promise<number> {
        return await this.getClient(connection).exists(...keys);
    }

    // 设置过期时间
    async expire(key: string, seconds: number, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).expire(key, seconds);
    }

    // 获取剩余过期时间
    async ttl(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).ttl(key);
    }

    // 批量设置键值对
    async mset(keyValuePairs: Record<string, any>, connection: RedisEnv = RedisEnv.GAME): Promise<'OK'> {
        const pairs = Object.entries(keyValuePairs).reduce((acc, [key, value]) => {
            acc.push(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
            return acc;
        }, [] as string[]);
        return await this.getClient(connection).mset(pairs);
    }

    // 批量设置键值对，并为每个键设置过期时间
    async msetWithExpire(keyValuePairs: Record<string, any>, expireTime: number, connection: RedisEnv = RedisEnv.GAME): Promise<'OK'> {
        const results = await Promise.all(
            Object.entries(keyValuePairs).map(async ([key, value]) => {
                const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                await this.getClient(connection).set(key, serializedValue, 'PX', expireTime * 1000);
            })
        );
        return 'OK';
    }

    // 批量获取值
    async mget<T = any>(connection: RedisEnv = RedisEnv.GAME, ...keys: string[]): Promise<(T | null)[]> {
        const values = await this.getClient(connection).mget(keys);
        return values.map(value => {
            if (value === null) return null;
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        });
    }

    // 自增
    async incr(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).incr(key);
    }

    // 自减
    async decr(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).decr(key);
    }

    // 增加指定值
    async incrBy(key: string, increment: number, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).incrby(key, increment);
    }

    // 减少指定值
    async decrBy(key: string, decrement: number, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        return await this.getClient(connection).decrby(key, decrement);
    }

    // Hash 操作
    async hset(key: string, field: string, value: any, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return await this.getClient(connection).hset(key, field, stringValue);
    }

    async hget<T = any>(key: string, field: string, connection: RedisEnv = RedisEnv.GAME): Promise<T | null> {
        const value = await this.getClient(connection).hget(key, field);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    async hdel(key: string, connection: RedisEnv = RedisEnv.GAME, ...fields: string[]): Promise<number> {
        return await this.getClient(connection).hdel(key, ...fields);
    }

    async hgetall<T = any>(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<Record<string, T>> {
        const data = await this.getClient(connection).hgetall(key);
        const result: Record<string, T> = {};
        for (const [field, value] of Object.entries(data)) {
            try {
                result[field] = JSON.parse(value) as T;
            } catch {
                result[field] = value as unknown as T;
            }
        }
        return result;
    }

    // List 操作
    async lpush(key: string, connection: RedisEnv = RedisEnv.GAME, ...values: any[]): Promise<number> {
        const stringValues = values.map(value =>
            typeof value === 'object' ? JSON.stringify(value) : String(value)
        );
        return await this.getClient(connection).lpush(key, ...stringValues);
    }

    async rpush(key: string, connection: RedisEnv = RedisEnv.GAME, ...values: any[]): Promise<number> {
        const stringValues = values.map(value =>
            typeof value === 'object' ? JSON.stringify(value) : String(value)
        );
        return await this.getClient(connection).rpush(key, ...stringValues);
    }

    async lpop<T = any>(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<T | null> {
        const value = await this.getClient(connection).lpop(key);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    async rpop<T = any>(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<T | null> {
        const value = await this.getClient(connection).rpop(key);
        if (value === null) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as unknown as T;
        }
    }

    async lrange<T = any>(key: string, start: number, stop: number, connection: RedisEnv = RedisEnv.GAME): Promise<T[]> {
        const values = await this.getClient(connection).lrange(key, start, stop);
        return values.map(value => {
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        });
    }

    // Set 操作
    async sadd(key: string, connection: RedisEnv = RedisEnv.GAME, ...members: any[]): Promise<number> {
        const stringMembers = members.map(member =>
            typeof member === 'object' ? JSON.stringify(member) : String(member)
        );
        return await this.getClient(connection).sadd(key, ...stringMembers);
    }

    async srem(key: string, connection: RedisEnv = RedisEnv.GAME, ...members: any[]): Promise<number> {
        const stringMembers = members.map(member =>
            typeof member === 'object' ? JSON.stringify(member) : String(member)
        );
        return await this.getClient(connection).srem(key, ...stringMembers);
    }

    async smembers<T = any>(key: string, connection: RedisEnv = RedisEnv.GAME): Promise<T[]> {
        const members = await this.getClient(connection).smembers(key);
        return members.map(member => {
            try {
                return JSON.parse(member) as T;
            } catch {
                return member as unknown as T;
            }
        });
    }

    async sismember(key: string, member: any, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        const stringMember = typeof member === 'object' ? JSON.stringify(member) : String(member);
        return await this.getClient(connection).sismember(key, stringMember);
    }

    // Sorted Set 操作
    async zadd(key: string, score: number, member: any, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        const stringMember = typeof member === 'object' ? JSON.stringify(member) : String(member);
        return await this.getClient(connection).zadd(key, score, stringMember);
    }

    async zrem(key: string, connection: RedisEnv = RedisEnv.GAME, ...members: any[]): Promise<number> {
        const stringMembers = members.map(member =>
            typeof member === 'object' ? JSON.stringify(member) : String(member)
        );
        return await this.getClient(connection).zrem(key, ...stringMembers);
    }

    async zrange<T = any>(key: string, start: number, stop: number, connection: RedisEnv = RedisEnv.GAME): Promise<T[]> {
        const members = await this.getClient(connection).zrange(key, start, stop);
        return members.map(member => {
            try {
                return JSON.parse(member) as T;
            } catch {
                return member as unknown as T;
            }
        });
    }

    // 发布订阅
    async publish(channel: string, message: any, connection: RedisEnv = RedisEnv.GAME): Promise<number> {
        const stringMessage = typeof message === 'object' ? JSON.stringify(message) : String(message);
        return await this.getClient(connection).publish(channel, stringMessage);
    }

    subscribe(channel: string, callback: (message: string) => void, connection: RedisEnv = RedisEnv.GAME): void {
        this.getClient(connection).subscribe(channel);
        this.getClient(connection).on('message', (chan, message) => {
            if (chan === channel) {
                callback(message);
            }
        });
    }

    // 扫描键
    async scan(pattern: string, connection: RedisEnv = RedisEnv.GAME): Promise<string[]> {
        const keys: string[] = [];
        let cursor = '0';
        do {
            const [newCursor, matchedKeys] = await this.getClient(connection).scan(
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

    // 清空数据库
    async flushdb(connection: RedisEnv = RedisEnv.GAME): Promise<'OK'> {
        return await this.getClient(connection).flushdb();
    }

    // 获取所有键
    async keys(pattern: string, connection: RedisEnv = RedisEnv.GAME): Promise<string[]> {
        return await this.getClient(connection).keys(pattern);
    }

}