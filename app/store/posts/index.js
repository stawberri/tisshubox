module.exports = store => {
  store.registerModule('posts', {
    namespaced: true,
    state: {
      tisshuIndex: 0,
      tisshus: [],
      queue: []
    },

    getters: {
      tisshu(state) {
        return state.tisshus[state.tisshuIndex]
      },

      queueIds(state) {
        return state.queue.map(post => post.id)
      }
    },

    mutations: require('./mutations'),
    actions: require('./actions')
  })
}
