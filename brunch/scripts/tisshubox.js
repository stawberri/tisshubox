const {remote} = req('electron')
let tisshubox = remote.getCurrentWindow()

tisshubox.setTitle('Tisshubox')
tisshubox.setMenu(null)
tisshubox.setContentSize(450, 600)
tisshubox.center()

tisshubox.show()
tisshubox.webContents.toggleDevTools()


let pull = document.querySelector('.pull')
