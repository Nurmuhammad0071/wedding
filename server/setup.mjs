import { loadEnv, telegramConfig } from './env.mjs';
import { getBot, syncChatIds, recipientIds } from './telegram.mjs';

loadEnv();

const { token, usernames } = telegramConfig();
if (!token) {
  console.error('Avval .env ga TELEGRAM_BOT_TOKEN yozing.');
  process.exit(1);
}

const bot = await getBot();
console.log(`Bot: @${bot.username}`);
console.log(`Havola: https://t.me/${bot.username}`);
console.log('');
console.log('Qadamlar:');
console.log(`  1. @Zarina_Pirimqulova va @Nurmuhammad0071 shu botni ochib /start bosadi.`);
console.log('  2. Shu skript ularni topadi va chat id ni saqlaydi.');
console.log('');

const deadline = Date.now() + 90_000;
let last = '';

while (Date.now() < deadline) {
  const cache = await syncChatIds();
  const found = usernames.filter((u) => cache[u]);
  const line = found.length
    ? `Topildi: ${found.map((u) => `@${u} → ${cache[u]}`).join(', ')}`
    : 'Hali /start bosilmagan…';
  if (line !== last) {
    console.log(line);
    last = line;
  }
  if (found.length === usernames.length && recipientIds(cache).length >= usernames.length) {
    console.log('\nTayyor. Endi forma javoblari shu ikkala chatga ketadi.');
    process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 2500));
}

console.error('\nVaqt tugadi. Ikkala odam botga /start bosganini tekshiring, keyin qayta ishga tushiring:');
console.error('  npm run telegram:setup');
process.exit(1);
