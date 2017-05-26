const Vue = require('vue')
const store = require('store')

let vm = new Vue(Object.assign(
  {store}, require('components')
))

document.addEventListener('DOMContentLoaded', ev => {
  document.body.append(vm.$mount().$el)
})
