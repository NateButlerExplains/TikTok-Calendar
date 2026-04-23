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
    date: "2026-05-01",
    dayType: "guest",
    guests: [
      {
        name: "CyberMB",
        headshot: "/Speakers/May1 - CyberMB.png",
        topic: "GovTech + Clearance"
      }
    ]
  },
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
  },
  {
    date: "2026-05-05",
    dayType: "guest",
    guests: [
      {
        name: "Faith",
        headshot: "/Speakers/May5 - Faith.png",
        topic: "Cybersecurity Life"
      }
    ]
  },
  {
    date: "2026-05-06",
    dayType: "guest",
    guests: [
      {
        name: "Peezy",
        headshot: "/Speakers/May6-peezy2.JPG",
        topic: "Cybersecurity Engineer Life"
      }
    ]
  },
  {
    date: "2026-05-07",
    dayType: "guest",
    guests: [
      {
        name: "Rodney",
        headshot: "/Speakers/May7-Rodney.jpg",
        topic: "Cybersecurity Mentorship"
      }
    ]
  },
  {
    date: "2026-05-08",
    dayType: "guest",
    guests: [
      {
        name: "Shreem",
        headshot: "/Speakers/May8-Shreem.png",
        topic: "Neurodivergents in Cyber"
      }
    ]
  },
  {
    date: "2026-05-11",
    dayType: "guest",
    guests: [
      {
        name: "Samir",
        headshot: "/Speakers/May11 - Samir.jpg",
        topic: "Claude Ai in the Cyber Space"
      }
    ]
  },
  {
    date: "2026-05-13",
    dayType: "guest",
    time: { hour: 15, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: "Alan",
        headshot: "/Speakers/May13 - AlanAI 3pm.png",
        topic: "Leveraging Ai within the SDLC Process"
      }
    ]
  },
  {
    date: "2026-05-15",
    dayType: "guest",
    guests: [
      {
        name: "Marshall",
        headshot: "/Speakers/May15 - MarshallProf.jpg",
        topic: "Why Cybersecurity?!?!"
      }
    ]
  },
  {
    date: "2026-05-18",
    dayType: "guest",
    guests: [
      {
        name: "Get Pwn3d!",
        headshot: "/Speakers/May18 - GetPawnd.jpg",
        topic: "GRC/Third Party Risk Management (TPRM)"
      }
    ]
  },
  {
    date: "2026-05-19",
    dayType: "guest",
    guests: [
      {
        name: "David",
        headshot: "/Speakers/May19 - DavidWest.png",
        topic: "Surving and Thriving in Cyber"
      }
    ]
  },
  {
    date: "2026-05-20",
    dayType: "guest",
    guests: [
      {
        name: "Francis",
        headshot: "/Speakers/MAY20 - FRANCIS.png",
        topic: "What is Cloud Security?"
      }
    ]
  },
  {
    date: "2026-05-21",
    dayType: "guest",
    guests: [
      {
        name: "Dara",
        headshot: "/Speakers/May21-Dara.png",
        topic: "Cyber Pivot Playbook"
      }
    ]
  },
  {
    date: "2026-05-25",
    dayType: "guest",
    guests: [
      {
        name: "Betapersin",
        headshot: "/Speakers/May25 - BetaPersin.png",
        topic: "IAM is the backbone of cybersecurity. Why GRC, Zero Trust, and Cloud Security all collapse without it."
      }
    ]
  },
  {
    date: "2026-05-22",
    dayType: "guest",
    guests: [
      {
        name: "Christopher",
        headshot: "/Speakers/May22nd - Techwoke.png",
        topic: "RMF Based Roles and Today's Market"
      }
    ]
  },
  {
    date: "2026-05-23",
    dayType: "guest",
    guests: [
      {
        name: "Carter Perez",
        headshot: "/Speakers/May23 - CertifiedGames.png",
        tiktokUrl: "@certgames.com",
        topic: "The Power of Certs and Gamified Learning"
      }
    ]
  },
  {
    date: "2026-05-30",
    dayType: "guest",
    guests: [
      {
        name: "Brandy",
        headshot: "/Speakers/May30th - Brandy.png",
        topic: "Transition to Cyber"
      }
    ]
  },
  {
    date: "2026-06-19",
    dayType: "guest",
    guests: [
      {
        name: "Chris",
        headshot: "/Speakers/June19 - Christ Tech.jpg",
        topic: "Importance of Tech Projects/Portfolio"
      }
    ]
  }
]
