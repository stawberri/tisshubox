const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

app.once('ready', async () => {
  try {
    await require('electron-devtools-installer').default('nhdogjmejiglipccpnnnanhbledajbpd')
  } catch(e) {}
  global.tisshubox = new BrowserWindow({show: true})
  global.tisshubox.loadURL(`file://${__dirname}/renderer/index.html`)
})
