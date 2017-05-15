module.exports = {
  async populate({state, commit, dispatch}) {
    while(state.tisshus.length < 9) {
      if(!state.queue.length) await dispatch('fetch')
      commit('add', {post: state.queue[0]})
      commit('dequeue')
    }
    dispatch('download')
  },

  async fetch({rootState, commit, getters, rootGetters}, {initial}) {
    let booru = rootGetters['data/booru/']
    let {searches} = rootState.data.booru
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
