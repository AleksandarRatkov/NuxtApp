import { getUserFromCookie } from '@/helpers'
import Cookies from 'js-cookie'

export const strict = false
export const state = () => ({
    drawer: true,
})

export const mutations = {
    setDrawer(state, value) {
        state.drawer = value;
    },
}


export const actions = {
    clearData({ commit }) {
        commit('user/setCurrentUserId', null)
        commit('user/setUserProfile', {})
        commit('post/setPosts', [])
        Cookies.remove('access_token');
    },
    async nuxtServerInit({ commit, dispatch }, { req }) {
        const user = getUserFromCookie(req)
        if (user) {
            commit('user/setCurrentUserId', user.user_id);
            await dispatch('user/fetchUserProfile');
        }
    }
}