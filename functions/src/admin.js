// ===================
// © AngelaMos | 2026
// admin.js
// ===================

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

const { ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID } = require('./config');
const { verifyAdminToken } = require('./util');

function requireAdminAuth(request) {
  const token = request.data && request.data.adminToken;
  const secret = ADMIN_SIGNING_KEY.value();
  const expectedChatId = TELEGRAM_ADMIN_CHAT_ID.value();
  if (!secret) throw new HttpsError('failed-precondition', 'Admin not configured');
  const verified = verifyAdminToken({ secret, token });
  if (!verified) throw new HttpsError('unauthenticated', 'Invalid or expired admin token');
  if (verified.chatId !== expectedChatId) throw new HttpsError('permission-denied', 'Not admin');
  return verified;
}

exports.adminListBookings = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    requireAdminAuth(request);
    const db = admin.firestore();
    const snap = await db.collection('bookings').orderBy('createdAt', 'desc').limit(100).get();
    return {
      bookings: snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          date: data.date,
          tiktokUsername: data.tiktokUsername,
          status: data.status,
          topic: data.topic || null,
          headshot: data.headshot || null,
          createdAt: data.createdAt?.toMillis?.() || null,
          decidedAt: data.decidedAt?.toMillis?.() || null
        };
      })
    };
  }
);

exports.adminDeleteBooking = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    requireAdminAuth(request);
    const { bookingId } = request.data;
    if (typeof bookingId !== 'string') throw new HttpsError('invalid-argument', 'bookingId required');
    const db = admin.firestore();
    const snap = await db.collection('bookings').doc(bookingId).get();
    if (!snap.exists) return { ok: true };
    const data = snap.data();
    if (data.eventId) {
      await db.collection('events').doc(data.eventId).delete().catch(() => {});
    }
    await snap.ref.delete();
    return { ok: true };
  }
);

exports.adminSetLock = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    requireAdminAuth(request);
    const { locked } = request.data;
    if (typeof locked !== 'boolean') throw new HttpsError('invalid-argument', 'locked must be boolean');
    const db = admin.firestore();
    await db.doc('config/public').set(
      { bookingLocked: locked, lastLockChangeAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    return { ok: true, locked };
  }
);

exports.adminListEvents = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    requireAdminAuth(request);
    const db = admin.firestore();
    const snap = await db.collection('events').orderBy('date', 'asc').limit(200).get();
    return {
      events: snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    };
  }
);

exports.adminDeleteEvent = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    requireAdminAuth(request);
    const { eventId } = request.data;
    if (typeof eventId !== 'string') throw new HttpsError('invalid-argument', 'eventId required');
    const db = admin.firestore();
    await db.collection('events').doc(eventId).delete();
    return { ok: true };
  }
);
