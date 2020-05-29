// import firebase from 'firebase'
// import 'firebase/firestore'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};
// Initialize Firebase
let app = null
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
}

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
}