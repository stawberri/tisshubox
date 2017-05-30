const {remote: {getCurrentWindow}} = req('electron')
const win = getCurrentWindow()

module.exports = store => {
  store.registerModule('window', {
    namespaced: true,

    state: () => ({
      title: '',
      focused: true,
      visible: true,
      minimized: false,
      detected: true
    }),

    getters: {
      title() {
        let {package, window: {title}, posts: {tisshus}} = store.state

        if(package.github && package.local.version !== package.github.version) {
          title = `Tisshubox v${package.local.version} — UPDATE AVAILABLE. PLEASE CHECK GITHUB FOR A NEWER VERSION.`
        } else if(!title) {
          title = `Tisshubox v${package.local.version} — ${package.local.description}`
        } else {
          title += ` — Tisshubox v${package.local.version}`
        }

        let unseen = tisshus.filter(tisshu => tisshu.ready && !tisshu.seen).length
        if(unseen) title = `(${unseen}) ${title}`

        return title
      }
    },

    mutations: {
      title(state, {title}) {
        state.title = title
      },

      state(state, {data}) {
        for(let key in data) {
          if(!(key in state)) throw new Error(`${key} is not a valid flag`)
          if(typeof data[key] !== 'boolean') throw new Error(`${key} is not a boolean`)
          state[key] = data[key]
        }
      }
    }
  })

  store.watch(
    () => store.getters['window/title'],
    title => document.title = title,
    {immediate: true}
  )


  function updateWindowState() {
    store.commit('window/state', {data: {
      focused: win.isFocused(),
      visible: win.isVisible(),
      minimized: win.isMinimized(),
    }})
  }

  win.on('focus', updateWindowState)
  win.on('blur', updateWindowState)
  win.on('show', updateWindowState)
  win.on('hide', updateWindowState)
  win.on('minimize', updateWindowState)
  win.on('restore', updateWindowState)
  updateWindowState()
}
