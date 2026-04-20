/**
 * events.js — Single source of truth for all Cyber Talks events
 *
 * Format:
 * {
 *   date: "YYYY-MM-DD",
 *   dayType: "guest" | "solo-talk" | "open-floor",
 *   time: { hour, minute, durationMinutes },  // Optional; defaults: Mon/Wed 12 PM, others 8 PM
 *   guests: [{ name, headshot, tiktokUrl, topic }],
 *   topic: "string"  // For solo-talk days
 * }
 *
 * Any date not listed defaults to open-floor with Nate's pic + "Open Floor"
 * Timezone: America/New_York (handles EST/EDT automatically)
 */

export const events = [
  // Sample guest day
  {
    date: '2026-04-21',
    dayType: 'guest',
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: 'Example Guest',
        headshot: '/headshots/example-guest.jpg',
        tiktokUrl: 'https://www.tiktok.com/@example',
        topic: 'Cybersecurity Best Practices'
      }
    ]
  },

  // Sample solo talk day
  {
    date: '2026-04-22',
    dayType: 'solo-talk',
    topic: 'How AI is Changing Cybersecurity in 2026'
  },

  // Sample open floor day (omit dayType — defaults to open-floor)
  {
    date: '2026-04-23',
    dayType: 'open-floor'
  }
]
