const Vue = require('vue')

module.exports = store => {
  store.registerModule(['data', 'cache'], {
    namespaced: true,

    state: () => ({
      posts: {},
      trashTags: {},
      stashTags: {}
    }),

    getters: {
      ids({posts}) {
        return Object.keys(posts).map(id => +id)
      }
    },

    mutations: {
      add({posts, trashTags, stashTags}, {action, tisshu}) {
        Vue.set(posts, tisshu.id, {action, date: Date.now()})
      }
    },

    actions: {
      stash({commit, rootGetters}, {tisshu}) {
        commit('add', {action: 'stash', tisshu})
        rootGetters['data/service/stash']({tisshu})
      },

      trash({commit, rootGetters}, {tisshu}) {
        commit('add', {action: 'trash', tisshu})
        rootGetters['data/service/trash']({tisshu})
      }
    }
  })
}
