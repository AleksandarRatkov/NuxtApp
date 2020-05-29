import {
  auth,
} from '~/plugins/firebase.js'

export default function ({ route, redirect, store }) {
  const authRequired = route.meta.some(x => x.requiresAuth)
  const currentUser = store.state.user.currentUserId;

  if (authRequired && !currentUser) {
    redirect('/login')
  }
}