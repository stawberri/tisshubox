const Vue = require('vue')

module.exports = store => {
  let service = {}

  store.registerModule(['data', 'service'], {
    namespaced: true,
    state: () => ({
      service: 'danbooru'
    }),

    getters: {
      argObject(state) {
        let {computed} = service
        let set = (target, data) => store.commit('data/service/set', {target, data})
        return {state, computed, set}
      },

      fetch(state, getters) {
        if(typeof service.template.fetch === 'function')
          return options => service.template.fetch(getters.argObject, options)
        else return () => []
      },

      stash(state, getters) {
        if(typeof service.template.stash === 'function')
          return options => service.template.stash(getters.argObject, options)
        else return () => {}
      },

      trash(state, getters) {
        if(typeof service.template.trash === 'function')
          return options => service.template.trash(getters.argObject, options)
        else return () => {}
      }
    },

    mutations: {
      set(store, {target = store, data}) {
        if(Object(target) !== target) throw new Error(`target isn't an object`)
        for(let key in data) {
          if(target === store) {
            if(key === 'service') throw new Error(`can't edit service`)
            if(key in store) store[key] = data[key]
            else throw new Error(`key ${key} does not exist`)
          } else Vue.set(target, key, data[key])
        }
      }
    },

    actions: {
      async loadService({state, commit}) {
        service.template = require(`scripts/services/${state.service}`)
        await commit(
          'data/loadUnder',
          {key: 'service', data: service.template.state},
          {root: true}
        )
        service.computed = {}
        for(let key in service.template.computed) {
          let compute = service.template.computed[key]
          store.watch(
            () => compute.watch(state),
            () => service.computed[key] = compute.value(state),
            {immediate: true}
          )
        }
      }
    }
  })
}
