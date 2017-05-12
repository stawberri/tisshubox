module.exports = {
  namespaced: true,

  state: {
    searchTags: 'order:rank'
  },

  mutations: {
    tags(state, payload) {
      if(payload.tags) state.searchTags = payload.tags
    }
  }
}
