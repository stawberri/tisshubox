const {remote, ipcRenderer} = req('electron')
const tisshubox = remote.getGlobal('tisshubox')
const tisshuboxContents = tisshubox.webContents
const webContents = remote.getCurrentWebContents()

module.exports = {
  poll() {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('task', task => {
        if(typeof task === undefined) reject(new Error('empty queue'))
        else resolve(task)
      })
      tisshuboxContents.send('request-task', webContents)
    })
  },

  commit(...args) {
    tisshuboxContents.send('vuex-commit', ...args)
  },

  dispatch(...args) {
    tisshuboxContents.send('vuex-dispatch', ...args)
  },

  log(...args) {
    tisshuboxContents.send('console-log', ...args)
  }
}
