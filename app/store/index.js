const Vue = require('vue')
const Vuex = require('vuex')
Vue.use(Vuex)

module.exports = new Vuex.Store({
  mutations: {
    set(state, {target, data}) {
      if(Object(target) !== target) throw new Error(`target isn't an object`)
      if(target === state) throw new Error("can't modify root state")
      for(let key in data) Vue.set(target, key, data[key])
    }
  },

  plugins: [
    require('./data'),
    require('./posts'),
    require('./workers'),
    require('./package'),
    require('./window')
  ]
})
