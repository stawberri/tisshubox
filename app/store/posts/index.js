module.exports = store => {
  store.registerModule('posts', {
    namespaced: true,
    state: () => ({
      tisshuIndex: 0,
      tisshus: [],
      queue: []
    }),

    getters: {
      tisshuIds({tisshus}) {
        return tisshus.map(post => post.id)
      },

      queueIds({queue}) {
        return queue.map(post => +post.id)
      }
    },

    mutations: require('./mutations'),
    actions: require('./actions')
  })
}
