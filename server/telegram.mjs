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
      throw new Error(data.description || `Telegram ${method} ${res.status}`);
    }
    return data.result;
  });
}

function emptyCache() {
  return { ids: [], users: {} };
}

function readCache() {
  if (!existsSync(CACHE)) return emptyCache();
  try {
    const raw = JSON.parse(readFileSync(CACHE, 'utf8'));
    if (Array.isArray(raw.ids)) return { ids: raw.ids.map(String), users: raw.users || {} };
    // eski format: { username: chatId }
    const users = {};
    const ids = [];
    for (const [k, v] of Object.entries(raw || {})) {
      if (!v) continue;
      users[String(k).toLowerCase()] = String(v);
      ids.push(String(v));
    }
    return { ids: [...new Set(ids)], users };
  } catch {
    return emptyCache();
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

function rememberChat(chatId, username) {
  const id = String(chatId || '').trim();
  if (!id) return false;
  const cache = readCache();
  let changed = false;
  if (!cache.ids.includes(id)) {
    cache.ids.push(id);
    changed = true;
  }
  const name = String(username || '')
    .replace(/^@/, '')
    .toLowerCase();
  if (name && cache.users[name] !== id) {
    cache.users[name] = id;
    changed = true;
  }
  if (changed) writeCache(cache);
  return changed;
}

export function recipientIds(cache = readCache()) {
  const { chatIds } = telegramConfig();
  return [...new Set([...chatIds.map(String), ...cache.ids])];
}

export async function syncChatIds() {
  const { token } = telegramConfig();
  if (!token) return readCache();
  const updates = await api(token, 'getUpdates', { limit: 100, allowed_updates: ['message'] }).catch(() => []);
  for (const upd of updates || []) {
    const msg = upd.message;
    if (!msg?.chat?.id) continue;
    rememberChat(msg.chat.id, msg.from?.username);
  }
  return readCache();
}

export function startTelegramPolling() {
  const { token } = telegramConfig();
  if (!token) {
    console.warn('[telegram] token yo‘q — polling o‘chiq');
    return;
  }

  let offset = 0;
  const tick = async () => {
    try {
      const updates = await api(token, 'getUpdates', {
        timeout: 25,
        offset,
        allowed_updates: ['message'],
      });
      for (const upd of updates || []) {
        offset = Math.max(offset, (upd.update_id || 0) + 1);
        const msg = upd.message;
        if (!msg?.chat?.id) continue;
        const saved = rememberChat(msg.chat.id, msg.from?.username);
        const text = String(msg.text || '');
        if (saved) {
          console.log('[telegram] saqlandi', msg.from?.username || msg.chat.id);
        }
        if (saved || /^\/start/i.test(text)) {
          await api(token, 'sendMessage', {
            chat_id: msg.chat.id,
            text: 'Qabul qilindi. Endi to‘y javoblari shu yerga keladi.',
          }).catch((e) => console.error('[telegram] welcome', e.message));
        }
      }
    } catch (err) {
      console.error('[telegram] poll', err instanceof Error ? err.message : err);
      await new Promise((r) => setTimeout(r, 4000));
    }
    setTimeout(tick, 300);
  };

  tick();
  console.log('[telegram] polling yoqildi');
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
  const { token } = telegramConfig();
  if (!token) throw new Error('Bot token qo‘yilmagan. .env ichiga TELEGRAM_BOT_TOKEN yozing.');

  const ids = recipientIds();
  if (ids.length === 0) {
    throw new Error('Botni ochib Start bosing: https://t.me/toyonakunbot');
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
