const {remote} = req('electron')
const Vue = require('vue')
const store = require('store')
const tisshubox = require('./tisshubox')

let template
switch(remote.getCurrentWindow().vue) {
  default:
    template = tisshubox()
  break
}

template = Object.assign({store}, template)
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new Vue(template).$mount().$el)
})
