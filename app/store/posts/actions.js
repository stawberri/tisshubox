const {remote: {net}} = req('electron')
const fileType = req('file-type')
const getImageColors = req('get-image-colors')
const chroma = req('chroma-js')

const fetchRecursive = Symbol('fetch recursive')
module.exports = {
  async populate({state, commit, dispatch}) {
    if(state.populating) return
    commit('flag', {populating: true})
    while(
      state.conveyor.length ||
      state.tisshus.length < 9
    ) {
      if(state.conveyor.length) {
        commit('add', {post: state.conveyor[0]})
        commit('convey')
      } else if(state.queue.length) {
        commit('add', {post: state.queue[0], noAlert: true})
        commit('dequeue')
      } else return
      dispatch('process')
      await new Promise(resolve => setTimeout(resolve, 690))
    }
    commit('flag', {populating: false})
  },

  async fetch(
    {state, rootState, commit, dispatch, getters, rootGetters},
    {queueOnly, recursive, tryPage} = {}
  ) {
    recursive = recursive === fetchRecursive
    if(state.fetching && !recursive) return
    commit('flag', {fetching: true})

    let newPosts = 0
    let fetchedPosts = 0
    let queuedPosts = 0

    let page = recursive ? (tryPage || state.recursiveFetchPage) : 1
    let arrays = await new Promise(async (resolve, reject) => {
      let posts = await rootGetters['data/service/fetch']({page})
      fetchedPosts += posts.length
      posts.sort((a, b) => b.id - a.id)

      let queuePosts = []
      for(let post of posts) {
        let id = post.id
        let oldestTisshuId = getters.tisshuIds[getters.tisshuIds.length - 1]

        switch(true) {
          case (post.skip):
          case (!post.download):
          case !~post.ext.search(/^jpg|jpeg|jpe|jif|jfif|jfi|png$/):
            commit('reject', {id})
            newPosts++

          case state.rejectedPosts.includes(id):
          case (('' + id) in rootState.data.cache.posts):
            continue
          break
        }

        switch(true) {
          default:
            newPosts++
          case getters.queueIds.includes(id):
            queuePosts.push(post)
          break

          case getters.tisshuIds.includes(id):
            commit('edit', {id, data: {post}})
          break

          case (!queueOnly && id > oldestTisshuId):
            newPosts++
            commit('convey', {post})
          break
        }
      }

      queuedPosts += queuePosts.length
      resolve(queuePosts)
    })

    if(queuedPosts) commit('enqueue', {arrays})
    if(!fetchedPosts) commit('flag', {fetchedLastPage: true})
    if(recursive) {
      if(tryPage++) {
        if(newPosts && tryPage < state.recursiveFetchPage) await fetch({tryPage})
      } else if(!state.fetchedLastPage) commit('incrementRecursiveFetchPage')
    } else {
      if(newPosts && state.recursiveFetchPage > 2) await fetch({tryPage: 2})
      while(!state.fetchedLastPage && !getters.queueHasEnough) await fetch({queueOnly: true})
      commit('flag', {fetching: false})
      dispatch('populate')
    }

    async function fetch(options) {
      await new Promise(resolve => setTimeout(resolve, 1000 + searches.length * 100))
      await dispatch('fetch', Object.assign({recursive: fetchRecursive}, options))
    }
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
          await staggerDownload(post)
          let request = net.request(post.download)
          request.on('error', err => {throw err})
          let download = new Promise(resolve => request.on('response', resolve))
          request.end()
          download = await download
          commit('edit', {id, data: {download}})

          let total = +download.headers['content-length']
          let part = 0
          data = Buffer.allocUnsafe(total)
          let complete = new Promise(resolve => download.on('end', resolve))
          download.on('error', err => {throw err})
          download.on('data', chunk => {
            let {length} = chunk
            part += chunk.copy(data, part)
            commit('edit', {id, data: {progress: {part, total}}})
          })
          await complete
        } while(!data.length && attempts--)
        if(!data.length) throw new Error('unable to download')

        url = URL.createObjectURL(new Blob([data]))
        commit('edit', {id, data: {download: null, url, data: () => data}})
        dispatch('workers/task', {task: {require: 'process-image', id, data}}, {root: true})

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
}
