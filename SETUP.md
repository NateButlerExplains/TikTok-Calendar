<!--
© AngelaMos | 2026
SETUP.md
-->

# Cyber Talks Calendar — setup (5 minutes)

This turns the calendar into a real-time booking tool. When a viewer clicks an open
date and submits their TikTok username, a Telegram bot DMs you with **Approve / Reject**
buttons. The site updates instantly. You can pause public booking with `/lock` and
resume with `/unlock`.

You only do this **once**. After that, the bot handles everything from Telegram.

---

## 1. Create the Telegram bot (1 min)

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot`.
3. Pick a display name (e.g. `Cyber Talks Calendar`).
4. Pick a username ending in `bot` (e.g. `CyberTalksCalendarBot`).
5. BotFather replies with a token like `7483921:AAH...`. **Keep this window open.**

Then, in Telegram, open your new bot and send it any message (e.g. `hi`). That lets
the setup script find your chat ID.

---

## 2. Run the setup script (2 min)

From this repo:

```bash
# install Firebase CLI once if you don't have it
pnpm add -g firebase-tools
firebase login                 # opens browser, pick the Google account that owns cybertalks-guest

# run the one-shot setup
./scripts/setup-nate.sh
```

It will:

- Ask for the bot token from step 1.
- Ask you to confirm you sent a message to the bot, then grab your chat ID automatically.
- Store everything as Firebase secrets (never committed to the repo).
- Deploy the Firestore rules, Cloud Functions, and site.
- Seed the existing schedule into Firestore.
- Register the webhook with Telegram.

---

## 3. That's it

Open your bot on Telegram and send `/start`. You'll see:

```
/list    — upcoming bookings
/lock    — pause public booking
/unlock  — resume public booking
/admin   — get a 30-day admin page link
/whoami  — show chat id
```

**Typical flow:**

1. Viewer clicks an open date on the site → submits their TikTok username.
2. Your bot DMs you:  *"@someone wants May 23 — [✅ Approve] [❌ Reject]"*
3. You tap **Approve**. Bot asks for the topic (one line). You reply.
4. Bot asks for a headshot URL. You paste one (or send `/skip`).
5. The site updates in real time.

Reject → booking is cancelled, date goes back to open.

`/lock` hides the "Request this date" button site-wide. `/unlock` brings it back.

---

## 4. If something breaks

- **Bot stops responding:** run `./scripts/setup-nate.sh` again — it re-registers the webhook.
- **Want to rotate secrets:** re-run the script.
- **Want to edit an event after approving:** DM `/admin` to the bot, open the link, edit/delete from there.

Nothing about this setup uses polling or persistent processes — everything is
Firestore + Cloud Functions + Telegram's own webhook, all serverless.
