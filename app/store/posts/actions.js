let fileType = req('file-type')
let getImageColors = req('get-image-colors')

module.exports = {
  async populate({state, commit, dispatch}) {
    while(state.tisshus.length < 9) {
      if(!state.queue.length) await dispatch('fetch')
      commit('add', {post: state.queue[0]})
      commit('dequeue')
    }
    dispatch('process')
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

  async process({state, commit}) {
    let tasks = state.tisshus.filter(tisshu => !tisshu.process)

    await Promise.all(tasks.map(task => new Promise(async (resolve, reject) => {
      let {id, post} = task
      commit('edit', {id, data: {process: true}})

      await new Promise(r => setTimeout(r, Math.random() * 3000))

      let {download} = await staggerDownload(post)
      download.data((part, total) => {
        commit('edit', {id, data: {progress: {part, total}}})
      })
      let data = await download
      let type = fileType(data).mime
      let colors = getImageColors(data, type)
      let url = URL.createObjectURL(new Blob([data], {type}))

      colors = await colors
      commit('edit', {id, data: {data, type, colors, url}})

      resolve()
    })))
  }
}

let staggerDownloadTime = 0
async function staggerDownload(post) {
  let now = Date.now()
  if(staggerDownloadTime < now) staggerDownloadTime = now
  staggerDownloadTime += 500 + Math.random() * 1000
  await new Promise(resolve => setTimeout(resolve, staggerDownloadTime - now))
  return {download: post.file.download()}
}
