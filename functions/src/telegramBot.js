// ===================
// © AngelaMos | 2026
// telegramBot.js
// ===================

const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions/v2');
const admin = require('firebase-admin');

const {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_ADMIN_CHAT_ID,
  TELEGRAM_WEBHOOK_SECRET,
  ADMIN_SIGNING_KEY,
  PUBLIC_SITE_URL
} = require('./config');
const tg = require('./telegramService');
const { escapeHtml, signAdminToken } = require('./util');

const SESSION_TTL_MS = 10 * 60 * 1000;
const ADMIN_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

async function getSession(chatId) {
  const db = admin.firestore();
  const snap = await db.doc(`telegramSessions/${chatId}`).get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (data.expiresAt && data.expiresAt < Date.now()) return null;
  return data;
}

async function setSession(chatId, awaiting, bookingId) {
  const db = admin.firestore();
  await db.doc(`telegramSessions/${chatId}`).set({
    awaiting,
    bookingId,
    expiresAt: Date.now() + SESSION_TTL_MS
  });
}

async function clearSession(chatId) {
  const db = admin.firestore();
  await db.doc(`telegramSessions/${chatId}`).delete().catch(() => {});
}

async function handleCallbackQuery(update, token, adminChatId) {
  const cq = update.callback_query;
  const chatId = String(cq.message.chat.id);
  if (chatId !== adminChatId) {
    await tg.answerCallbackQuery({ token, callbackQueryId: cq.id, text: 'Not authorized', showAlert: true });
    return;
  }

  const [action, bookingId] = (cq.data || '').split(':');
  const db = admin.firestore();
  const bookingRef = db.collection('bookings').doc(bookingId);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) {
    await tg.answerCallbackQuery({ token, callbackQueryId: cq.id, text: 'Booking not found', showAlert: true });
    return;
  }
  const booking = bookingSnap.data();

  if (action === 'approve') {
    await bookingRef.update({
      status: 'approved',
      decidedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (booking.eventId) {
      await db.collection('events').doc(booking.eventId).update({ status: 'published' });
    }

    await setSession(chatId, 'topic', bookingId);

    await tg.editMessageText({
      token,
      chatId,
      messageId: cq.message.message_id,
      text:
        `✅ <b>Approved</b> — @${escapeHtml(booking.tiktokUsername)} on ${escapeHtml(booking.date)}\n\n` +
        `Reply with the <b>topic</b> for this guest (one line).\n` +
        `Or send /skip to fill later.`
    });
    await tg.answerCallbackQuery({ token, callbackQueryId: cq.id, text: 'Approved' });
    return;
  }

  if (action === 'reject') {
    await bookingRef.update({
      status: 'rejected',
      decidedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    if (booking.eventId) {
      await db.collection('events').doc(booking.eventId).delete().catch(() => {});
    }
    await tg.editMessageText({
      token,
      chatId,
      messageId: cq.message.message_id,
      text: `❌ <b>Rejected</b> — @${escapeHtml(booking.tiktokUsername)} on ${escapeHtml(booking.date)}`
    });
    await tg.answerCallbackQuery({ token, callbackQueryId: cq.id, text: 'Rejected' });
    return;
  }

  await tg.answerCallbackQuery({ token, callbackQueryId: cq.id, text: 'Unknown action' });
}

async function handleMessage(update, token, adminChatId) {
  const msg = update.message;
  const chatId = String(msg.chat.id);
  if (chatId !== adminChatId) {
    await tg.sendMessage({
      token,
      chatId,
      text: "Sorry, this bot is private. If you're trying to book Nate, use the site."
    });
    return;
  }

  const text = (msg.text || '').trim();
  if (!text) return;

  if (text.startsWith('/')) {
    await handleCommand(text, chatId, token, msg);
    return;
  }

  const session = await getSession(chatId);
  if (!session) {
    await tg.sendMessage({
      token,
      chatId,
      text:
        'Hey Nate 👋\n\nCommands:\n' +
        '/list — upcoming bookings\n' +
        '/lock — pause public booking\n' +
        '/unlock — resume public booking\n' +
        '/admin — get admin page link\n' +
        '/whoami — show this chat ID'
    });
    return;
  }

  const db = admin.firestore();
  const bookingRef = db.collection('bookings').doc(session.bookingId);
  const bookingSnap = await bookingRef.get();
  if (!bookingSnap.exists) {
    await clearSession(chatId);
    await tg.sendMessage({ token, chatId, text: 'That booking vanished. Start over from the original request.' });
    return;
  }
  const booking = bookingSnap.data();

  if (session.awaiting === 'topic') {
    const topic = text.slice(0, 200);
    await bookingRef.update({ topic });
    if (booking.eventId) {
      const eventRef = db.collection('events').doc(booking.eventId);
      const eventSnap = await eventRef.get();
      if (eventSnap.exists) {
        const guests = (eventSnap.data().guests || []).map((g, i) => (i === 0 ? { ...g, topic } : g));
        await eventRef.update({ guests });
      }
    }
    await setSession(chatId, 'headshot', session.bookingId);
    await tg.sendMessage({
      token,
      chatId,
      text:
        `Topic saved: <i>${escapeHtml(topic)}</i>\n\n` +
        `Now paste a <b>headshot URL</b> (must end in .png/.jpg/.jpeg/.webp).\n` +
        `Or send /skip to finish without one.`
    });
    return;
  }

  if (session.awaiting === 'headshot') {
    if (!/^https?:\/\/\S+\.(png|jpg|jpeg|webp)(\?\S*)?$/i.test(text)) {
      await tg.sendMessage({
        token,
        chatId,
        text: 'That doesn\'t look like an image URL. Try again, or /skip.'
      });
      return;
    }
    await bookingRef.update({ headshot: text });
    if (booking.eventId) {
      const eventRef = db.collection('events').doc(booking.eventId);
      const eventSnap = await eventRef.get();
      if (eventSnap.exists) {
        const guests = (eventSnap.data().guests || []).map((g, i) => (i === 0 ? { ...g, headshot: text } : g));
        await eventRef.update({ guests });
      }
    }
    await clearSession(chatId);
    await tg.sendMessage({
      token,
      chatId,
      text: `✅ Live on site — @${escapeHtml(booking.tiktokUsername)} on ${escapeHtml(booking.date)}.`
    });
    return;
  }
}

async function handleCommand(text, chatId, token, msg) {
  const db = admin.firestore();
  const [cmd, ...args] = text.split(/\s+/);

  if (cmd === '/start' || cmd === '/help') {
    await tg.sendMessage({
      token,
      chatId,
      text:
        '<b>Cyber Talks bot</b>\n\n' +
        '/list — upcoming bookings\n' +
        '/lock — pause public booking\n' +
        '/unlock — resume public booking\n' +
        '/admin — get admin page magic link\n' +
        '/skip — skip current step\n' +
        '/whoami — show this chat ID'
    });
    return;
  }

  if (cmd === '/whoami') {
    await tg.sendMessage({
      token,
      chatId,
      text: `Chat ID: <code>${chatId}</code>`
    });
    return;
  }

  if (cmd === '/list') {
    const snap = await db
      .collection('bookings')
      .where('status', 'in', ['pending', 'approved'])
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();

    if (snap.empty) {
      await tg.sendMessage({ token, chatId, text: 'No bookings.' });
      return;
    }

    const lines = snap.docs.map((doc) => {
      const b = doc.data();
      const emoji = b.status === 'approved' ? '✅' : '⏳';
      return `${emoji} ${escapeHtml(b.date)} — @${escapeHtml(b.tiktokUsername)}`;
    });
    await tg.sendMessage({ token, chatId, text: lines.join('\n') });
    return;
  }

  if (cmd === '/lock') {
    await db.doc('config/public').set(
      { bookingLocked: true, lastLockChangeAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    await tg.sendMessage({ token, chatId, text: '🔒 Public booking paused.' });
    return;
  }

  if (cmd === '/unlock') {
    await db.doc('config/public').set(
      { bookingLocked: false, lastLockChangeAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    await tg.sendMessage({ token, chatId, text: '🔓 Public booking resumed.' });
    return;
  }

  if (cmd === '/admin') {
    const secret = ADMIN_SIGNING_KEY.value();
    const expiresAt = Date.now() + ADMIN_TOKEN_TTL_MS;
    const token2 = signAdminToken({ secret, chatId, expiresAt });
    const url = `${PUBLIC_SITE_URL.value()}/admin?t=${encodeURIComponent(token2)}`;
    await tg.sendMessage({
      token,
      chatId,
      text: `🔑 Admin link (30 days):\n<a href="${url}">${url}</a>`
    });
    return;
  }

  if (cmd === '/skip') {
    const session = await getSession(chatId);
    if (!session) {
      await tg.sendMessage({ token, chatId, text: 'Nothing to skip.' });
      return;
    }
    if (session.awaiting === 'topic') {
      await setSession(chatId, 'headshot', session.bookingId);
      await tg.sendMessage({
        token,
        chatId,
        text: 'Topic skipped. Paste a headshot URL, or /skip again to finish.'
      });
    } else if (session.awaiting === 'headshot') {
      await clearSession(chatId);
      await tg.sendMessage({ token, chatId, text: '✅ Done. You can edit later via /admin.' });
    }
    return;
  }

  await tg.sendMessage({ token, chatId, text: `Unknown command: ${escapeHtml(cmd)}. Try /help.` });
}

exports.telegramWebhook = onRequest(
  {
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, TELEGRAM_WEBHOOK_SECRET, ADMIN_SIGNING_KEY],
    cors: false
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const expectedSecret = TELEGRAM_WEBHOOK_SECRET.value();
    const providedSecret = req.get('X-Telegram-Bot-Api-Secret-Token');
    if (expectedSecret && providedSecret !== expectedSecret) {
      res.status(401).send('Unauthorized');
      return;
    }

    const token = TELEGRAM_BOT_TOKEN.value();
    const adminChatId = TELEGRAM_ADMIN_CHAT_ID.value();
    if (!token || !adminChatId) {
      logger.error('Telegram env not configured');
      res.status(200).send('ok');
      return;
    }

    const update = req.body;
    try {
      if (update.callback_query) {
        await handleCallbackQuery(update, token, adminChatId);
      } else if (update.message) {
        await handleMessage(update, token, adminChatId);
      }
    } catch (err) {
      logger.error('Webhook handler error', err);
    }
    res.status(200).send('ok');
  }
);

exports.registerTelegramWebhook = onCall(
  {
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET]
  },
  async (request) => {
    const { webhookUrl } = request.data || {};
    if (typeof webhookUrl !== 'string' || !webhookUrl.startsWith('https://')) {
      throw new HttpsError('invalid-argument', 'webhookUrl must be https');
    }
    const token = TELEGRAM_BOT_TOKEN.value();
    const secret = TELEGRAM_WEBHOOK_SECRET.value();
    if (!token || !secret) {
      throw new HttpsError('failed-precondition', 'Telegram secrets not set');
    }
    const result = await tg.setWebhook({ token, url: webhookUrl, secretToken: secret });
    const me = await tg.getMe({ token });
    return { ok: true, webhook: result, bot: me };
  }
);
