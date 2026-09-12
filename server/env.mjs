import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** Load KEY=value pairs from a .env file into process.env (does not overwrite). */
export function loadEnv(root = process.cwd()) {
  const file = resolve(root, '.env');
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function telegramConfig() {
  const token = (process.env.TELEGRAM_BOT_TOKEN ?? '').trim();
  const usernames = (process.env.TELEGRAM_USERNAMES ?? '')
    .split(',')
    .map((s) => s.trim().replace(/^@/, '').toLowerCase())
    .filter(Boolean);
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { token, usernames, chatIds };
}
