const {remote, ipcRenderer} = req('electron')
const tisshubox = remote.getGlobal('tisshubox')
const tisshuboxContents = tisshubox.webContents
const webContents = remote.getCurrentWebContents()

const emptyQueue = Symbol('empty queue')
exports = module.exports = {
  emptyQueue,

  poll() {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('task', (event, task) => {
        if(typeof task === 'undefined') {
          let error = new Error('empty task queue')
          error.emptyQueue = emptyQueue
          reject(error)
        } else resolve(task)
      })
      tisshuboxContents.send('request-task', webContents.id)
    })
  },

  commit(...args) {
    tisshuboxContents.send('vuex-commit', ...args)
  },

  dispatch(...args) {
    tisshuboxContents.send('vuex-dispatch', ...args)
  },

  log(...args) {
    if(process.env.NODE_ENV !== 'production')
      tisshuboxContents.send('console-log', ...args)
  }
}
