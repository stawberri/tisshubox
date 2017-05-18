const chroma = req('chroma-js')

module.exports = store => {
  store.registerModule('posts', {
    namespaced: true,
    state: () => ({
      tisshuIndex: 0,
      tisshus: [],
      queue: [],
      populating: false,
    }),

    getters: {
      tisshus({tisshus}) {
        return tisshus.map(src => {
          let tisshu = Object.assign({}, src)

          if(src.colors && src.colors.map)
            tisshu.colors = src.colors.map(color => chroma(color))

          return tisshu
        })
      },

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
