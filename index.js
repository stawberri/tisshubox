const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

if(app.makeSingleInstance((argv, workingDirectory) => {
  if(!(global.tisshubox instanceof BrowserWindow)) return
  tisshubox.show()
  tisshubox.restore()
  tisshubox.focus()
})) {
  app.quit()
} else {
  app.once('ready', async () => {
    try {
      await require('electron-devtools-installer').default('nhdogjmejiglipccpnnnanhbledajbpd')
      global.debug = true
    } catch(e) {
      global.debug = false
    }

    let tisshubox = new BrowserWindow({
      width: 1280, height: 720,
      useContentSize: true,
      title: 'Tisshubox',
      show: false,
      webPreferences: {
        devTools: global.debug,
        textAreasAreResizable: false,
        defaultEncoding: 'utf8'
      }
    })
    tisshubox.loadURL(`file://${__dirname}/public/index.html`)
    tisshubox.on('ready-to-show', () => {
      global.tisshubox = tisshubox
      tisshubox.show()
    })
  })
}
