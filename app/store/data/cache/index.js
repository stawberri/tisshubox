const Vue = require('vue')

module.exports = {
  namespaced: true,

  state: () => ({
    posts: [],
    trashTags: {},
    stashTags: {}
  }),

  getters: {
    ids({posts}) {
      return posts.map(post => post.id)
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

      posts.push({
        id, action,
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
}
