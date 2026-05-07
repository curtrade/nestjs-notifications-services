# Telegram Notifications Microservice

Микросервис для отправки уведомлений в Telegram, построенный на базе NestJS.

## API Endpoints
yf
### POST /notifications/send

Отправка сообщения в Telegram.

#### Request Body
```json
{
  "message": "Сообщение для отправки",
  "chatId": "ID чата",
  "parseMode": "HTML|Markdown|MarkdownV2 (опционально)"
}
```

#### Параметры
- `message` (string, required) - Текст сообщения (1-4096 символов)
- `chatId` (string, required) - ID чата для отправки.
- `parseMode` (string, optional) - Режим разбора текста: HTML, Markdown или MarkdownV2

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Сообщение успешно отправлено",
  "messageId": 12345
}
```

### GET /notifications/health

Проверка работоспособности микросервиса.

#### Response (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Environment Variables

- `TELEGRAM_API_TOKEN` - Токен бота Telegram (обязательный)
- `PORT` - Порт для запуска микросервиса (по умолчанию 3001)

## Docker

```bash
# Сборка образа
docker build -t telegram-notifications:latest -f apps/telegram-notifications/Dockerfile .

# Запуск контейнера
docker run -d -p 3001:3001 \
  -e TELEGRAM_API_TOKEN=your_token \
  telegram-notifications:latest
```