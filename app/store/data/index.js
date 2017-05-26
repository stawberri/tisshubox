const {remote: {app}} = req('electron')
const fs = req('fs')
const path = req('path')
const mkdirp = req('mkdirp2')
const Vue = require('vue')

module.exports = async (store, ...args) => {
  store.registerModule('dataExtra', {namespaced: true})

  store.registerModule('data', {
    namespaced: true,
    state: () => ({
      rootReady: false,
      rootPath: '',
      rootTimeout: null,
      rootChanged: [],
      rootCurrentSave: null,
      rootPendingSave: null
    }),

    getters: {
      json(state) {
        let json = {}
        for(let key in state) {
          json[key] = JSON.stringify(state[key])
        }
        return json
      }
    },

    mutations: {
      ready(state) {
        state.rootReady = true
      },

      load(state, {key, data}) {
        if(!(key in state)) throw new Error(`invalid data key ${key}`)
        let dest = state[key]
        for(let key in data) Vue.set(dest, key, data[key])
      },

      loadUnder(state, {key, data}) {
        if(!(key in state)) throw new Error(`invalid data key ${key}`)
        let dest = state[key]
        for(let key in data) if(!(key in dest)) Vue.set(dest, key, data[key])
      },

      scheduleSave(state, {key}) {
        if(!(key in state)) throw new Error(`invalid data key ${key}`)
        if(state.rootChanged.includes(key)) return
        state.rootChanged.push(key)
        if(!state.rootTimeout) state.rootTimeout = saveTimeout()
      },

      clearSave(state) {
        state.rootChanged = []
      },

      clearTimeout(state, {timeout} = {}) {
        if(state.rootTimeout) {
          clearTimeout(state.rootTimeout)
          state.rootTimeout = null
        }
        if(state.rootChanged.length || timeout)
          state.rootTimeout = timeout ? timeout : saveTimeout()
      },

      current(state, {promise}) {
        currentSave = promise
      },

      pending(state, {promise}) {
        pendingSave = promise
      },

      profilePath(state, {profilePath}) {
        state.rootPath = profilePath
      }
    },

    actions: {
      async getProfile({state, commit}) {
        let data
        let userData = path.join(app.getPath('userData'), '0.0.0')
        let dataPath = path.join(userData, 'index.json')
        try {
          data = req(dataPath)
        } catch(e) {
          data = {profile: 'default'}
        }
        let profilePath = path.join(userData, data.profile)
        commit('profilePath', {profilePath})
      },

      async load({state, commit}) {
        let files
        try {
          files = await new Promise((s, j) =>
            fs.readdir(state.rootPath, (e, d) => e ? j(e) : s(d))
          )
        } catch(error) {
          return
        }
        files = files.filter(file => path.extname(file) === '.json')
        await Promise.all(files.map(file => new Promise(async (resolve, reject) => {
          let data
          data = await new Promise((s, j) => {
            fs.readFile(path.join(state.rootPath, file), (e, d) => e ? j(e) : s(d))
          })
          data = JSON.parse(data)
          commit('load', {key: path.basename(file, '.json'), data})
          resolve()
        })))
      },

      async save({state, commit, getters}) {
        let resolve
        let promise = new Promise(r => resolve = r)
        if(!state.rootCurrentSave) {
          commit('current', {promise})

          commit('clearTimeout', {timeout: {}})
          await performSave()
          commit('clearTimeout')

          resolve()
          commit('current', {promise: null})
        } else if(!state.rootPendingSave) {
          commit('pending', {promise})

          await state.rootCurrentSave
          await performSave()

          resolve()
          commit('pending', {promise: null})
        } else {
          await state.rootPendingSave
          resolve()
        }

        async function performSave() {
          let {rootChanged: changed} = state
          let {json} = getters
          if(!changed.length) return
          commit('clearSave')
          await Promise.all(changed.map(change => new Promise(async(resolve, reject) => {
            if(!(change in json)) reject(new Error(`invalid data key ${change}`))
            let data = json[change]
            await mkdirp.promise(state.rootPath)
            fs.writeFile(path.join(state.rootPath, `${change}.json`), data, error => {
              if(error) reject(error)
              else resolve()
            })
          })))
        }
      }
    }
  })

  for(let plugin of [
    'service', 'cache', 'actions'
  ]) require(`./${plugin}`)(store, ...args)

  await store.dispatch('data/getProfile')
  await store.dispatch('data/load')
  await store.dispatch('data/service/loadService')
  store.subscribe(({type}, {data}) => {
    let match = type.match(/^data\/([^/]+)\//)
    if(!match) return
    let key = match[1]
    if(Object(data[key]) !== data[key]) return
    store.commit('data/scheduleSave', {key})
  })
  store.commit('data/ready')

  function saveTimeout() {
    return setTimeout(() => store.dispatch('data/save'), 60000)
  }
}
