import {
  auth,
} from '~/plugins/firebase.js'

export default function({ route, redirect }) {
    const authRequired = route.meta.some(x => x.requiresAuth)
    const currentUser = auth.currentUser;

    if (authRequired && !currentUser) {
      redirect('/login')
    }
}