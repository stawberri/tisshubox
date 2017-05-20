const Danbooru = req('danbooru')

module.exports = store => {
  store.registerModule(['data', 'booru'], {
    namespaced: true,
    state: () => ({
      auth: {},
      server: 'safe-danbooru',
      searches: [
        {
          tags: 'score:5..',
          random: ''
        }
      ]
    }),

    getters: {
      ''(state) {
        switch(state.server) {
          case 'danbooru': return new Danbooru(state.auth)
          case 'safe-danbooru': return new Danbooru.Safebooru(state.auth)
        }
      }
    }
  })
}
