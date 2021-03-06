const {remote: {getCurrentWebContents, getCurrentWindow}} = req('electron')
const tisshubox = require('./tisshubox')
window.addEventListener('error', event => {
  if(process.env.NODE_ENV !== 'production')
    getCurrentWebContents().openDevTools()
})

!async function() {
  while(true) {
    try {
      let task = await tisshubox.poll()
      await require(`./${task.require}`)(tisshubox, task)
    } catch(error) {
      if(
        error.emptyQueue === tisshubox.emptyQueue ||
        process.env.NODE_ENV === 'production'
      ) getCurrentWindow().destroy()
      else setImmediate(() => {throw error})
      return
    }
  }
}()
