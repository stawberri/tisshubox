const {remote: {Menu, app}, shell} = req('electron')
const Events = req('events')

let singleton
module.exports = class Appmenu extends Events {
  constructor(store) {
    if(singleton) return singleton
    super()
    singleton = this

    let template = [
      {
        label: 'File',
        submenu: [
          {label: 'Meow!'},
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
            click() {shell.openExternal(store.state.package.local.homepage)}
          },
          {
            label: 'Bugs && Issues',
            click() {shell.openExternal(store.state.package.local.bugs.url)}
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

    this.menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(this.menu)
  }

  destroy() {
    Menu.setApplicationMenu(null)
    singleton = null
  }
}
