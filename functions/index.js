// ===================
// © AngelaMos | 2026
// index.js
// ===================

const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

const bookings = require('./src/bookings');
const telegramBot = require('./src/telegramBot');
const adminApi = require('./src/admin');
const seed = require('./src/seed');

exports.createBooking = bookings.createBooking;
exports.onBookingCreated = bookings.onBookingCreated;

exports.telegramWebhook = telegramBot.telegramWebhook;

exports.adminListBookings = adminApi.adminListBookings;
exports.adminDeleteBooking = adminApi.adminDeleteBooking;
exports.adminSetLock = adminApi.adminSetLock;
exports.adminListEvents = adminApi.adminListEvents;
exports.adminDeleteEvent = adminApi.adminDeleteEvent;

exports.seedEvents = seed.seedEvents;
exports.registerTelegramWebhook = telegramBot.registerTelegramWebhook;
