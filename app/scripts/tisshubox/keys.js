let keydown
module.exports = vm => {
  if(keydown) window.removeEventListener('keydown', keydown)
  window.addEventListener('keydown', keydown = event => {
    switch(event.key) {
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9': case '0':
        if(process.platform === 'darwin' ? event.metaKey : event.ctrlKey) {
          let tab = +event.key
          if(tab === 0) tab = 10
          tab--
          vm.jumpIndex(tab)
        }
      break

      case 'Tab':
        if(event.ctrlKey) {
          if(event.shiftKey) vm.prev()
          else vm.next()
        }
      break
    }
  })
}
