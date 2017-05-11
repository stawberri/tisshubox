const {nativeImage, remote} = req('electron')
const Danbooru = req('danbooru')
const path = req('path')
const fs = req('fs')

module.exports = {
  namespaced: true,

  state: {
    status: 'first',
    post: null,
    progress: {},
    data: null,
    postid: 0
  },

  getters: {
    uri(state) {
      let image = nativeImage.createFromBuffer(state.data)
      let uri = image.toDataURL()
      return uri
    }
  },

  mutations: {
    post(state, payload) {
      if(!('post' in payload)) return
      state.post = payload.post
      state.postid = payload.post.id
    },

    status(state, payload) {
      if(!('status' in payload)) return
      let {status} = payload
      switch(status) {
        case 'search':
          Object.assign(state, {
            status,
            post: null,
            progress: {},
            data: null
          })
        break

        case 'download':
          Object.assign(state, {
            status,
            progress: {},
            data: null
          })
        break

        case 'done':
          state.status = status
        break
      }
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

      let booru = context.rootGetters['credentials/danbooru']
      let post, error, attempts = 5
      let tags = context.rootState.config.tags
      do {
        try {
          let posts = await booru.posts({tags, random: true})
          let originalLength = posts.length
          posts = posts.filter(post => {
            return (
              'request' in post.file &&
              post.id !== context.state.postid &&
              ~post.file.ext.search(/^jpg|jpeg|jpe|jif|jfif|jfi|png$/)
            )
          })
          if(posts.length) {
            post = posts[Math.floor(Math.random() * posts.length)]
          } else {
            if(!originalLength) attempts = Math.floor(attempts/2)
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
      let data = await download
      context.commit('data', {data})

      status('done')

      function status(status) {
        context.commit('status', {status})
      }
    }
  }
}
