const {remote: {getCurrentWindow}} = req('electron')
const win = getCurrentWindow()

let tisshuAlert
let focusTime
module.exports = vm => {
  vm.$watch('$store.state.window.focused', focused => {
    if(!focused) focusTime = Date.now()
    else {
      if(tisshuAlert) {
        tisshuAlert.close()
        tisshuAlert = null
      }
      win.flashFrame(false)
    }
  }, {immediate: true})

  vm.$watch(() => {
    return vm.tisshus.filter(tisshu => {
      let {seen, ready} = tisshu
      return !seen && ready > focusTime
    })
  }, alerts => {
    if(vm.$store.state.window.focused) return

    let {length} = alerts
    if(!length) return

    let oldest = alerts.sort((a, b) => a.ready - b.ready)[0]
    if(tisshuAlert) {
      if(tisshuAlert.data.id === oldest.id) return

      tisshuAlert.close()
      tisshuAlert = null
    }

    if(vm.$store.state.data.window.notifications) {
      tisshuAlert = new Notification(
        'New tisshu available',
        {
          tag: 'tisshu-alert',
          body: oldest.title,
          icon: oldest.url,
          data: {
            id: oldest.id
          }
        }
      )

      tisshuAlert.addEventListener('click', event => {
        win.show()
        vm.jump(oldest.id)
      })
    }

    if(vm.$store.state.data.window.flashFrame) win.flashFrame(true)
  }, {immediate: true})
}
