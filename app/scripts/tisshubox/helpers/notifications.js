let tisshuAlert
module.exports = vm => {
  vm.$watch(() => {
    return vm.tisshus.find(tisshu => {
      let {noAlert, seen, ready} = tisshu
      return !noAlert && !seen && ready
    })
  }, tisshu => {
    if(tisshuAlert) {
      tisshuAlert.close()
      tisshuAlert = null
    }
    if(tisshu) {
      tisshuAlert = new Notification(
        'New tisshu available',
        {
          tag: 'tisshu-alert',
          body: tisshu.post.title || '',
          silent: true
        }
      )

      tisshuAlert.addEventListener('click', event => {
        vm.jump(tisshu.id)
      })
    }
  }, {immediate: true})
}
