import { createClient, RedisClientType } from 'redis';
import { Service } from 'typedi';

@Service()
export default class RedisService {
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

  //todo type properly
  async set(key: string, value: any, options?: Record<string, string>) {
    await this.client.set(key, value);
  }
}
