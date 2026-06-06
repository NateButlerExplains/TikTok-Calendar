# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cyber Talks Calendar** — a PWA event calendar for a TikTok LIVE show. Visitors see upcoming guest streams, download `.ics` files, and subscribe to email reminders. The frontend is a static React SPA deployed to Firebase Hosting; dynamic OG meta tags and email reminders are served by Firebase Cloud Functions.

Firebase project: `cybertalks-guest`
Live URL: `https://cybertalks-guest.web.app`

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # Prebuild sync → Vite production build → dist/
npm run lint         # ESLint check
npm run preview      # Serve the dist/ build locally
npm run sync:events  # Manually sync src/data/events.js → functions/events-meta.json
```

There is no test framework — `npm run lint` is the only automated check.

Firebase deployment (requires Firebase CLI + auth):
```bash
firebase deploy --only hosting   # Deploy frontend only
firebase deploy --only functions # Deploy Cloud Functions only
firebase deploy                  # Full deploy (triggered automatically by CI on push to main)
```

CI/CD runs on push/PR to `main` via `.github/workflows/deploy.yml` (Node 22, `npm ci --legacy-peer-deps`).

## Architecture

### Data flow

`src/data/events.js` is the single source of truth for all events. It exports an array of event objects. The prebuild script (`scripts/syncEvents.js`) reads this file and writes a trimmed copy to `functions/events-meta.json` so Cloud Functions can serve dynamic OG tags without bundling the full React app.

At runtime, `src/hooks/useCalendarData.js` resolves event data for any given date string. Dates not found in `events.js` automatically fall back to a synthetic `open-floor` event — there is no "empty" state.

### State management

All state lives in React hooks (`useState`, `useMemo`). The selected date is synced to the URL query param `?date=YYYY-MM-DD`, making deep links work. There is no external state library.

### Routing

React Router v6 with five routes: `/`, `/privacy`, `/terms`, `/about`, `/contact`. The SPA rewrite in `firebase.json` forwards all paths to `index.html`.

### Component responsibilities

| Component | Role |
|-----------|------|
| `App.jsx` | Root: routes, selected-date state, URL sync, keyboard nav, analytics |
| `MonthlyCalendar.jsx` | 7-column grid; month nav; day-click → `onDayClick` |
| `DayCard.jsx` | Single-day event display (guest / solo-talk / open-floor / blackout) |
| `BottomSheet.jsx` | Desktop detail overlay (shown when `selectedDate` is set) |
| `DateNavigator.jsx` | Formatted date header |
| `DownloadIcsButton.jsx` | Client-side `.ics` generation via `src/utils/icsGenerator.js` |
| `ShareButton.jsx` | Web Share API with clipboard fallback |

### Event data schema

```js
{
  date: "YYYY-MM-DD",          // required
  dayType: "guest" | "solo-talk" | "open-floor" | "blackout",
  time?: { hour, minute, durationMinutes },   // omit to use defaults
  guests?: [{
    name, headshot, tiktokUrl, topic, bio,
    links?,       // array of { label, url }
    resource?,    // { label, url }
    sydneyTime?   // boolean — show AEST/AEDT alongside EST
  }],
  topic?: string  // for solo-talk dayType
}
```

Default stream times: Mon/Wed → 12:00 PM EST; all other days → 9:00 PM EST (set in `src/utils/timeUtils.js`). All times are resolved in the `America/New_York` timezone using `date-fns-tz`.

### Timezone handling

All date arithmetic goes through `src/utils/timeUtils.js`. Use `getStreamStart()` to get a `Date` in America/New_York. `formatTimeWithSydney()` and `formatTimeWithGMT()` render dual-timezone strings for guests in those regions. Never use `new Date()` directly for display — always route through these utilities.

### Styling

CSS Modules for all components (zero global class pollution). Global design tokens live in `src/styles/global.css` as CSS custom properties (`--color-bg`, `--color-accent`, `--font-primary`, etc.). No Tailwind or utility-class framework. The palette is warm-dark (`#13130f` background, `#ebe6d6` text, `#2af57c` accent green).

### Firebase / backend

- **Firestore collections**: `events` (read-only from client), `globalSubscribers`, `dateSubscribers`, `reminderLog` — see `firestore.rules` for exact permissions.
- **Cloud Functions** (`functions/index.js`): `ogMeta` (dynamic OG HTML, 1 h CDN cache) and `unsubscribe` (email opt-out). Both are HTTP functions rewritten from `/og` and `/unsubscribe` paths in `firebase.json`.
- **Analytics**: `logCustomEvent()` from `src/firebase.js` wraps Firebase Analytics. Custom events: `date_selected`, `tiktok_link_clicked`, `share_link`, `download_ics`, `month_changed`.

### Headshot images

Stored under `public/Speakers/`. The default fallback image is `public/Speakers/Nate Default.jpg`. Reference them with a leading `/Speakers/FileName.jpg` path (Vite serves `public/` at root).
