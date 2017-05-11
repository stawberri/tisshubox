const {remote} = req('electron')
const template = require('components/tisshubox')

module.exports = () => {
  document.documentElement.id = 'tisshubox'
  let tisshubox = remote.getCurrentWindow()

  tisshubox.setTitle('Tisshubox')
  tisshubox.setContentSize(1280, 720)
  tisshubox.center()

  return template
}
