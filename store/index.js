export const state = () => ({
    drawer: true,
})

export const mutations = {
    setDrawer(state, value) {
        state.drawer = value;
    },
}


// export const actions = {
//     clearData({ commit }) {
//         commit('user/setCurrentUser', null)
//         commit('user/setUserProfile', {})
//         commit('post/setPosts', [])
//     }
// }
