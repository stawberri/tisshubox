module.exports = store => {
  store.registerModule('posts', {
    namespaced: true,
    state: {
      tisshuIndex: 0,
      tisshus: [],
      queue: []
    },

    getters: {
      tisshu(state) {
        return state.tisshus[state.tisshuIndex]
      },

      queueIds(state) {
        return state.queue.map(post => post.id)
      }
    },

    mutations: {
      add(state, {post}) {
        let id = +post.id
        let index = state.tisshus.findIndex(tisshu => tisshu.id === id)
        if(~index) return state.tisshus[index].post = post

        for(
          index = 0;
          state.tisshus.length > index &&
          state.tisshus[index].id > id;
          index++
        );

        state.tisshus.splice(index, 0, {id, post})
        if(state.tisshus.length === 1) state.tisshuIndex = 0
        else if(index <= state.tisshuIndex) state.tisshuIndex++
      },

      next(state) {
        if(!state.tisshus.length) return
        let {tisshuIndex: i, tisshus: t} = state
        state.tisshuIndex = ++i % t.length
      },

      prev(state) {
        if(!state.tisshus.length) return
        let {tisshuIndex: i, tisshus: t} = state
        state.tisshuIndex = (--i + t.length) % t.length
      },

      delete(state, {id} = {}) {
        let index = state.tisshuIndex
        if(typeof id !== 'undefined')
          index = state.tisshus.find(tisshu => tisshu.id === +id)
        if(!~index) return

        state.tisshus.splice(index, 1)
        if(state.tisshuIndex > index) state.tisshuIndex--
        else if(state.tisshuIndex === state.tisshus.length)
          state.tisshuIndex = 0
      },

      edit(state, {id, data}) {
        id = +id
        let index = state.tisshus.findIndex(tisshu => tisshu.id === id)
        state.tisshus.splice(index, 1, Object.assign(
          {}, state.tisshus[index], data, {id}
        ))
      },

      enqueue({queue}, {arrays}) {
        let index = 0
        while(arrays.find(array => array.length)) {
          let biggest = -2, value
          let endOfQueue = index === queue.length
          if(!endOfQueue) {
            biggest = -1
            value = +queue[index].id
          }

          arrays = arrays.filter(array => array.length)
          for(let current = 0; current < arrays.length; current++) {
            let id = +arrays[current][0].id
            if(id >= value || biggest === -2) {
              biggest = current
              value = id
            }
          }

          if(biggest === -1) index++
          else queue.splice(
            index,
            +(!endOfQueue && value === +queue[index].id),
            arrays[biggest].shift()
          )
        }
      },

      dequeue({queue}, {id} = {}) {
        let index = 0
        if(typeof id !== 'undefined')
          index = queue.find(post => post.id === '' + id)
        if(~index) return queue.splice(index, 1)
      }
    },

    actions: {
      async populate({state, commit, dispatch}) {
        while(state.tisshus.length < 9) {
          if(!state.queue.length) await dispatch('fetch')
          commit('add', {post: state.queue[0]})
          commit('dequeue')
        }
        dispatch('download')
      },

      async fetch({rootState, commit, getters, rootGetters}, {initial}) {
        let booru = rootGetters['storage/booru/']
        let {searches} = rootState.storage.booru
        let postsFound = 0

        let arrays = await Promise.all(searches.map(search => new Promise(async (resolve, reject) => {
          let posts = await booru.posts(Object.assign({
            limit: 100
          }, search))
          posts.sort()

          let queuePosts = []
          for(let post of posts) {
            if(!('request' in post.file)) continue

            if(!initial && !getters.queueIds.includes(post.id))
              commit('add', {post})
            else queuePosts.push(post)
            postsFound++
          }
          resolve(queuePosts)
        })))

        commit('enqueue', {arrays})
        if(!postsFound) throw new Error('no posts found')
      },

      async download({state, commit}) {
        let tasks = state.tisshus.filter(tisshu => !tisshu.download)

        await Promise.all(tasks.map(task => new Promise(async (resolve, reject) => {
          let {id, post} = task
          commit('edit', {id, data: {download: true}})

          let download = post.file.download()
          download.data((part, total) => {
            commit('edit', {id, data: {progress: {part, total}}})
          })
          let data = await download
          commit('edit', {id, data: {data}})

          resolve()
        })))
      }
    }
  })
}
