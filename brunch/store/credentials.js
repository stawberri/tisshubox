const Danbooru = req('danbooru')

module.exports = {
  namespaced: true,

  state: {},

  getters: {
    danbooru() {
      return new Danbooru.Safebooru()
    }
  }
}
