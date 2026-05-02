'use strict'

const functions = require('firebase-functions')
const events = require('./events-meta.json')

const BASE_URL = 'https://cybertalks-guest.web.app'
const DEFAULT_IMAGE = `${BASE_URL}/Speakers/Nate%20Default.jpg`
const SITE_NAME = 'Cyber Talks Calendar'

function findEvent(date) {
  return events.find(e => e.date === date) || null
}

function buildImageUrl(headshotPath) {
  if (!headshotPath) return DEFAULT_IMAGE
  return BASE_URL + encodeURI(headshotPath)
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDateReadable(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function buildOgHtml({ title, description, imageUrl, canonicalUrl, redirectUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
</head>
<body>
  <p>Redirecting to <a href="${redirectUrl}">Cyber Talks Calendar</a>...</p>
</body>
</html>`
}

exports.ogMeta = functions.https.onRequest((req, res) => {
  const date = req.query.date

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.redirect(302, BASE_URL)
    return
  }

  const redirectUrl = `${BASE_URL}/?date=${date}`
  const canonicalUrl = `${BASE_URL}/og?date=${date}`
  const event = findEvent(date)
  const dateReadable = formatDateReadable(date)

  let title, description, imageUrl

  if (!event || event.dayType === 'open-floor') {
    title = `Cyber Talks — ${dateReadable}`
    description = `Join Nate Butler for an open floor live discussion on TikTok. Ask anything, talk shop.`
    imageUrl = DEFAULT_IMAGE
  } else if (event.dayType === 'solo-talk') {
    title = `Cyber Talks — ${event.topic || 'Solo Talk'} — ${dateReadable}`
    description = `Nate Butler presents: ${event.topic || 'Solo Talk'}. Live on TikTok.`
    imageUrl = DEFAULT_IMAGE
  } else if (event.dayType === 'guest' && event.guests && event.guests.length > 0) {
    const firstGuest = event.guests[0]
    if (event.guests.length === 1) {
      title = `Cyber Talks — ${firstGuest.name} — ${dateReadable}`
      description = firstGuest.topic
        ? `${firstGuest.name}: "${firstGuest.topic}" — Live on TikTok with Nate Butler.`
        : `${firstGuest.name} joins Cyber Talks live on TikTok with Nate Butler.`
    } else {
      const names = event.guests.map(g => g.name).join(' & ')
      title = `Cyber Talks — ${names} — ${dateReadable}`
      description = `${names} join Cyber Talks live on TikTok with Nate Butler.`
    }
    imageUrl = buildImageUrl(firstGuest.headshot)
  }

  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  res.status(200).send(buildOgHtml({ title, description, imageUrl, canonicalUrl, redirectUrl }))
})

exports.unsubscribe = functions.https.onRequest((req, res) => {
  res.status(200).send('Unsubscribe endpoint — not yet implemented.')
})
