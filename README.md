# Настройка заявок через Telegram

Форма сайта отправляет заявки на серверный endpoint `/api/contact`, который обращается к Telegram Bot API. Токен бота никогда не передаётся в браузер.

## Создание бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. Отправьте команду `/newbot` и следуйте инструкциям.
3. Сохраните выданный токен в `TELEGRAM_BOT_TOKEN`.

## Получение TELEGRAM_CHAT_ID

1. Напишите созданному боту любое сообщение.
2. Откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates`.
3. Найдите значение `message.chat.id` и сохраните его в `TELEGRAM_CHAT_ID`.
4. Для группового чата добавьте бота в группу, отправьте сообщение и возьмите отрицательный `chat.id` из `getUpdates`.

## Переменные окружения

Для локальной разработки скопируйте `.env.example` в `.env.local` и заполните:

```env
TELEGRAM_BOT_TOKEN=токен_от_BotFather
TELEGRAM_CHAT_ID=id_чата
```

В Vercel добавьте эти же серверные переменные в **Settings → Environment Variables** для нужных окружений и затем выполните повторное развёртывание. Не используйте префикс `NEXT_PUBLIC_`.
