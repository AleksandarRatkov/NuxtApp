import _ from 'lodash';
import {
    usersCollection,
    postsCollection,
    commentsCollection
} from '~/plugins/firebase.js'

export const state = () => ({
    currentUser: null,
    userProfile: {},
    users: []
})

export const mutations = {
    setCurrentUser(state, val) {
        state.currentUser = val
    },
    setUserProfile(state, val) {
        state.userProfile = val
    },
    setUsers(state, val) {
        state.users = val
    }
}


export const actions = {
    fetchUsersBeside({ commit, state }) {
        usersCollection.get().then(querySnapshot => {
            let fetchedUsers = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            _.remove(fetchedUsers, function (user) {
                return user.id === state.currentUser.uid;
            });
            commit('setUsers', fetchedUsers)
        }).catch(err => {
            console.log(err)
        })
    },
    fetchUserProfile({ commit, state }) {
        usersCollection.doc(state.currentUser.uid).get().then(res => {
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

        usersCollection.doc(state.currentUser.uid).update({ name, title, profileImageUrl }).then(() => {
            // update all posts by user to reflect new name
            fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                docs.forEach(doc => {
                    postsCollection.doc(doc.id).update({
                        userName: name,
                        profileImageUrl: profileImageUrl
                    })
                })
            })
            // update all comments by user to reflect new name
            commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
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

        usersCollection.doc(state.currentUser.uid).update({ following });
    }
}
