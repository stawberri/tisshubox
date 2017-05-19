module.exports = store => {
  store.registerModule('data', {
    namespaced: true,

    modules: {
      booru: require('./booru'),
      cache: require('./cache')
    }
  })
}
