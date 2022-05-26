import { createClient, RedisClientType } from 'redis';

class RedisService {
  private client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
  }
  async connect(): Promise<void> {
    await this.client.connect();
    console.log('redis connected successfully')
  }
  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    try {
      const cachedData = await this.client.get(key);
      if (cachedData) {
        return this.deserealizeCache<T>(cachedData);
      }
      const result = await fetcher();
      this.set(key, this.serealizeCache(result));
      return result;
    } catch (error) {
      return null;
    }
  }

  private deserealizeCache<T>(json: string) {
    return JSON.parse(json) as T;
  }

  private serealizeCache<T>(value: T) {
    return JSON.stringify(value);
  }

  async set(
    key: string,
    value: string,
    options: Record<string, number> = { EX: 600 }
  ) {
    await this.client.set(key, value, options);
  }
}

export default new RedisService();
