/**
 * events.js — Single source of truth for all Cyber Talks events
 *
 * Format:
 * {
 *   date: "YYYY-MM-DD",
 *   dayType: "guest" | "solo-talk" | "open-floor",
 *   time: { hour, minute, durationMinutes },  // Optional; defaults: Mon/Wed 12 PM, others 8 PM
 *   guests: [{ name, headshot, tiktokUrl, topic }],  // For guest days
 *   topic: "string"  // For solo-talk days only
 * }
 *
 * Default Times:
 * - Monday & Wednesday: 12:00 PM EST
 * - All other days: 8:00 PM EST
 * - Duration: 60 minutes
 *
 * Timezone: America/New_York (handles EST/EDT automatically)
 *
 * Any date not listed below defaults to open-floor with Nate's pic + "Open Floor"
 */

export const events = [
  // April 2026 — Monday, 12 PM EST standard time
  {
    date: '2026-04-21',
    dayType: 'guest',
    time: { hour: 12, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: 'Chris The Tech Ninja',
        headshot: '/Speakers/Chris The Tech Ninja.jpg',
        tiktokUrl: 'https://www.tiktok.com/@christechninja',
        topic: 'Zero Trust Architecture in 2026'
      }
    ]
  },

  // Tuesday, 8 PM EST standard time
  {
    date: '2026-04-22',
    dayType: 'solo-talk',
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    topic: 'How AI is Changing Cybersecurity Threats'
  },

  // Wednesday, 12 PM EST standard time
  {
    date: '2026-04-23',
    dayType: 'open-floor',
    time: { hour: 12, minute: 0, durationMinutes: 60 }
  },

  // Thursday, 8 PM EST standard time
  {
    date: '2026-04-24',
    dayType: 'guest',
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: 'Jordan Smith',
        headshot: '/headshots/jordan-smith.jpg',
        tiktokUrl: 'https://www.tiktok.com/@jordansmith',
        topic: 'Cloud Security Best Practices'
      }
    ]
  },

  // Friday, 8 PM EST standard time
  {
    date: '2026-04-25',
    dayType: 'solo-talk',
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    topic: 'Incident Response 101'
  },

  // May 2026 — Thursday, 8 PM EST standard time
  {
    date: '2026-05-01',
    dayType: 'guest',
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: 'Taylor Johnson',
        headshot: '/headshots/taylor-johnson.jpg',
        tiktokUrl: 'https://www.tiktok.com/@taylorjohnson',
        topic: 'Malware Analysis Techniques'
      }
    ]
  },

  // Friday, 8 PM EST standard time
  {
    date: '2026-05-02',
    dayType: 'open-floor',
    time: { hour: 20, minute: 0, durationMinutes: 60 }
  },

  // June 2026 — Wednesday, 12 PM EDT (UTC-4, daylight saving)
  {
    date: '2026-06-17',
    dayType: 'guest',
    time: { hour: 12, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: 'Morgan Davis',
        headshot: '/headshots/morgan-davis.jpg',
        tiktokUrl: 'https://www.tiktok.com/@morgandavis',
        topic: 'Pentesting Fundamentals'
      }
    ]
  },

  // November 2026 — Wednesday, 12 PM EST (UTC-5, standard time)
  {
    date: '2026-11-18',
    dayType: 'solo-talk',
    time: { hour: 12, minute: 0, durationMinutes: 60 },
    topic: 'Year in Review: Cybersecurity 2026'
  }
]
