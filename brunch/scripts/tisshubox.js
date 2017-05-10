const template = require('components/tisshubox')

module.exports = ({remote}) => {
  document.documentElement.id = 'tisshubox'
  let tisshubox = remote.getCurrentWindow()

  tisshubox.setTitle('Tisshubox')
  tisshubox.setContentSize(450, 600)
  tisshubox.center()
  tisshubox.show()

  return template
}
