const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let tisshubox
app.once('ready', () => {
  tisshubox = new BrowserWindow({show: true})
  tisshubox.loadURL(`file://${__dirname}/renderer/index.html`)
})
