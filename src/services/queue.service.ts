import { Service } from 'typedi';
import amqplib from 'amqplib';
import chalk from 'chalk';

class QueueService {
  private connectionUrl: string;
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;
  private queue: string;
  constructor() {
    this.connectionUrl = process.env.AMQP_CONNECTION_URL;
    this.queue = process.env.QUEUE_NAME;
  }

  async connect() {
    this.connection = await amqplib.connect(this.connectionUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue);
    console.log(
      chalk.green(
        `connection to queue established: ${this.connection.connection} / ${this.queue}`
      )
    );
  }

  private formatMessagePayload<T>(action: string, data: T): string {
    const messagePayload = { action, data };
    return JSON.stringify(messagePayload);
  }

  sendToQueue<T>(action: string, data: T): boolean {
    const payload = this.formatMessagePayload<T>(action, data);
    return this.channel.sendToQueue(this.queue, Buffer.from(payload));
  }
}

export default new QueueService();
