// ===================
// © AngelaMos | 2026
// seed.js
// ===================

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions/v2');
const admin = require('firebase-admin');

const { ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID } = require('./config');
const { verifyAdminToken } = require('./util');
const seedEventsData = require('./seed-data');

exports.seedEvents = onCall(
  { cors: true, secrets: [ADMIN_SIGNING_KEY, TELEGRAM_ADMIN_CHAT_ID] },
  async (request) => {
    const { bootstrap, adminToken } = request.data || {};
    const db = admin.firestore();

    const existing = await db.collection('events').limit(1).get();
    const alreadySeeded = !existing.empty;

    if (alreadySeeded) {
      if (!adminToken) throw new HttpsError('already-exists', 'Events already seeded');
      const secret = ADMIN_SIGNING_KEY.value();
      const expectedChatId = TELEGRAM_ADMIN_CHAT_ID.value();
      const verified = verifyAdminToken({ secret, token: adminToken });
      if (!verified || verified.chatId !== expectedChatId) {
        throw new HttpsError('permission-denied', 'Admin token required to re-seed');
      }
    } else if (bootstrap !== true) {
      throw new HttpsError('invalid-argument', 'Pass { bootstrap: true } to seed an empty database');
    }

    const batch = db.batch();
    let count = 0;
    for (const ev of seedEventsData) {
      const ref = db.collection('events').doc();
      batch.set(ref, {
        ...ev,
        status: 'published',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    }
    await batch.commit();

    await db.doc('config/public').set(
      {
        bookingLocked: false,
        lastLockChangeAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    logger.info('Seeded events', { count });
    return { ok: true, count };
  }
);
