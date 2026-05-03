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
 * - All other days: 9:00 PM EST
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
  // Workshop events — Nate as guest speaker
  {
    date: "2026-04-25",
    dayType: "guest",
    time: { hour: 9, minute: 0, durationMinutes: 120 },
    guests: [
      {
        name: "Workshop",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Know Yourself & Build Your Arsenal"
      }
    ]
  },
  {
    date: "2026-05-02",
    dayType: "guest",
    time: { hour: 9, minute: 0, durationMinutes: 120 },
    guests: [
      {
        name: "Workshop",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Labs, Learning & LinkedIn"
      }
    ]
  },
  {
    date: "2026-05-09",
    dayType: "guest",
    guests: [
      {
        name: "Workshop",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Network Like a Pro & Own the Hunt",
        time: { hour: 9, minute: 0, durationMinutes: 120 }
      },
      {
        name: "Henry",
        headshot: "/Speakers/May9 - Henry.png",
        tiktokUrl: "@henryekeocha",
        topic: "DevOps Part II",
        time: { hour: 21, minute: 0, durationMinutes: 60 }
      }
    ]
  },
  {
    date: "2026-05-16",
    dayType: "guest",
    time: { hour: 9, minute: 0, durationMinutes: 120 },
    guests: [
      {
        name: "Workshop",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "AI, Tomorrow's Tools & Your Edge"
      }
    ]
  },
  // May 2026 starts here - all open floor with Nate
  // Schedule starts May 1st
  {
    date: "2026-05-01",
    dayType: "guest",
    guests: [
      {
        name: "CyberMB",
        headshot: "/Speakers/May1 - CyberMB.png",
        tiktokUrl: "@cyberwithmb",
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
        tiktokUrl: "@faithyywaithyy",
        topic: "Cybersecurity Life"
      }
    ]
  },
  {
    date: "2026-05-06",
    dayType: "guest",
    guests: [
      {
        name: "Michelle Morris",
        headshot: "/Speakers/May6 - Coach.png",
        tiktokUrl: "@modernmichelle",
        topic: "Jumpstart your Cyber Career",
        bio: "Michelle Morris is an Assistant Vice President of Technology Resilience in the financial sector, specializing in business continuity planning, cyber resilience, and disaster recovery. She is also the founder of Firewall Founders Club, a community-driven platform dedicated to increasing representation of women and minorities in technology. Through her work, Michelle provides practical insights and actionable guidance to help aspiring professionals gain hands-on experience and successfully transition into tech careers.",
        links: [
          { label: "LinkedIn", url: "https://www.linkedin.com/in/mmorris64" },
          { label: "Email", url: "mailto:michelle@firewallfoundersclub.com" }
        ]
      }
    ]
  },
  {
    date: "2026-05-07",
    dayType: "guest",
    guests: [
      {
        name: "Peezy",
        headshot: "/Speakers/May6-peezy2.JPG",
        tiktokUrl: "@whooispeezy_",
        topic: "Cybersecurity Engineer Life",
        time: { hour: 19, minute: 0, durationMinutes: 60 }
      },
      {
        name: "Rodney",
        headshot: "/Speakers/May7-Rodney.jpg",
        tiktokUrl: "@rodney_arceneaux",
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
        tiktokUrl: "@queenshreemindigo",
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
        tiktokUrl: "@Samir_elabed",
        topic: "Claude Ai in the Cyber Space"
      }
    ]
  },
  {
    date: "2026-05-12",
    dayType: "guest",
    guests: [
      {
        name: "Clayton",
        headshot: "/Speakers/May12 - Clayton.png",
        tiktokUrl: "https://www.linkedin.com/in/clayton-williams-1a7b61349/",
        topic: "Cybersecurity Major & The Journey",
        time: { hour: 10, minute: 0, durationMinutes: 60 }
      },
      {
        name: "Daniel",
        headshot: "/Speakers/May12 - Baba.png",
        tiktokUrl: "@baba_dano",
        topic: "The Power of People Networking in Cybersecurity/Technology",
        time: { hour: 21, minute: 0, durationMinutes: 60 }
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
        tiktokUrl: "@alanonai",
        topic: "Leveraging Ai within the SDLC Process"
      }
    ]
  },
  {
    date: "2026-05-14",
    dayType: "guest",
    guests: [
      {
        name: "Matt Stephens",
        headshot: "/Speakers/May14-MattStephens.png",
        tiktokUrl: "@mattsstephens",
        topic: "Engineering in the Tech Space"
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
        tiktokUrl: "@cybersecprofessor",
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
        tiktokUrl: "@ie_ty97",
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
        tiktokUrl: "@davidwesttech",
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
        tiktokUrl: "@thesubtletechie",
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
        tiktokUrl: "@dara.stays.curious",
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
        tiktokUrl: "@betapersiniam",
        topic: "IAM is the backbone of cybersecurity. Why GRC, Zero Trust, and Cloud Security all collapse without it."
      }
    ]
  },
  {
    date: "2026-05-26",
    dayType: "guest",
    guests: [
      {
        name: "LaMont",
        headshot: "/Speakers/May26-Lamont2.png",
        tiktokUrl: "@lamontwheat",
        topic: "Why Ai Feels Inconsistent and How Human Alignment (or lack of it) shapes the output",
        bio: "LaMont Wheat is an Executive AI Integration Architect and Founder of UHMUM Learning, where he works with leaders navigating the shift into the agentic era. His work focuses on stabilizing decision-making, strengthening governance, and ensuring human clarity remains at the center of AI-driven environments.\n\nThrough his PhaseLock™ framework, LaMont helps executives and organizations move from fragmented AI usage to coherent deployment—aligning leadership, communication, and execution.\n\nRather than teaching tools, he reorients how leaders think, decide, and operate alongside intelligent systems. His work has supported teams across technology, telecom, and enterprise environments seeking clarity in a rapidly accelerating landscape.",
        links: [
          { label: "Email", url: "mailto:Lamont@uhmum.com" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/lamontwheat" },
          { label: "Executive AI Orientation Reset", url: "https://stan.store/lamontwheat/p/ai-orientation-reset" }
        ],
        resource: "/Speakers/May26-LamontResource.png"
      }
    ]
  },
  {
    date: "2026-05-27",
    dayType: "guest",
    guests: [
      {
        name: "Ash",
        headshot: "/Speakers/May27 - Ash.png",
        tiktokUrl: "@ashoncyber",
        topic: "What is AI Security, and Why is it Important?"
      }
    ]
  },
  {
    date: "2026-05-28",
    dayType: "guest",
    guests: [
      {
        name: "Cybershortieee",
        headshot: "/Speakers/May28-CyberShorti2.png",
        tiktokUrl: "@cybershortieee",
        topic: "She Wrote a Tech Thriller...Now She's Breaking Down Why Cloud Security is Taking Over in 2026"
      }
    ]
  },
  {
    date: "2026-05-29",
    dayType: "guest",
    guests: [
      {
        name: "Christian",
        headshot: "/Speakers/May29 - Christian.png",
        tiktokUrl: "@_santooz07",
        topic: "Break into a Six-Figure Career in Cybersecurity"
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
        tiktokUrl: "@techwoke",
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
    date: "2026-05-03",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-05-10",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-05-17",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-05-24",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-05-30",
    dayType: "guest",
    guests: [
      {
        name: "Brandy",
        headshot: "/Speakers/May30th - Brandy2.png",
        tiktokUrl: "@boldlybrandy",
        topic: "Transition to Cyber"
      }
    ]
  },
  {
    date: "2026-05-31",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-06-06",
    dayType: "guest",
    guests: [
      {
        name: "Cyberend",
        headshot: "/Speakers/June6 - Cyberend.png",
        tiktokUrl: "@cyberenduk",
        topic: "Thriving and Surviving your Cyber Career",
        time: "TBD"
      }
    ]
  },
  {
    date: "2026-06-07",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-06-14",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-06-21",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-06-28",
    dayType: "guest",
    guests: [
      {
        name: "Lounge",
        headshot: "/Speakers/Nate Default.jpg",
        tiktokUrl: "@natebutlerexplains",
        topic: "Chat, Hangout and Decompress and Network"
      }
    ]
  },
  {
    date: "2026-06-13",
    dayType: "guest",
    time: { hour: 20, minute: 0, durationMinutes: 60 },
    guests: [
      {
        name: "Stan",
        headshot: "/Speakers/June13 Stan.png",
        tiktokUrl: "@stanntalks",
        topic: "Navigating the IT space"
      }
    ]
  },
  {
    date: "2026-06-01",
    dayType: "guest",
    guests: [
      {
        name: "BarCode Security",
        headshot: "/Speakers/June1 - Barcode.png",
        tiktokUrl: "@barcodesecurity",
        topic: "Zero Trust in 2026",
        time: "TBD"
      }
    ]
  },
  {
    date: "2026-06-03",
    dayType: "guest",
    guests: [
      {
        name: "Mech",
        headshot: "/Speakers/June3 - Mech.png",
        tiktokUrl: "@wreckitmech",
        topic: "What is Infrastructure Engineering?"
      }
    ]
  },
  {
    date: "2026-06-05",
    dayType: "guest",
    guests: [
      {
        name: "Cyber Secrets",
        headshot: "/Speakers/June5 - CyberSecrts.png",
        tiktokUrl: "@arescyberdefense",
        topic: "The Art of Content Creation in the Tech/Cyber Space"
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
        tiktokUrl: "@christhetechninja",
        topic: "Importance of Tech Projects/Portfolio"
      }
    ]
  }
]
