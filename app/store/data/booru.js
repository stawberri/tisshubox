const Danbooru = req('danbooru')

module.exports = {
  namespaced: true,
  state: () => ({
    auth: {},
    safebooru: true,
    searches: [
      {
        tags: 'score:5..',
        random: ''
      }
    ]
  }),

  getters: {
    [''](state) {
      if(state.safebooru)
        return new Danbooru.Safebooru(state.auth)
      else
        return new Danbooru(state.auth)
    }
  }
}
