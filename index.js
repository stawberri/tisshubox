const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

global.tisshubox = true
if(app.makeSingleInstance(relaunch)) return app.quit()

app.once('ready', async () => {
  try {
    require('electron-devtools-installer').default('nhdogjmejiglipccpnnnanhbledajbpd')
    global.debug = true
  } catch(e) {
    global.debug = false
  }

  makeTisshubox()
})

function makeTisshubox() {
  tisshubox = new BrowserWindow({
    width: 1280, height: 720,
    useContentSize: true,
    title: 'Tisshubox',
    backgroundColor: '#f8e9e0',
    webPreferences: {devTools: global.debug}
  })
  tisshubox.loadURL(`file://${__dirname}/public/index.html`)
  tisshubox.once('closed', () => {
    tisshubox = null
    if(process.platform !== 'darwin') app.quit()
  })
}

app.on('open-file', relaunch)
app.on('open-url', relaunch)
function relaunch(event) {
  if(typeof event.preventDefault === 'function') event.preventDefault()
  if(tisshubox === true) return
  if(tisshubox === null) return makeTisshubox()

  tisshubox.show()
  tisshubox.restore()
  tisshubox.focus()
}
