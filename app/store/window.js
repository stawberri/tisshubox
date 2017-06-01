const {remote: {getCurrentWindow, app}} = req('electron')
const win = getCurrentWindow()

module.exports = store => {
  store.registerModule('window', {
    namespaced: true,

    state: () => ({
      title: '',
      focused: true,
      visible: true,
      minimized: false,
      detected: true,
      active: false,
      keepActive: []
    }),

    getters: {
      title(state, getters, rootState) {
        let {title} = state
        let {package, posts: {tisshus}} = rootState

        if(package.github && package.local.version !== package.github.version) {
          title = `${app.getName()} v${app.getVersion()} — UPDATE AVAILABLE. PLEASE CHECK GITHUB FOR A NEWER VERSION.`
        } else if(!title) {
          title = `${app.getName()} v${app.getVersion()} — ${package.local.description}`
        } else {
          title += ` — ${app.getName()} v${app.getVersion()}`
        }

        let unseen = tisshus.filter(tisshu => tisshu.ready && !tisshu.seen).length
        if(unseen && store.state.data.window.unseenCount) title = `(${unseen}) ${title}`

        return title
      },

      active(state) {
        let {active, focused, keepActive} = state
        return focused && active || !!keepActive.length
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
      },

      keepActive({keepActive}, {label, enable}) {
        let index = keepActive.indexOf(label)
        if(enable) {
          if(!~index) keepActive.push(label)
        } else {
          if(~index) keepActive.splice(index, 1)
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

  let activeTimeout
  function refreshActiveTimeout() {
    clearTimeout(activeTimeout)
    activeTimeout = setTimeout(() => {
      store.commit('window/state', {data: {active: false}})
    }, 10000)
    store.commit('window/state', {data: {active: true}})
  }
  win.on('focus', refreshActiveTimeout)
  window.addEventListener('mousemove', refreshActiveTimeout)
  document.addEventListener('mouseleave', () => {
    clearTimeout(activeTimeout)
    store.commit('window/state', {data: {active: false}})
  })
}
