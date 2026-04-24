// ===================
// © AngelaMos | 2026
// telegramService.js
// ===================

const API_BASE = 'https://api.telegram.org/bot';

async function tgCall(token, method, payload) {
  const res = await fetch(`${API_BASE}${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description || res.status}`);
  }
  return data.result;
}

async function sendMessage({ token, chatId, text, replyMarkup, replyToMessageId }) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  if (replyToMessageId) payload.reply_parameters = { message_id: replyToMessageId };
  return tgCall(token, 'sendMessage', payload);
}

async function editMessageText({ token, chatId, messageId, text, replyMarkup }) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return tgCall(token, 'editMessageText', payload);
}

async function answerCallbackQuery({ token, callbackQueryId, text, showAlert }) {
  const payload = { callback_query_id: callbackQueryId };
  if (text) payload.text = text;
  if (showAlert) payload.show_alert = true;
  return tgCall(token, 'answerCallbackQuery', payload);
}

async function setWebhook({ token, url, secretToken }) {
  const payload = {
    url,
    secret_token: secretToken,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true
  };
  return tgCall(token, 'setWebhook', payload);
}

async function getMe({ token }) {
  return tgCall(token, 'getMe', {});
}

function inlineKeyboard(rows) {
  return { inline_keyboard: rows };
}

module.exports = {
  sendMessage,
  editMessageText,
  answerCallbackQuery,
  setWebhook,
  getMe,
  inlineKeyboard
};
