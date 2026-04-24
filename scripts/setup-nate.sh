#!/usr/bin/env bash
# ===================
# © AngelaMos | 2026
# setup-nate.sh
# ===================
# One-time setup: bot secrets, webhook, seed data.

set -euo pipefail

echo ""
echo "============================================="
echo "  Cyber Talks Calendar — one-time setup"
echo "============================================="
echo ""

# ---- Preflight ----
if ! command -v firebase >/dev/null 2>&1; then
  echo "✗ firebase CLI not found. Install with: npm i -g firebase-tools (or pnpm add -g firebase-tools)"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "✗ curl not found."
  exit 1
fi

# ---- Project ----
PROJECT_ID=$(firebase projects:list --json 2>/dev/null | grep -o '"projectId":"[^"]*' | head -1 | cut -d'"' -f4 || true)
if [ -z "${PROJECT_ID:-}" ]; then
  echo "Run 'firebase login' first, then re-run this script."
  exit 1
fi

DEFAULT_PROJECT=$(grep -o '"default":[[:space:]]*"[^"]*' .firebaserc 2>/dev/null | cut -d'"' -f4 || echo "")
echo "Firebase project: ${DEFAULT_PROJECT:-<none in .firebaserc>}"
echo ""

# ---- Bot token ----
echo "Step 1 of 4 — Telegram bot token"
echo "  (Create a bot via @BotFather → /newbot → copy the token it gives you.)"
echo ""
read -r -p "  Paste bot token: " BOT_TOKEN
if [ -z "${BOT_TOKEN}" ]; then
  echo "✗ Token is empty. Aborting."
  exit 1
fi

# ---- Validate token ----
echo "  Checking token with Telegram…"
BOT_INFO=$(curl -sS "https://api.telegram.org/bot${BOT_TOKEN}/getMe")
if ! echo "${BOT_INFO}" | grep -q '"ok":true'; then
  echo "✗ Telegram rejected that token. Check and try again."
  echo "   ${BOT_INFO}"
  exit 1
fi
BOT_USERNAME=$(echo "${BOT_INFO}" | grep -o '"username":"[^"]*' | cut -d'"' -f4)
echo "  ✓ Bot: @${BOT_USERNAME}"
echo ""

# ---- Chat ID ----
echo "Step 2 of 4 — Chat ID"
echo "  Open Telegram and send ANY message (e.g. 'hi') to @${BOT_USERNAME}."
echo ""
read -r -p "  Sent a message? Press ENTER to continue…" _

UPDATES=$(curl -sS "https://api.telegram.org/bot${BOT_TOKEN}/getUpdates")
CHAT_ID=$(echo "${UPDATES}" | grep -oE '"chat":\{"id":-?[0-9]+' | head -1 | grep -oE '-?[0-9]+')

if [ -z "${CHAT_ID}" ]; then
  echo "✗ Couldn't find any messages to the bot. Make sure you sent one, then re-run."
  exit 1
fi
echo "  ✓ Chat ID: ${CHAT_ID}"
echo ""

# ---- Generate random secrets ----
gen_secret() { head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'; }

WEBHOOK_SECRET=$(gen_secret)
ADMIN_SIGNING_KEY=$(gen_secret)

# ---- Push secrets ----
echo "Step 3 of 4 — Storing secrets in Firebase"
printf '%s' "${BOT_TOKEN}"         | firebase functions:secrets:set TELEGRAM_BOT_TOKEN       --data-file - >/dev/null
printf '%s' "${CHAT_ID}"           | firebase functions:secrets:set TELEGRAM_ADMIN_CHAT_ID  --data-file - >/dev/null
printf '%s' "${WEBHOOK_SECRET}"    | firebase functions:secrets:set TELEGRAM_WEBHOOK_SECRET --data-file - >/dev/null
printf '%s' "${ADMIN_SIGNING_KEY}" | firebase functions:secrets:set ADMIN_SIGNING_KEY       --data-file - >/dev/null
echo "  ✓ Secrets stored"
echo ""

# ---- Deploy ----
echo "Step 4 of 4 — Deploying rules + functions + site"
firebase deploy --only firestore:rules,firestore:indexes,functions,hosting
echo ""

# ---- Register webhook ----
REGION="us-central1"
WEBHOOK_URL="https://${REGION}-${DEFAULT_PROJECT}.cloudfunctions.net/telegramWebhook"

SEED_URL="https://${REGION}-${DEFAULT_PROJECT}.cloudfunctions.net/seedEvents"
echo "Seeding events (idempotent — safe to re-run)…"
SEED_RES=$(curl -sS -X POST -H "Content-Type: application/json" "${SEED_URL}" -d '{"data":{"bootstrap":true}}' || true)
if echo "${SEED_RES}" | grep -q '"result"'; then
  echo "  ✓ Seed complete"
else
  echo "  (Seed skipped or already populated: ${SEED_RES})"
fi
echo ""

echo "Registering Telegram webhook → ${WEBHOOK_URL}"
WEBHOOK_RES=$(curl -sS -X POST \
  "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"${WEBHOOK_URL}\",\"secret_token\":\"${WEBHOOK_SECRET}\",\"allowed_updates\":[\"message\",\"callback_query\"],\"drop_pending_updates\":true}")

if ! echo "${WEBHOOK_RES}" | grep -q '"ok":true'; then
  echo "✗ Failed to register webhook:"
  echo "  ${WEBHOOK_RES}"
  exit 1
fi
echo "  ✓ Webhook live"
echo ""

# ---- Done ----
echo "============================================="
echo "  ✅ All done."
echo "============================================="
echo ""
echo "Next:"
echo "  1. Open Telegram → @${BOT_USERNAME}"
echo "  2. Send /start to see commands"
echo "  3. Send /admin to get a magic link to the admin page"
echo ""
echo "When someone books a date, your bot will DM you with approve/reject buttons."
echo ""
