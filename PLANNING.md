# Cyber Talks Calendar — SEED Planning Document

**Project Type**: Application  
**Status**: Ready to graduate → PAUL  
**Target Launch**: Within 48 hours (public immediately)  
**Refined**: April 20, 2026

---

## Vision

Help viewers discover when to tune in for Cyber Talks TikTok live streams. Provide frictionless calendar integration (reminders, .ics downloads, shareable links) and showcase guest profiles to drive TikTok follows.

---

## Success Metrics

- Viewer discovery of stream times
- Seamless calendar integration (share links, .ics exports)
- Guest profile visibility → TikTok follow traffic
- Analytics: which guests drive interest, which views are used most

---

## Phase 1 — MVP Launch (48 hours)

### Views
- **Daily View** (landing, default) — full detail, swipe left/right, .ics download, share button
- **3-Day View** — yesterday + today + tomorrow (today centered)
- ~~Month View~~ (defer to Phase 2)
- ~~Week View~~ (defer to Phase 2)

### Features
- Sticky view switcher (Day ↔ 3-Day)
- Prev/Next navigation arrows
- Deep link support (`?date=YYYY-MM-DD`)
- .ics download per day
- Share button (copy URL to clipboard)
- PWA install support (home screen icon)
- Dark/cyber theme (dark bg, cyan accent)
- Firebase Analytics (no UI; query/report only)

### Guest Data
- Test dataset with 7–10 days of sample events
- Use placeholder "?" mystery guest headshot for unconfirmed guests
- Increment headshots as guests confirm (Nate + Claude workflow: message → edit → push)
- Default time logic: Mon/Wed 12 PM EST, all others 8 PM EST

### Styling
- Dark background `#0a0a0f`, card `#1a1a2e`, accent `#00f5ff` (cyan)
- Font: Inter (Google Fonts)
- Responsive: 390px mobile primary, test on iOS 14 Pro + Android flagship

### Footer
- Privacy Policy (template)
- Terms of Service (template)
- About Cyber Talks
- Contact
- Copyright + disclaimer (cyber/security group context)

### Deployment
- GitHub Actions auto-builds and deploys on every push to `main`
- Firebase Hosting live at `cybertalks-guest.web.app`

---

## Phase 2 — Post-MVP (Future)

- Month View
- Week View
- Email reminders (Firestore + Cloud Functions + Resend)
- Dynamic Open Graph tags for social previews
- Admin portal (far future)
- Firestore event sync (to support reminders)

---

## Out of Scope (Phase 1)

- Admin UI (use Claude + `events.js` workflow for now)
- Email reminder infrastructure
- Analytics dashboard UI (query/report via Claude instead)
- Dynamic OG tags
- Offline mode (PWA cache shell only)

---

## Technical Stack (Confirmed)

- **Frontend**: React 18 + Vite
- **Styling**: Dark/cyber CSS (no component library)
- **Hosting**: Firebase Hosting
- **Database**: Firestore (minimal use; events in `src/data/events.js` for now)
- **Analytics**: Firebase Analytics (no UI)
- **PWA**: vite-plugin-pwa
- **Date/Time**: date-fns + date-fns-tz (America/New_York timezone)
- **Calendar Files**: ics library
- **Touch**: react-swipeable

---

## Implementation Phases (PAUL)

### Phase 1.1 — Core Components
1. Global styles + theme variables
2. `events.js` data model + test dataset
3. `useCalendarData` hook (date resolver)
4. `GuestCard`, `SoloTalkCard`, `OpenFloorCard` components
5. `DayView.jsx` (swipe, .ics, share, landing page)
6. `ThreeDayView.jsx`

### Phase 1.2 — Navigation & Integration
7. `CalendarHeader.jsx` (sticky view switcher + arrows)
8. `BottomSheet.jsx` (for future month view modal)
9. `ErrorBoundary.jsx`
10. `App.jsx` (query param reading, routing, global state)
11. Firebase Analytics integration
12. PWA config (`vite-plugin-pwa`)

### Phase 1.3 — Footer & Polish
13. Footer with legal templates (Privacy, Terms, About, Contact)
14. Mobile testing (DevTools 390px + physical iOS/Android)
15. Performance audit + optimization
16. Final deployment verification

---

## Data Model

### events.js
```js
export const events = [
  {
    date: "2026-04-21",
    dayType: "guest",
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: "Guest Name",
        headshot: "/headshots/guest-name.jpg",  // or /headshots/mystery.jpg placeholder
        tiktokUrl: "https://www.tiktok.com/@handle",
        topic: "Topic"
      }
    ]
  },
  {
    date: "2026-04-22",
    dayType: "solo-talk",
    topic: "Nate's prepared topic"
  },
  {
    date: "2026-04-23",
    dayType: "open-floor"
  }
]
```

### Default Times
- Mon & Wed: 12 PM EST
- All others: 8 PM EST
- Duration: 60 minutes
- Timezone: America/New_York (handles EST/EDT)

---

## Acceptance Criteria (PAUL)

### Phase 1.1 Complete
- [ ] Daily View renders with full guest card, swipe works
- [ ] 3-Day View shows yesterday/today/tomorrow
- [ ] .ics download works for both EST and EDT dates
- [ ] Share button copies URL to clipboard
- [ ] Deep links (`?date=`) load correct day
- [ ] Firebase Analytics events firing

### Phase 1.2 Complete
- [ ] View switcher (Day ↔ 3-Day) works, preserves focused date
- [ ] Prev/Next arrows navigate correctly
- [ ] PWA installable on iOS + Android home screen
- [ ] Error boundary catches and displays errors gracefully

### Phase 1.3 Complete
- [ ] Footer displays legal templates (Privacy, Terms, About, Contact)
- [ ] Mobile testing on DevTools 390px ✓
- [ ] Mobile testing on physical iOS 14 Pro ✓
- [ ] Mobile testing on physical Android flagship ✓
- [ ] Deployed to `cybertalks-guest.web.app` ✓
- [ ] Public-facing, no password/beta flag

---

## Guest Data Workflow

**Daily Update Process**:
1. Nate: "Add guest X for tomorrow, headshot coming later"
2. Claude: Updates `events.js`, uses placeholder `mystery.jpg` if needed
3. Claude: Commits + pushes to `main`
4. GitHub Actions: Auto-builds and deploys
5. Live at `cybertalks-guest.web.app` within 2 minutes

**Future (Post-MVP)**:
- Nate builds or we build admin UI so Nate can update without Claude
- Firestore syncs events for reminder infrastructure
- Direct phone editing possible

---

## Legal & Footer

### Footer Links (Template Language — Refine Later)

**Privacy Policy**
- Data collection: Firebase Analytics only (pseudonymous, no personal ID)
- Cookies: PWA service worker, Firebase session tokens
- Third-party: Firebase (Google), Resend (email, Phase 2+)
- Contact: [email or form]

**Terms of Service**
- Use only for discovering Cyber Talks streams
- No commercial redistribution of content or guest data
- Cyber Talks name/branding owned by Nate Butler
- Links to external TikTok profiles are third-party; not responsible for external content

**About**
- Cyber Talks: Daily TikTok live stream featuring cybersecurity guests
- Calendar: Mobile-first viewer tool for stream discovery
- Creator: Nate Butler (@natebutlerexplains)

**Contact**
- Email: [TBD]
- TikTok: @natebutlerexplains
- GitHub: NateButlerExplains/TikTok-Calendar

---

## File Structure (Git)

```
/Users/nateb/Projects/TikTok-Calendar/
├── PLANNING.md (this file)
├── CLAUDE.md (project documentation)
├── index.html (+ footer with legal links)
├── vite.config.js (PWA config)
├── firebase.json
├── firestore.rules
├── src/
│   ├── App.jsx
│   ├── firebase.js
│   ├── data/events.js
│   ├── hooks/useCalendarData.js
│   ├── utils/
│   │   ├── timeUtils.js
│   │   ├── icsGenerator.js
│   │   └── analytics.js
│   ├── components/
│   │   ├── CalendarHeader.jsx
│   │   ├── DayView.jsx
│   │   ├── ThreeDayView.jsx
│   │   ├── GuestCard.jsx
│   │   ├── SoloTalkCard.jsx
│   │   ├── OpenFloorCard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── BottomSheet.jsx
│   └── styles/
│       ├── global.css
│       └── calendar.css
└── public/
    ├── headshots/
    │   └── mystery.jpg (placeholder)
    └── icons/ (PWA)
```

---

## Next: PAUL Initialization

This PLANNING.md is ready for `/paul:init` to convert into:
- Milestones (MVP Launch)
- Phases (1.1, 1.2, 1.3)
- Acceptance criteria (per phase)
- Execution tracking + quality gates

**Ready to graduate and initialize PAUL?**
