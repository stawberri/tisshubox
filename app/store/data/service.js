const Vue = require('vue')

module.exports = store => {
  store.registerModule(['dataExtra', 'service'], {
    namespaced: true,
    state: () => ({
      template: null,
      computed: {}
    }),

    mutations: {
      template(state, {template}) {
        state.template = template
      },

      computed({computed}, {data}) {
        for(let key in data) Vue.set(computed, key, data[key])
      }
    }
  })

  store.registerModule(['data', 'service'], {
    namespaced: true,
    state: () => ({
      service: 'danbooru'
    }),

    getters: {
      template(state, getters, rootState) {
        return rootState.dataExtra.service.template
      },

      argObject(state, getters, rootState) {
        let {computed} = rootState.dataExtra.service
        let set = (target, data) => store.commit('data/service/set', {target, data})
        return {state, computed, set}
      },

      fetch(state, getters) {
        if(typeof getters.template.fetch === 'function')
          return options => getters.template.fetch(getters.argObject, options)
        else return () => []
      },

      stash(state, getters) {
        if(typeof getters.template.stash === 'function')
          return options => getters.template.stash(getters.argObject, options)
        else return () => {}
      },

      trash(state, getters) {
        if(typeof getters.template.trash === 'function')
          return options => getters.template.trash(getters.argObject, options)
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
      async loadService({state, commit, getters}) {
        commit(
          'dataExtra/service/template',
          {template: require(`scripts/services/${state.service}`)},
          {root: true}
        )
        await commit(
          'data/loadUnder',
          {key: 'service', data: getters.template.state},
          {root: true}
        )
        for(let key in getters.template.computed) {
          let compute = getters.template.computed[key]
          store.watch(
            () => compute.watch(state),
            () => commit(
              'dataExtra/service/computed',
              {data: {[key]: compute.value(state)}},
              {root: true}
            ),
            {immediate: true}
          )
        }
      }
    }
  })
}
