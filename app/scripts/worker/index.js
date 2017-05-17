const {remote} = req('electron')
const tisshubox = require('./tisshubox')
window.addEventListener('error', event => tisshubox.log('[Serious Error]', event))

!async function() {
  while(true) {
    try {
      let task = await tisshubox.poll()
      require(`./${task.require}`)(tisshubox, task)
    } catch(error) {
      if(error.message !== 'empty queue') tisshubox.log('[Error]', error)
      return remote.getCurrentWindow().destroy()
    }
  }
}()
