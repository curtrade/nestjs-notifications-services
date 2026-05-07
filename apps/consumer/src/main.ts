import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Consumer Service')
    .setDescription('Микросервис обработки событий из RabbitMQ')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3003);
}

bootstrap();