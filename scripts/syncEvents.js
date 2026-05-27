#!/usr/bin/env node

import { events } from '../src/data/events.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const minimal = events.map(event => ({
  date: event.date,
  dayType: event.dayType,
  guests: event.guests
    ? event.guests.map(g => ({
        name: g.name,
        topic: g.topic || null,
        headshot: g.headshot || null,
        bio: g.bio || null,
        links: g.links || null,
        tiktokUrl: g.tiktokUrl || null,
        resource: g.resource || null
      }))
    : [],
  topic: event.topic || null
}))

const output = path.join(__dirname, '../functions/events-meta.json')
fs.writeFileSync(output, JSON.stringify(minimal, null, 2) + '\n')
console.log(`✓ Synced ${events.length} events to ${output}`)
