const {remote: {Menu, app, getCurrentWindow}, shell} = req('electron')
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
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {type: 'separator'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Browser Version',
          click: () => shell.openExternal(vm.tisshu.post.url)
        },
        {
          type: 'separator'
        },
        {
          label: 'Auto hide menu bar',
          type: 'checkbox',
          checked: vm.$store.state.data.window.autoHideMenuBar,
          visible: process.platform !== 'darwin',
          click: item => vm.$store.commit('data/window/flag', {data: {autoHideMenuBar: item.checked}})
        },
        {
          label: 'Emit new tisshu notifications',
          type: 'checkbox',
          checked: vm.$store.state.data.window.notifications,
          click: item => vm.$store.commit('data/window/flag', {data: {notifications: item.checked}})
        },
        {
          label: 'Flash window on new tisshu',
          type: 'checkbox',
          checked: vm.$store.state.data.window.flashFrame,
          click: item => vm.$store.commit('data/window/flag', {data: {flashFrame: item.checked}})
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Github',
          click: () => shell.openExternal(vm.$store.state.package.local.homepage)
        },
        {
          label: 'Bugs && Issues',
          click: () => shell.openExternal(vm.$store.state.package.local.bugs.url)
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

  if(process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', type: 'submenu'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  } else {
    template[0].submenu.push(
      {type: 'separator'},
      {role: 'quit'}
    )
  }

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if(process.platform !== 'darwin') {
    vm.$watch('$store.state.data.window.autoHideMenuBar', autohide => {
      let win = getCurrentWindow()
      win.setAutoHideMenuBar(autohide)
      win.setMenuBarVisibility(!autohide)
    }, {immediate: true})
  }

  vm.$watch(() => {
    return ([
      vm.tisshus.length > 1,
      !!(vm.tisshu && vm.tisshu.ready)
    ])
  }, enable => {
    let {submenu} = menu.items[0]
    let prev = submenu.items[0]
    let next = submenu.items[1]
    let stash = submenu.items[3]
    let trash = submenu.items[4]

    prev.enabled = next.enabled = enable[0]
    stash.enabled = trash.enabled = enable[1]
  }, {immediate: true})
}
