const electron = req('electron')
const Vue = require('vue')
const store = require('store')
const tisshubox = require('./tisshubox')

let template
switch(electron.remote.getCurrentWindow().vue) {
  default:
    template = tisshubox(electron)
  break
}

template = Object.assign({store}, template)
document.body.appendChild(new Vue(template).$mount().$el)
