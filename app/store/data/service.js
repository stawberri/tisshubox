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
        return {state, computed}
      },

      fetch(state, getters) {
        return options => service.template.fetch(getters.argObject, options)
      }
    },

    mutations: {
      set(store, {data}) {
        for(let key of data) {
          if(key === 'service') throw new Error(`can't edit service`)
          if(key in store) store[key] = data[key]
          else throw new Error(`key ${key} does not exist`)
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
