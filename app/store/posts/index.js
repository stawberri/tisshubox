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
      tisshu({tisshus, tisshuIndex}) {
        return tisshus[tisshuIndex]
      },

      tisshuIds({tisshus}) {
        return tisshus.map(post => post.id)
      },

      queueIds({queue}) {
        return queue.map(post => post.id)
      },

      queueHasEnough({queue}) {
        return queue.length > 30
      }
    },

    mutations: require('./mutations'),
    actions: require('./actions')
  })
}
