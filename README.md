<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Описание

Микросервисы для обработки уведомлений в Telegram и для работы с очередью RabbitMQ, построенные на базе [NestJS](https://github.com/nestjs/nest).

Подробная документация для каждого микросервиса находится в его директории:
- [Telegram Notifications README](./apps/telegram-notifications/README.md)
- [Producer README](./apps/producer/README.md)
- [Consumer README](./apps/consumer/README.md)

### Структура проекта

Проект содержит приложения:

- **telegram-notifications** - микросервис для отправки уведомлений в Telegram (порт 3001)

- **producer** - микросервис для отправки событий в очередь RabbitMQ (порт 3002)

- **consumer** - микросервис для обработки событий из очереди RabbitMQ (порт 3003)

### API документация (Swagger)

После запуска сервисов интерактивная документация доступна по адресам:

| Сервис | Swagger UI | OpenAPI JSON |
|--------|-----------|--------------|
| Telegram Notifications | http://localhost:3001/api/docs | http://localhost:3001/api/docs-json |
| Producer | http://localhost:3002/api/docs | http://localhost:3002/api/docs-json |
| Consumer | http://localhost:3003/api/docs | http://localhost:3003/api/docs-json |

### Запуск проекта

1. Запустите микросервисы командой `docker-compose up`
2. Запустите Telegram. Постучитесь в @nestjs_notifications_bot (команда /start).
3. Узнайте свой chat_id c помощью бота @userinfobot и выполните запрос (для прохождения запроса в телеграм, возможно, потребуется VPN):
```
POST http://localhost:3001/notifications/send
content-type: application/json;
{
  "message": "Тестовое сообщение",
  "chatId": <Ваш chat_id>
}
```
Бот @nestjs_notifications_bot должен переслать вам сообщение.

4. Отправьте запрос:
```
POST http://localhost:3002/events
content-type: application/json;
{
  "event": "customEvent2",
  "comment": "Какое-то событие"
}
```
В логах должны появиться сообщения,что событие отправлено продюсером и обработано консюмером:
```
producer-service  | [Nest] 68  - 05/05/2026, 8:36:03 PM     LOG [ProducerService] Сообщение с id=046d4a61-9e06-4353-b694-258836765c22 отправлено
consumer-service  | [Nest] 70  - 05/05/2026, 8:36:12 PM     LOG [ConsumerService] Сообщение обработано id=046d4a61-9e06-4353-b694-258836765c22
```
5. Остановите все сервисы
```
docker-compose down
```

## 🧪 Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## 🚀 Deployment

### Docker

Каждое приложение имеет собственный Dockerfile для контейнеризации:

```bash
# Build telegram-notifications image
docker build -t telegram-notifications:latest -f apps/telegram-notifications/Dockerfile .

# Run container
docker run -d -p 3001:3001 \
  -e TELEGRAM_API_TOKEN=your_token \
  telegram-notifications:latest
```

### Production deployment

Для production развертывания рекомендуется использовать Docker Compose или Kubernetes.

**Environment variables required:**
- `TELEGRAM_API_TOKEN` - Telegram Bot API token


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).