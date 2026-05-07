import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ChannelModel, connect, ConfirmChannel } from 'amqplib';
import { RabbitMQConfiguration } from './config/rabbitmq.configuration';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from './entities/event.entity';

export enum EventAction {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

interface MessagePayload {
  action: EventAction;
  data: EventEntity;
}

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private connection!: ChannelModel;
  private channel!: ConfirmChannel;
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly rabbitmqConfig: RabbitMQConfiguration){}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  async connect() {
    try {
      this.connection = await connect(this.rabbitmqConfig.url);
      this.channel = await this.connection.createConfirmChannel();
      const deadLetterQueue = `${this.rabbitmqConfig.queue}.dead`;
      await this.channel.assertQueue(deadLetterQueue, { durable: true });
      await this.channel.assertQueue(this.rabbitmqConfig.queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': deadLetterQueue,
        },
      });
      this.logger.log('Producer подключен к RabbitMQ');
    } catch (err) {
      this.logger.error('Ошибка подключения к RabbitMQ:', err);
      throw err;
    }
  }

  async createEvent(dto: CreateEventDto): Promise<EventEntity> {
    const entity: EventEntity = { id: uuidv4(), ...dto };
    await this.sendMessage({ action: EventAction.Create, data: entity });
    return entity;
  }

  private async sendMessage(data: MessagePayload, retries = this.rabbitmqConfig.retries) {
    const messageId = uuidv4();
    const payload = JSON.stringify({ id: messageId, ...data });

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        this.channel.sendToQueue(this.rabbitmqConfig.queue, Buffer.from(payload), { persistent: true });
        await this.channel.waitForConfirms();
        this.logger.log(`Сообщение с id=${messageId} отправлено`);
        return;
      } catch (err) {
        this.logger.error(`Попытка ${attempt} не удалась. Ошибка отправки:`, err);
        if (attempt === retries) throw err;
        await new Promise((res) => setTimeout(res, this.rabbitmqConfig.attemptDelayMultiplicator * attempt));
      }
    }
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}