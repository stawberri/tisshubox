const {remote} = req('electron')
const Vue = require('vue')
const store = require('store')

let vm = new Vue(Object.assign(
  {store}, require('components/tisshubox')
))

document.addEventListener('DOMContentLoaded', ev => {
  document.body.append(vm.$mount().$el)
})

let tisshubox = remote.getCurrentWindow()
tisshubox.on('page-title-updated', (event, title) => {
  event.preventDefault()
  if(title) tisshubox.setTitle(`${title} — Tisshubox`)
  else tisshubox.setTitle(`Tisshubox`)
})
