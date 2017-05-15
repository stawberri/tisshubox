module.exports = store => {
  store.registerModule('storage', {
    namespaced: true,

    modules: {
      booru: require('./booru'),
      trash: require('./trash')
    }
  })
}
