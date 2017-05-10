module.exports = {
  namespaced: true,

  state: {
    searchTags: 'order:rank'
  },

  mutations: {
    set(state, payload) {
      for(let key in payload) {
        if(key in state) state[key] = payload[key]
      }
    }
  }
}
