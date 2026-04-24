// ===================
// © AngelaMos | 2026
// firebase.js
// ===================

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'

const env = import.meta.env

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyD7IN50xZl7eO0KQvvlnaXjMeKT4Ec16jc',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'cybertalks-guest.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'cybertalks-guest',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'cybertalks-guest.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '356170351027',
  appId: env.VITE_FIREBASE_APP_ID || '1:356170351027:web:f7b8a90f8dc91da8d20bc6',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-Z1F89XPC74'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const functions = getFunctions(app, 'us-central1')

let analyticsInstance = null
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analyticsInstance = getAnalytics(app)
    })
    .catch(() => {})
}

export const logCustomEvent = (eventName, eventData = {}) => {
  if (!analyticsInstance) return
  try {
    logEvent(analyticsInstance, eventName, eventData)
  } catch (error) {
    console.error(`Failed to log event "${eventName}":`, error)
  }
}

export default app
