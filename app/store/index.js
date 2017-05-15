const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

module.exports = new Vuex.Store({
  plugins: [
    require('./data'),
    require('./posts')
  ]
})
