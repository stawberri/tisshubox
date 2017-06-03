module.exports = store => {
  store.registerModule(['data', 'window'], {
    namespaced: true,

    state: () => ({
      autoHideMenuBar: false,
      notifications: true,
      flashFrame: false,
      unseenCount: true,
      autohideUi: true
    }),

    mutations: {
      flag(state, {data}) {
        for(let key in data) {
          if(typeof data[key] !== 'boolean') throw new Error(`${key} is not a boolean`)
          if(typeof state[key] !== 'boolean') throw new Error(`${key} is not a flag`)
          if(!(key in state)) throw new Error(`invalid  key ${key}`)
          state[key] = data[key]
        }
      }
    }
  })
}
