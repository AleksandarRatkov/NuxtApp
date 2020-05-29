import {
    auth,
    usersCollection,
    postsCollection,
    commentsCollection
} from '~/plugins/firebase.js'
import Cookies from 'js-cookie'
import firebase from 'firebase'

export const state = () => ({
    userProfile: {},
    users: [],
    currentUserId: null
})

export const mutations = {
    setUserProfile(state, val) {
        state.userProfile = val
    },
    setUsers(state, val) {
        state.users = val
    },
    setCurrentUserId(state, val) {
        state.currentUserId = val
    },
}

export const actions = {
    async login({ commit, dispatch }, user) {
        const response = await auth.signInWithEmailAndPassword(user.email, user.password)
        commit('setCurrentUserId', response.user.uid);
        const token = await auth.currentUser.getIdToken();
        Cookies.set('access_token', token); // saving token in cookie for server rendering

        await dispatch('fetchUserProfile');
    },
    async loginWithGoogle({ dispatch }) {
        const provider = new firebase.auth.GoogleAuthProvider();
        const response = await auth.signInWithPopup(provider);
        commit('setCurrentUserId', response.user.uid);
        await dispatch('checkIfUserExist', response.user)
    },
    async checkIfUserExist({ dispatch }, user) {
        const response = await usersCollection.doc(user.uid).get();
        if (response.exists) {
            await dispatch('fetchUserProfile');
        } else {
            dispatch('addUserToDb', { userId: user.uid, name: user.name, title: "" });
        }
    },
    async addUserToDb({ dispatch }, user) {
        await usersCollection.doc(user.userId).set({ name: user.name, title: user.title, following: [] })
        await dispatch('fetchUserProfile');
    },
    async signup({ dispatch }, user) {
        const response = await auth.createUserWithEmailAndPassword(user.email, user.password)
        commit('setCurrentUserId', response.user.uid);
        await dispatch('addUserToDb', { userId: response.user.uid, name: user.name, title: user.title })
    },
    async  resetPassword({ }, email) {
        await auth.sendPasswordResetEmail(email);
    },
    async fetchUsersBeside({ commit, state }) {
        const response = await usersCollection.get();

        let fetchedUsers = response.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        })
        _.remove(fetchedUsers, function (user) {
            return user.id === state.currentUserId;
        });
        commit('setUsers', fetchedUsers)
    },
    async fetchUserProfile({ commit, state }) {
        const response = await usersCollection.doc(state.currentUserId).get();
        let user = response.data();
        user.id = response.id;
        commit('setUserProfile', user)
    },
    async updateProfile({ state }, data) {
        let name = data.name
        let title = data.title
        let profileImageUrl = data.profileImageUrl

        await usersCollection.doc(state.currentUserId).update({ name, title, profileImageUrl });
        // update all posts by user to reflect new name
        const posts = await postsCollection.where('userId', '==', state.currentUserId).get();

        posts.forEach(post => {
            postsCollection.doc(post.id).update({
                userName: name,
                profileImageUrl: profileImageUrl
            })
        })
        // update all comments by user to reflect new name
        const comments = await commentsCollection.where('userId', '==', state.currentUserId).get();
        comments.forEach(comment => {
            commentsCollection.doc(comment.id).update({
                userName: name,
                profileImageUrl: profileImageUrl
            })
        })
    },
    async updateProfileFollowing({ state, dispatch }, following) {
        await usersCollection.doc(state.currentUserId).update({ following });
        dispatch('fetchUserProfile');
    }
}
