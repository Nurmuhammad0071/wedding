# Doston va Falina — To‘y taklifnomasi

Premium digital wedding invitation (Vite + React).

## Lokal

```bash
npm install
npm run dev
```

Telegram bot token faqat `.env`da turadi (gitga kirmaydi).

```bash
cp .env.example .env
# TELEGRAM_BOT_TOKEN ni yozing
# Zarina va Nurmuhammad botga /start bosadi
npm run telegram:setup
```

## Production

```bash
npm ci
npm run build
PORT=5174 HOST=127.0.0.1 node server/prod.mjs
```
