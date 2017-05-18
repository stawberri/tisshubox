const {remote, ipcRenderer} = req('electron')

module.exports = store => {
  store.registerModule('workers', {
    namespaced: true,
    state: () => ({
      queue: [],
      workers: []
    }),

    mutations: {
      enqueue({queue}, {task}) {
        queue.push(task)
      },

      dequeue({queue}) {
        queue.shift()
      },

      worker(state) {
        let workers = state.workers.filter(win =>
          remote.BrowserWindow.fromId(win) &&
          !remote.BrowserWindow.fromId(win).isDestroyed()
        )

        if(workers.length >= 4) return
        let win = new remote.BrowserWindow({show: false})
        workers.push(win.id)
        state.workers = workers

        let url = new URL(window.location)
        url.hash = 'worker'
        win.loadURL('' + url)
      }
    },

    actions: {
      task({commit}, {task}) {
        commit('enqueue', {task})
        commit('worker')
      },

      issue({state, commit}, {worker}) {
        if(state.queue.length) {
          let task = state.queue[0]
          commit('dequeue')
          worker.send('task', task)
        } else {
          worker.send('task')
        }
      }
    }
  })

  ipcRenderer.on('request-task', (event, workerId) => {
    let worker = remote.webContents.fromId(workerId)
    store.dispatch('workers/issue', {worker})
  })

  ipcRenderer.on('vuex-commit', (event, ...args) =>
    store.commit(...args)
  )

  ipcRenderer.on('vuex-dispatch', (event, ...args) =>
    store.dispatch(...args)
  )

  if(process.env.NODE_ENV !== 'production') {
    ipcRenderer.on('console-log', (event, ...args) =>
      console.log('[Worker]', ...args)
    )
  }
}
