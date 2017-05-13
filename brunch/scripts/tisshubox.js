const {remote} = req('electron')
const template = require('components/tisshubox')

module.exports = () => {
  let tisshubox = remote.getCurrentWindow()
  let version = remote.require('./package').version

  tisshubox.setTitle(`Tisshubox v${version}`)
  tisshubox.setContentSize(1280, 720)
  tisshubox.center()

  return template
}
