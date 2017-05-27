const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

global.tisshubox = null
if(app.makeSingleInstance(relaunch)) app.exit()

app.once('ready', async () => {
  try {
    require('electron-devtools-installer').default('nhdogjmejiglipccpnnnanhbledajbpd')
    global.debug = true
  } catch(e) {
    global.debug = false
  }

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
    app.exit()
  })
})

app.on('open-file', relaunch)
app.on('open-url', relaunch)
app.on('activate', relaunch)
function relaunch(event) {
  if(typeof event.preventDefault === 'function') event.preventDefault()
  if(!tisshubox) return

  tisshubox.show()
  tisshubox.restore()
  tisshubox.focus()
}
