# Consumer Microservice

Микросервис для чтения и обработки событий из очереди RabbitMQ. Построен на базе NestJS.

## Принцип работы

Consumer подписывается на очередь RabbitMQ и обрабатывает сообщения по одному (`prefetch: 1`). При успешной обработке подтверждает сообщение (`ack`). При ошибке парсинга отклоняет без повторной постановки в очередь (`nack`) — сообщение попадает в dead-letter очередь `<QUEUE>.dead`. При разрыве соединения выполняет автоматическое переподключение.

## Ожидаемый формат сообщения

Consumer читает JSON-сообщения следующего формата (публикуемые сервисом Producer):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "action": "create",
  "data": {
    "id": "7f3c9a1b-12e4-4d5f-b678-9abc01234567",
    "event": "user.created",
    "comment": "Необязательный комментарий"
  }
}
```

- `id` (string) — UUID сообщения
- `action` (string) — тип действия: `create` | `update` | `delete`
- `data.id` (string) — UUID сущности
- `data.event` (string) — название события
- `data.comment` (string, optional) — комментарий

## API Endpoints

### GET /health

Проверка работоспособности микросервиса и подключения к RabbitMQ.

#### Response (200 OK)
```json
{
  "status": "ok",
  "info": {
    "rabbitmq": { "status": "up" }
  },
  "error": {},
  "details": {
    "rabbitmq": { "status": "up" }
  }
}
```

#### Response (503 Service Unavailable) — RabbitMQ недоступен
```json
{
  "status": "error",
  "info": {},
  "error": {
    "rabbitmq": { "status": "down" }
  },
  "details": {
    "rabbitmq": { "status": "down" }
  }
}
```

## Переменные окружения

| Переменная                   | Обязательная | По умолчанию | Описание                                      |
|------------------------------|:------------:|:------------:|-----------------------------------------------|
| `RABBITMQ_URL`               | да           | —            | URL подключения к RabbitMQ                    |
| `QUEUE`                      | да           | —            | Имя очереди                                   |
| `RETRIES`                    | нет          | `3`          | Количество попыток подключения к RabbitMQ     |
| `ATTEMPT_DELAY_MULTIPLICATOR`| нет          | `1000`       | Множитель задержки между попытками (мс)       |
| `PORT`                       | нет          | `3003`       | HTTP-порт микросервиса                        |

## Docker

```bash
# Сборка образа
docker build -t consumer:latest -f apps/consumer/Dockerfile .

# Запуск контейнера
docker run -d -p 3003:3003 \
  -e RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672 \
  -e QUEUE=notifications \
  consumer:latest
```