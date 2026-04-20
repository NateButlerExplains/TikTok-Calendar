# Roadmap: Cyber Talks Calendar

## Overview

MVP launch within 48 hours delivering Daily View, 3-Day View, deep links, .ics exports, share buttons, PWA install, and Firebase Analytics. Phase 2 adds Month/Week views, email reminder infrastructure, and dynamic OG tags. Phase 3 introduces admin portal and email reminders as core feature.

## Current Milestone

**v0.1 MVP Launch** (v0.1.0)
Status: In progress
Phases: 0 of 3 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1.1 | Core Components | 1 | Complete | 2026-04-20 |
| 1.2 | Navigation & Integration | 1 | Planning | - |
| 1.3 | Footer & Polish | 1 | Not started | - |

## Phase Details

### Phase 1.1: Core Components

**Goal:** Build the foundational React components (cards, day views) needed for all calendar displays.
**Depends on:** Nothing (first phase)
**Research:** Unlikely (React patterns, standard component architecture)

**Scope:**
- Global styles + theme variables (colors, fonts, layout)
- `events.js` data model + test dataset (7-10 days of sample events)
- `useCalendarData` hook (date resolver, default fallback to open-floor)
- `GuestCard.jsx` — displays guest with headshot, TikTok link, topic
- `SoloTalkCard.jsx` — displays Nate with prepared topic (no TikTok link)
- `OpenFloorCard.jsx` — displays Nate with "Open Floor" label
- `DayView.jsx` — full-detail single day, swipe left/right, .ics download, share button, landing page
- `ThreeDayView.jsx` — yesterday/today/tomorrow layout

**Plans:**
- [ ] 01.1-01: Global styles + theme variables (CSS variables, mobile viewport, dark theme)
- [ ] 01.1-02: `events.js` data model + sample dataset (7-10 days)
- [ ] 01.1-03: `useCalendarData` hook (date → full day resolver)
- [ ] 01.1-04: `GuestCard`, `SoloTalkCard`, `OpenFloorCard` components
- [ ] 01.1-05: `DayView.jsx` (swipe, .ics, share, landing)
- [ ] 01.1-06: `ThreeDayView.jsx` (3-day layout)

### Phase 1.2: Navigation & Integration

**Goal:** Wire up navigation, header, analytics, PWA config, and error handling.
**Depends on:** Phase 1.1 (cards + views)
**Research:** Unlikely (Firebase Analytics standard pattern, PWA config well-established)

**Scope:**
- `CalendarHeader.jsx` (sticky view switcher + prev/next arrows)
- `BottomSheet.jsx` (reusable slide-up panel for future use)
- `ErrorBoundary.jsx` (graceful error display)
- `App.jsx` (query param reading, routing, global state)
- Firebase Analytics integration (init in firebase.js, instrument events)
- PWA config (vite-plugin-pwa manifest, icons)

**Plans:**
- [ ] 01.2-01: `CalendarHeader.jsx` (view switcher + navigation)
- [ ] 01.2-02: `BottomSheet.jsx` (for future month view modal)
- [ ] 01.2-03: `ErrorBoundary.jsx` (error fallback UI)
- [ ] 01.2-04: `App.jsx` (query param reading, view routing, global state)
- [ ] 01.2-05: Firebase Analytics integration + PWA config

### Phase 1.3: Footer & Polish

**Goal:** Add legal footer, test on mobile, optimize performance, verify production deployment.
**Depends on:** Phase 1.2 (full app wired)
**Research:** Unlikely (legal templates standard, mobile testing manual)

**Scope:**
- Footer with legal links (Privacy Policy, Terms of Service, About, Contact)
- Legal template text (placeholder language to be refined later)
- Mobile testing: DevTools 390px, iOS Safari (physical or simulator), Chrome Android (physical or simulator)
- Performance audit (image size, bundle size, lighthouse score)
- Deploy verification on cybertalks-guest.web.app

**Plans:**
- [ ] 01.3-01: Footer component + legal templates (Privacy, Terms, About, Contact)
- [ ] 01.3-02: Mobile testing (DevTools 390px, iOS, Android) + performance audit
- [ ] 01.3-03: Final deployment verification on Firebase Hosting

---
*Roadmap created: 2026-04-20*
*Last updated: 2026-04-20*
