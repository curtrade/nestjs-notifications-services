# Producer Microservice

Микросервис для приёма HTTP-запросов и публикации событий в очередь RabbitMQ. Построен на базе NestJS.

## API Endpoints

### POST /events

Создание нового события и отправка его в очередь RabbitMQ.

#### Request Body
```json
{
  "event": "user.created",
  "comment": "Необязательный комментарий"
}
```

#### Параметры
- `event` (string, required) — название события (1–50 символов)
- `comment` (string, optional) — произвольный комментарий (1–4096 символов)

#### Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "event": "user.created",
  "comment": "Необязательный комментарий"
}
```

### GET /health

Проверка работоспособности микросервиса.

#### Response (200 OK)
```json
{
  "status": "ok"
}
```

## Формат сообщения в RabbitMQ

При успешной публикации в очередь отправляется JSON-сообщение следующего вида:

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

- `id` (string) — UUID сообщения (генерируется автоматически)
- `action` (string) — тип действия: `create` | `update` | `delete`
- `data.id` (string) — UUID созданной сущности
- `data.event` (string) — название события
- `data.comment` (string, optional) — комментарий

Сообщения отправляются с флагом `persistent: true`. При невозможности доставки после исчерпания попыток сообщение попадает в dead-letter очередь `<QUEUE>.dead`.

## Переменные окружения

| Переменная                   | Обязательная | По умолчанию | Описание                                      |
|------------------------------|:------------:|:------------:|-----------------------------------------------|
| `RABBITMQ_URL`               | да           | —            | URL подключения к RabbitMQ                    |
| `QUEUE`                      | да           | —            | Имя очереди                                   |
| `RETRIES`                    | нет          | `3`          | Количество попыток отправки сообщения         |
| `ATTEMPT_DELAY_MULTIPLICATOR`| нет          | `1000`       | Множитель задержки между попытками (мс)       |
| `PORT`                       | нет          | `3002`       | HTTP-порт микросервиса                        |

## Docker

```bash
# Сборка образа
docker build -t producer:latest -f apps/producer/Dockerfile .

# Запуск контейнера
docker run -d -p 3002:3002 \
  -e RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672 \
  -e QUEUE=notifications \
  producer:latest
```