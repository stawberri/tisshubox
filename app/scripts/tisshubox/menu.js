const {remote: {Menu, app}, shell} = req('electron')
const Events = req('events')

module.exports = vm => {
  let template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Previous Tisshu',
          accelerator: 'Left',
          click: () => vm.prev()
        },
        {
          label: 'Next Tisshu',
          accelerator: 'Right',
          click: () => vm.next()
        },
        {type: 'separator'},
        {
          label: 'Stash Tisshu',
          accelerator: 'Up',
          click: () => vm.stash()
        },
        {
          label: 'Trash Tisshu',
          accelerator: 'Down',
          click: () => vm.trash()
        },
        {type: 'separator'},
        {role: 'quit'}
      ]
    },
    {role:'editMenu'},
    {
      label: 'View',
      submenu: [
        {label: 'Nyaa!'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Github',
          click: () => shell.openExternal(store.state.package.local.homepage)
        },
        {
          label: 'Bugs && Issues',
          click: () => shell.openExternal(store.state.package.local.bugs.url)
        }
      ]
    }
  ]

  if(process.env.NODE_ENV === 'development') template.splice(-1, 0, {
    label: 'Debug',
    submenu: [
      {role:'toggledevtools'},
      {
        label: 'User Data Directory',
        click() {shell.openItem(app.getPath('userData'))}
      }
    ]
  })

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
