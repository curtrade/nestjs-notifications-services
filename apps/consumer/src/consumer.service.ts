import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ChannelModel, Channel, ConsumeMessage, connect } from 'amqplib';
import { RabbitMQConfiguration } from './config/rabbitmq.configuration';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isShuttingDown = false;
  private readonly logger = new Logger(ConsumerService.name);

  constructor(private readonly rabbitmqConfig: RabbitMQConfiguration) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;
    await this.close();
  }

  private async connect(attempt = 1): Promise<void> {
    try {
      const connection = await connect(this.rabbitmqConfig.url);
      const channel = await connection.createChannel();

      const deadLetterQueue = `${this.rabbitmqConfig.queue}.dead`;
      await channel.assertQueue(deadLetterQueue, { durable: true });
      await channel.assertQueue(this.rabbitmqConfig.queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': deadLetterQueue,
        },
      });

      channel.prefetch(1);

      connection.on('error', (err) =>
        this.logger.error('RabbitMQ connection error', err),
      );
      connection.on('close', () => {
        this.connection = null;
        this.channel = null;
        if (!this.isShuttingDown) {
          this.logger.warn('Connection closed unexpectedly, reconnecting...');
          this.scheduleReconnect(1);
        }
      });

      channel.on('error', (err) =>
        this.logger.error('RabbitMQ channel error', err),
      );

      this.connection = connection;
      this.channel = channel;

      this.logger.log('Consumer подключен к RabbitMQ');
      await this.startConsuming();
    } catch (err) {
      this.logger.error(`Попытка соединения ${attempt} не удалась`, err);

      if (attempt < this.rabbitmqConfig.retries) {
        const delay = attempt * this.rabbitmqConfig.attemptDelayMultiplicator;
        this.logger.log(`Retrying in ${delay}ms...`);
        await this.sleep(delay);
        await this.connect(attempt + 1);
      } else {
        throw err;
      }
    }
  }

  private scheduleReconnect(attempt: number): void {
    if (this.isShuttingDown) return;
    const delay = attempt * this.rabbitmqConfig.attemptDelayMultiplicator;
    setTimeout(async () => {
      try {
        await this.connect(1);
      } catch {
        this.scheduleReconnect(attempt + 1);
      }
    }, delay);
  }

  private async startConsuming(): Promise<void> {
    if (!this.channel) return;
    const channel = this.channel;

    await channel.consume(
      this.rabbitmqConfig.queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString());
          this.logger.log(`Сообщение обработано id=${content.id}`);
          channel.ack(msg);
        } catch (err) {
          this.logger.error('Ошибка обработки сообщения', err);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }

  private async close(): Promise<void> {
    try {
      await this.channel?.close();
    } catch {}
    try {
      await this.connection?.close();
    } catch {}
    this.channel = null;
    this.connection = null;
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}