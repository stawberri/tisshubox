module.exports = store => {
  store.registerModule('window', {
    namespaced: true,

    state: () => ({
      title: '',
      state: 'focus'
    }),

    mutations: {
      title(state, {title}) {
        state.title = title
      }
    }
  })

  store.watch(() => store.state.window.title, title => {
    let package = store.state.package
    if(package.github && package.local.version !== package.github.version) {
      title = `Tisshubox v${package.local.version} — UPDATE AVAILABLE. PLEASE CHECK GITHUB FOR A NEWER VERSION.`
    } else if(!title) {
      title = `Tisshubox v${package.local.version} — ${package.local.description}`
    } else {
      title += ` — Tisshubox v${package.local.version}`
    }

    document.title = title
  })
}
