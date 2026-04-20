import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyD7IN50xZl7eO0KQvvlnaXjMeKT4Ec16jc',
  authDomain: 'cybertalks-guest.firebaseapp.com',
  projectId: 'cybertalks-guest',
  storageBucket: 'cybertalks-guest.firebasestorage.app',
  messagingSenderId: '356170351027',
  appId: '1:356170351027:web:f7b8a90f8dc91da8d20bc6',
  measurementId: 'G-Z1F89XPC74'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)

export default app
