import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { telegramConfig } from './env.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = resolve(ROOT, 'server/.chat-ids.json');

function api(token, method, body) {
  return fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      const msg = data.description || `Telegram ${method} ${res.status}`;
      throw new Error(msg);
    }
    return data.result;
  });
}

function readCache() {
  if (!existsSync(CACHE)) return {};
  try {
    return JSON.parse(readFileSync(CACHE, 'utf8'));
  } catch {
    return {};
  }
}

function writeCache(map) {
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(map, null, 2));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Pull /start messages and remember chat ids for the configured usernames. */
export async function syncChatIds() {
  const { token, usernames } = telegramConfig();
  if (!token || usernames.length === 0) return readCache();

  const cache = readCache();
  await api(token, 'deleteWebhook', { drop_pending_updates: false }).catch(() => {});
  const updates = await api(token, 'getUpdates?limit=100').catch(() => []);
  for (const upd of updates) {
    const from = upd.message?.from || upd.my_chat_member?.from;
    const chat = upd.message?.chat || upd.my_chat_member?.chat;
    const username = from?.username?.toLowerCase();
    if (!username || !chat?.id) continue;
    if (usernames.includes(username)) {
      cache[username] = String(chat.id);
    }
  }
  writeCache(cache);
  return cache;
}

export function recipientIds(cache = readCache()) {
  const { usernames, chatIds } = telegramConfig();
  const fromNames = usernames.map((u) => cache[u]).filter(Boolean);
  return [...new Set([...chatIds, ...fromNames])];
}

export async function getBot() {
  const { token } = telegramConfig();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN bo‘sh');
  return api(token, 'getMe');
}

export function formatRsvp({ name, attending, guests, message }) {
  const keladi = attending === 'yes' ? 'Keladi' : 'Kela olmaydi';
  const count = attending === 'yes' ? String(guests ?? 1) : '—';
  const note = message?.trim() ? escapeHtml(message.trim()) : '—';
  const when = new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  return [
    '<b>To‘y javobi</b>',
    '',
    `<b>Ism:</b> ${escapeHtml(name)}`,
    `<b>Javob:</b> ${keladi}`,
    `<b>Mehmonlar:</b> ${escapeHtml(count)}`,
    `<b>Izoh:</b> ${note}`,
    '',
    `<i>${escapeHtml(when)}</i>`,
  ].join('\n');
}

export async function sendRsvpToRecipients(payload) {
  const { token, usernames } = telegramConfig();
  if (!token) throw new Error('Bot token qo‘yilmagan. .env ichiga TELEGRAM_BOT_TOKEN yozing.');

  const cache = await syncChatIds();
  const ids = recipientIds(cache);
  if (ids.length === 0) {
    const need = usernames.map((u) => `@${u}`).join(' va ');
    throw new Error(
      `${need} botni ochib /start bosishi kerak. Keyin: npm run telegram:setup`,
    );
  }

  const text = formatRsvp(payload);
  const results = await Promise.allSettled(
    ids.map((chat_id) =>
      api(token, 'sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    ),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  if (sent === 0) {
    const err = results.find((r) => r.status === 'rejected');
    throw new Error(err?.reason?.message || 'Telegramga yuborilmadi');
  }
  return { sent, total: ids.length };
}
