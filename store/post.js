import _ from 'lodash';
import {
    postsCollection
} from '~/plugins/firebase.js'

export const state = () => ({
    posts: []
})

export const mutations = {
    setPosts(state, val) {
        if (val) {
            state.posts = val
        } else {
            state.posts = []
        }
    },
}


export const actions = {
    fetchAllPosts({ commit }) {
        postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            let postsArray = []

            querySnapshot.forEach(doc => {
                let post = doc.data();
                post.id = doc.id;
                postsArray.push(post)
            })
            let userProfile = this.state.user.userProfile;
            let ids = userProfile.following;
            ids.push(userProfile.id);

            postsArray = _.filter(postsArray, post => {
                return _.includes(ids, post.userId)
            })
            commit('setPosts', postsArray)
        })
    }
}
