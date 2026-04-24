// ===================
// © AngelaMos | 2026
// config.js
// ===================

const { defineSecret, defineString } = require('firebase-functions/params');

exports.TELEGRAM_BOT_TOKEN = defineSecret('TELEGRAM_BOT_TOKEN');
exports.TELEGRAM_ADMIN_CHAT_ID = defineSecret('TELEGRAM_ADMIN_CHAT_ID');
exports.TELEGRAM_WEBHOOK_SECRET = defineSecret('TELEGRAM_WEBHOOK_SECRET');
exports.ADMIN_SIGNING_KEY = defineSecret('ADMIN_SIGNING_KEY');

exports.PUBLIC_SITE_URL = defineString('PUBLIC_SITE_URL', {
  default: 'https://cybertalks-guest.web.app'
});
