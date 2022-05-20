import { createClient, RedisClientType } from 'redis';

export default class Redis {
  private client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
  }

  async get<T>(key: string): Promise<T> {
    const cachedData = await this.client.get(key);
    return JSON.parse(cachedData) as T;
  }

  async set<T>(key: string, value: T, options?: Record<string, string>) {
    // await this.client.set(key, value, options);
  }
}
