let Danbooru = req('danbooru')

module.exports = {
  namespaced: true,
  state: {
    auth: {},
    safebooru: true,
    searches: [
      {
        tags: 'order:rank',
        random: false
      }
    ]
  },

  getters: {
    [''](state) {
      if(state.safebooru)
        return new Danbooru.Safebooru(state.auth)
      else
        return new Danbooru(state.auth)
    }
  }
}
