const fileType = req('file-type')
const getImageColors = req('get-image-colors')
const chroma = req('chroma-js')

module.exports = {
  async populate({state, commit, dispatch}) {
    if(state.populating) return
    commit('populating', {value: true})
    while(state.tisshus.length < 9) {
      if(!state.queue.length) await dispatch('fetch')
      commit('add', {post: state.queue[0], noAlert: true})
      commit('dequeue')
      dispatch('process')
      await new Promise(resolve => setTimeout(resolve, 690))
    }
    commit('populating', {value: false})
  },

  async fetch({rootState, commit, dispatch, getters, rootGetters}, {queueOnly} = {}) {
    let booru = rootGetters['data/booru/']
    let {searches} = rootState.data.booru
    let postsFound = 0

    let arrays = await Promise.all(searches.map(search => new Promise(async (resolve, reject) => {
      let posts = await booru.posts(Object.assign({limit: 100}, search))
      posts.sort((a, b) => +b.id - +a.id)

      let queuePosts = []
      for(let post of posts) {
        switch(true) {
          case (rootGetters['data/cache/ids'].includes(+post.id)):
          case !('request' in post.file):
          case !~post.file.ext.search(/^jpg|jpeg|jpe|jif|jfif|jfi|png$/):
            continue
          break
        }

        switch(true) {
          case getters.tisshuIds.includes(+post.id):
          case (!queueOnly && !getters.queueIds.includes(+post.id)):
            commit('add', {post})
            dispatch('process')
          break

          default:
            queuePosts.push(post)
          break
        }
        postsFound++
      }
      resolve(queuePosts)
    })))

    commit('enqueue', {arrays})
    if(!postsFound) throw new Error('no posts found')
  },

  async process({state, commit, dispatch, getters}) {
    let tasks = state.tisshus.filter(tisshu => !tisshu.process)

    await Promise.all(tasks.map(task => new Promise(async (resolve, reject) => {
      let {id, post} = task
      let url
      try {
        commit('edit', {id, data: {process: true}})

        let data = [], attempts = 3
        do {
          let {download} = await staggerDownload(post)
          commit('edit', {id, data: {download}})
          let progressThrottle
          download.data((part, total) =>
            commit('edit', {id, data: {progress: {part, total}}})
          )
          data = await download
        } while(!data.length && attempts--)
        if(!data.length) throw new Error('unable to download')

        url = URL.createObjectURL(new Blob([data]))
        commit('edit', {id, data: {download: null, url}})
        dispatch('workers/task', {task: {require: 'process-image', id, url}}, {root: true})

        if(!getters.tisshuIds.includes(id)) throw new Error('cancelled')
        resolve()
      } catch(error) {
        if(getters.tisshuIds.includes(id)) {
          commit('edit', {id, data: {error}})
        } else {
          if(url) URL.revokeObjectURL(url)
        }
      }
    })))
  },

  processResults({commit}, {id, data}) {
    data.colors = data.colors.map(color => chroma(color))
    commit('edit', {id, data})
  }
}

let staggerDownloadTime = 0
async function staggerDownload(post) {
  let now = Date.now()
  staggerDownloadTime += 300
  if(staggerDownloadTime < now) staggerDownloadTime = now
  await new Promise(resolve => setTimeout(resolve, staggerDownloadTime - now))
  return {download: post.file.download()}
}
