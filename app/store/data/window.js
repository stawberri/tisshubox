module.exports = store => {
  store.registerModule(['data', 'window'], {
    namespaced: true,

    state: () => ({
      autoHideMenuBar: false
    }),

    mutations: {
      autoHideMenuBar(state, {hide}) {
        state.autoHideMenuBar = hide
      }
    }
  })
}
