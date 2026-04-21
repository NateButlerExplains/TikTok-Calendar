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
 *
 * SCHEDULE START: May 1, 2026
 * Between April 21 and April 30: No entries (will be pop-up events, not scheduled)
 */

export const events = [
  // May 2026 starts here - all open floor with Nate
  // Schedule starts May 1st
  {
    date: "2026-05-04",
    dayType: "guest",
    guests: [
      {
        name: "IAM Techbro",
        headshot: "/Speakers/May4 - IAM TechBro.png",
        tiktokUrl: "@victorasanmi",
        topic: "Identity Access & Management"
      }
    ]
  }
]
