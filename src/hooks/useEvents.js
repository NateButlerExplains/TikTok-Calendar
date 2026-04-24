// ===================
// © AngelaMos | 2026
// useEvents.js
// ===================

import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('status', 'in', ['published', 'pending'])
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        docs.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
        setEvents(docs)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  return { events, loading, error }
}

export function useConfig() {
  const [config, setConfig] = useState({ bookingLocked: false })

  useEffect(() => {
    const ref = doc(db, 'config', 'public')
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setConfig(snap.data())
      },
      () => {}
    )
    return unsub
  }, [])

  return config
}
