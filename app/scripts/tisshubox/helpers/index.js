const menu = require('./menu')
const keys = require('./keys')
const notifications = require('./notifications')

module.exports = vm => {
  menu(vm)
  keys(vm)
  notifications(vm)
}
