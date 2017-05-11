const {remote} = req('electron')
const Vue = require('vue')
const store = require('store')

let template = require('./tisshubox')()

template = Object.assign({store}, template)
document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(new Vue(template).$mount().$el)
})
