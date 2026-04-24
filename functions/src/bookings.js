// ===================
// © AngelaMos | 2026
// bookings.js
// ===================

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/v2');
const admin = require('firebase-admin');

const { TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID } = require('./config');
const tg = require('./telegramService');
const {
  normalizeTikTokUsername,
  isValidDateString,
  escapeHtml,
  checkAndIncrementRateLimit
} = require('./util');

exports.createBooking = onCall(
  { cors: true },
  async (request) => {
    const { date, tiktokUsername, honeypot } = request.data || {};

    if (honeypot) {
      logger.warn('Booking honeypot triggered', { ip: request.rawRequest?.ip });
      return { ok: true, bookingId: 'ignored' };
    }

    if (!isValidDateString(date)) {
      throw new HttpsError('invalid-argument', 'Invalid date');
    }

    const normalized = normalizeTikTokUsername(tiktokUsername);
    if (!normalized) {
      throw new HttpsError('invalid-argument', 'Invalid TikTok username');
    }

    const db = admin.firestore();

    const configSnap = await db.doc('config/public').get();
    if (configSnap.exists && configSnap.data().bookingLocked === true) {
      throw new HttpsError('failed-precondition', 'Booking is currently paused');
    }

    const ip = request.rawRequest?.ip || request.rawRequest?.headers?.['x-forwarded-for']?.split(',')[0] || 'unknown';
    const rl = await checkAndIncrementRateLimit({
      bucketId: `booking_ip_${ip.replace(/[^a-zA-Z0-9]/g, '_')}`,
      windowSeconds: 3600,
      maxHits: 8
    });
    if (!rl.allowed) {
      throw new HttpsError('resource-exhausted', `Please wait ${rl.retryAfterSeconds}s before trying again`);
    }

    const existingEventSnap = await db
      .collection('events')
      .where('date', '==', date)
      .where('dayType', '==', 'guest')
      .where('status', 'in', ['pending', 'published'])
      .limit(1)
      .get();

    if (!existingEventSnap.empty) {
      throw new HttpsError('already-exists', 'That date already has a pending or scheduled guest');
    }

    const bookingRef = db.collection('bookings').doc();
    const eventRef = db.collection('events').doc();

    const batch = db.batch();
    batch.set(bookingRef, {
      date,
      tiktokUsername: normalized,
      status: 'pending',
      ip,
      eventId: eventRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    batch.set(eventRef, {
      date,
      dayType: 'guest',
      status: 'pending',
      guests: [
        {
          name: normalized,
          tiktokUrl: `https://www.tiktok.com/@${normalized}`,
          headshot: '',
          topic: ''
        }
      ],
      bookingId: bookingRef.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await batch.commit();

    logger.info('Booking + pending event created', { bookingId: bookingRef.id, eventId: eventRef.id, date });
    return { ok: true, bookingId: bookingRef.id };
  }
);

exports.onBookingCreated = onDocumentCreated(
  {
    document: 'bookings/{bookingId}',
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID]
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();
    const bookingId = event.params.bookingId;

    const token = TELEGRAM_BOT_TOKEN.value();
    const chatId = TELEGRAM_ADMIN_CHAT_ID.value();
    if (!token || !chatId) {
      logger.warn('Telegram not configured — skipping notification');
      return;
    }

    const username = escapeHtml(data.tiktokUsername);
    const date = escapeHtml(data.date);

    const text = [
      '<b>📅 New booking request</b>',
      '',
      `<b>TikTok:</b> <a href="https://www.tiktok.com/@${username}">@${username}</a>`,
      `<b>Date:</b> ${date}`,
      '',
      `<i>Booking ID:</i> <code>${bookingId}</code>`
    ].join('\n');

    const replyMarkup = tg.inlineKeyboard([
      [
        { text: '✅ Approve', callback_data: `approve:${bookingId}` },
        { text: '❌ Reject', callback_data: `reject:${bookingId}` }
      ]
    ]);

    try {
      const msg = await tg.sendMessage({ token, chatId, text, replyMarkup });
      await snap.ref.update({ telegramMessageId: msg.message_id });
    } catch (err) {
      logger.error('Failed to send Telegram notification', err);
    }
  }
);
