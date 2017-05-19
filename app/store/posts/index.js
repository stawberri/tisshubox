const chroma = req('chroma-js')

module.exports = store => {
  store.registerModule('posts', {
    namespaced: true,
    state: () => ({
      tisshuIndex: 0,
      tisshus: [],
      conveyor: [],
      queue: [],
      rejectedPosts: [],
      populating: false,
      fetching: false,
      fetchedLastPage: false,
      recursiveFetchPage: 2
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
