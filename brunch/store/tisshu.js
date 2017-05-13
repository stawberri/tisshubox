const {nativeImage, remote} = req('electron')
const Danbooru = req('danbooru')
const path = req('path')
const fs = req('fs')
const getImageColors = req('get-image-colors')
const fileType = req('file-type')

module.exports = {
  namespaced: true,

  state: {
    status: '',
    post: null,
    progress: '',
    data: null,
    colors: ['#f8e9e0', '#894e4b', '#d79e90', '#bd7d6a', '#947c85']
  },

  getters: {
    get uri() {
      let lastURL = ''
      return function(state, getters) {
        if(!state.data) return ''
        URL.revokeObjectURL(lastURL)
        return lastURL = URL.createObjectURL(new Blob(
          [state.data], {type: getters.mime}
        ))
      }
    },

    mime(state) {
      let type = fileType(state.data)
      if(type && type.mime) return type.mime
      else return ''
    }
  },

  mutations: {
    status(state, payload) {
      if(!('status' in payload)) return
      let {status} = payload
      switch(status) {
        case 'search':
        case 'download':
        case 'done':
          state.status = status
      }
    },

    post(state, payload) {
      if(!('post' in payload)) return
      state.post = payload.post
    },

    progress(state, payload) {
      state.progress = payload.progress
    },

    data(state, payload) {
      if(!payload.data) return
      state.data = payload.data
      state.mime = fileType(payload.data).mime
    },

    colors(state, payload) {
      let {colors} = payload
      if(!Array.isArray(colors)) return
      colors = colors.slice(0, 5)
      while(colors.length < 5)
        colors.push('#' + Math.floor(Math.random() * 0xffffff).toString(16))
      state.colors = colors
    }
  },

  actions: {
    async pull(context) {
      status('search')

      context.commit('progress', {progress: '0%'})
      let booru = context.rootGetters['credentials/danbooru']
      let post, error, attempts = 5
      let tags = context.rootState.config.searchTags
      do {
        try {
          let posts = await booru.posts({tags, random: true, limit: 100})
          let originalLength = posts.length

          let currentPostId = 0
          if(context.state.post) currentPostId = context.state.post.id
          let currentPost

          posts = posts.filter(post => {
            let prelim = (
              'request' in post.file &&
              ~post.file.ext.search(/^jpg|jpeg|jpe|jif|jfif|jfi|png$/)
            )
            if(!prelim) return false
            if(post.id !== currentPostId) return true
            currentPost = post
            return false
          })
          if(posts.length) {
            post = posts[Math.floor(Math.random() * posts.length)]
          } else {
            if(currentPost) post = currentPost
            else {
              if(!originalLength) attempts = Math.floor(attempts/2)
              throw new Error('could not find any posts matching your criteria')
            }
          }
        } catch(err) {
          if(--attempts < 0) throw err
          post = null
        }
      } while(!post)

      status('download')

      let download = post.file.download()
      download.data((progress, total) => {
        context.commit('progress', {
          progress: (100 * progress/total).toFixed() + '%'
        })
      })
      let data = await download
      context.commit('progress', {progress: '100%'})

      status('done')

      context.commit('post', {post})
      context.commit('data', {data})

      let colors = await getImageColors(data, context.getters.mime)
      colors = colors.map(color => color.hex())
      context.commit('colors', {colors})

      function status(status) {
        context.commit('status', {status})
      }
    }
  }
}
