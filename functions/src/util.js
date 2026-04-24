// ===================
// © AngelaMos | 2026
// util.js
// ===================

const crypto = require('crypto');
const admin = require('firebase-admin');

function normalizeTikTokUsername(raw) {
  if (typeof raw !== 'string') return null;
  let u = raw.trim();
  if (u.startsWith('http')) {
    const m = u.match(/@([a-zA-Z0-9._-]+)/);
    if (m) u = m[1];
  }
  if (u.startsWith('@')) u = u.slice(1);
  if (!/^[a-zA-Z0-9._-]{2,30}$/.test(u)) return null;
  return u;
}

function isValidDateString(d) {
  return typeof d === 'string' && /^20[2-9][0-9]-[0-1][0-9]-[0-3][0-9]$/.test(d);
}

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function checkAndIncrementRateLimit({ bucketId, windowSeconds, maxHits }) {
  const db = admin.firestore();
  const ref = db.collection('rateLimits').doc(bucketId);
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const existing = snap.exists ? snap.data() : { hits: [] };
    const recentHits = (existing.hits || []).filter((ts) => ts > windowStart);
    if (recentHits.length >= maxHits) {
      return { allowed: false, retryAfterSeconds: Math.ceil((recentHits[0] + windowSeconds * 1000 - now) / 1000) };
    }
    recentHits.push(now);
    tx.set(ref, { hits: recentHits, updatedAt: now });
    return { allowed: true };
  });
}

function signAdminToken({ secret, chatId, expiresAt }) {
  const payload = `${chatId}.${expiresAt}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
  return `${payload}.${sig}`;
}

function verifyAdminToken({ secret, token }) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [chatId, expiresAtStr, sig] = parts;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${chatId}.${expiresAtStr}`)
    .digest('hex')
    .slice(0, 32);
  if (sig !== expected) return null;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  return { chatId, expiresAt };
}

function requestClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) {
    return fwd.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

module.exports = {
  normalizeTikTokUsername,
  isValidDateString,
  escapeHtml,
  checkAndIncrementRateLimit,
  signAdminToken,
  verifyAdminToken,
  requestClientIp
};
