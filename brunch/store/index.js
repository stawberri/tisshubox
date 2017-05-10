const Vue = require('vue')
const Vuex = require('vuex')

const tisshu = require('./tisshu')
const config = require('./config')
const credentials = require('./credentials')

Vue.use(Vuex)

module.exports = new Vuex.Store({
  modules: {tisshu, config, credentials}
})
