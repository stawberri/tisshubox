module.exports = (store, ...args) => {
  store.registerModule('data', {
    namespaced: true
  })

  for(let plugin of [
    'booru', 'cache'
  ]) require(`./${plugin}`)(store, ...args)
}
