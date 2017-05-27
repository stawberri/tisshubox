const menu = require('./menu')
const keys = require('./keys')

module.exports = vm => {
  menu(vm)
  keys(vm)
}
