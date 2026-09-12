import { sendRsvpToRecipients } from './telegram.mjs';

const hits = new Map();

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function limited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (list.length >= 6) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 8000) {
        reject(new Error('Juda katta so‘rov'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function validate(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('Noto‘g‘ri ma’lumot');
  const name = String(raw.name ?? '').trim();
  const attending = raw.attending === 'yes' || raw.attending === 'no' ? raw.attending : null;
  const guests = Number(raw.guests ?? 0);
  const message = String(raw.message ?? '').trim();
  if (name.length < 2 || name.length > 80) throw new Error('Ismni to‘g‘ri yozing');
  if (!attending) throw new Error('Javobni tanlang');
  if (!Number.isFinite(guests) || guests < 0 || guests > 8) throw new Error('Mehmonlar soni noto‘g‘ri');
  if (message.length > 500) throw new Error('Izoh juda uzun');
  return { name, attending, guests: attending === 'yes' ? Math.max(1, Math.floor(guests)) : 0, message };
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

/** Connect-style middleware for POST /api/rsvp */
export async function handleRsvp(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'Faqat POST' });
    return;
  }
  if (limited(clientIp(req))) {
    json(res, 429, { ok: false, error: 'Birozdan keyin qayta yuboring' });
    return;
  }

  try {
    const payload = validate(JSON.parse((await readBody(req)) || '{}'));
    const result = await sendRsvpToRecipients(payload);
    json(res, 200, { ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Xatolik';
    const status = /token|start|Telegram/i.test(msg) ? 502 : 400;
    console.error('[rsvp]', msg);
    json(res, status, { ok: false, error: msg });
  }
}
