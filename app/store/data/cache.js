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
      add({posts, trashTags, stashTags}, {action, post}) {
        let {id, tags} = post
        id = +id

        let stateTags
        switch(action) {
          case 'trash':
            stateTags = trashTags
          break
          case 'stash':
            stateTags = stashTags
          break
          default:
            throw new Error(`invalid action ${action}`)
          break
        }

        for(let tag of tags) Vue.set(stateTags, tag, -~stateTags[tag])

        Vue.set(posts, id, {
          action,
          date: Date.now()
        })
      }
    },

    actions: {
      trash({commit}, {post}) {
        commit('add', {action: 'trash', post})
      },

      stash({commit}, {post}) {
        commit('add', {action: 'stash', post})
      }
    }
  })
}
