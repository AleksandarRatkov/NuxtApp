import {
    auth,
    usersCollection,
    postsCollection,
    commentsCollection
} from '~/plugins/firebase.js'
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
    fetchUsersBeside({ commit, state }) {
        usersCollection.get().then(querySnapshot => {
            let fetchedUsers = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            _.remove(fetchedUsers, function (user) {
                return user.id === state.currentUserId;
            });
            commit('setUsers', fetchedUsers)
        }).catch(err => {
            console.log(err)
        })
    },
    fetchUserProfile({ commit, state }) {
        usersCollection.doc(state.currentUserId).get().then(res => {
            let user = res.data();
            user.id = res.id;
            commit('setUserProfile', user)
        }).catch(err => {
            console.log(err)
        })
    },
    updateProfile({ state }, data) {
        let name = data.name
        let title = data.title
        let profileImageUrl = data.profileImageUrl

        usersCollection.doc(state.currentUserId).update({ name, title, profileImageUrl }).then(() => {
            // update all posts by user to reflect new name
            postsCollection.where('userId', '==', state.currentUserId).get().then(docs => {
                docs.forEach(doc => {
                    postsCollection.doc(doc.id).update({
                        userName: name,
                        profileImageUrl: profileImageUrl
                    })
                })
            })
            // update all comments by user to reflect new name
            commentsCollection.where('userId', '==', state.currentUserId).get().then(docs => {
                docs.forEach(doc => {
                    commentsCollection.doc(doc.id).update({
                        userName: name,
                        profileImageUrl: profileImageUrl
                    })
                })
            })
        }).catch(err => {
            console.log(err)
        })
    },
    updateProfileFollowing({ state }, data) {
        let following = data.following

        usersCollection.doc(state.currentUserId).update({ following });
    }
}
