const Danbooru = req('danbooru')

module.exports = {
  namespaced: true,

  state: {
    status: 'first',
    post: null,
    progress: {},
    data: null
  },

  mutations: {
    post(state, payload) {
      if(payload.post) state.post = payload.post
    },

    status(state, payload) {
      if(payload.status) state.status = payload.status
    },

    progress(state, payload) {
      let {progress, total} = payload
      state.progress = {progress, total}
    },

    data(state, payload) {
      if(payload.data) state.data = payload.data
    }
  },

  actions: {
    async fetch(context) {
      status('search')
      await new Promise(r => setImmediate(r))

      let booru = context.rootGetters['credentials/danbooru']
      let post, error, attempts = 5
      let tags = context.rootState.config.tags
      do {
        try {
          let posts = await booru.posts({tags, random: true})
          post = posts.find(post => {
            return 'request' in post.file
          })
          if(!post) {
            if(!posts.length) attempts = Math.floor(attempts/2)
            throw new Error('could not find any posts matching your criteria')
          }
        } catch(err) {
          if(--attempts < 0) throw err
          post = null
        }
      } while(!post)
      context.commit('post', {post})

      status('download')
      let download = post.file.download()
      download.data((progress, total) => {
        context.commit('progress', {progress, total})
      })
      context.commit('data', {data: await download})

      status('done')

      function status(status) {
        context.commit('status', {status})
      }
    }
  }
}
