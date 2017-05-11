const {nativeImage, remote} = req('electron')
const Danbooru = req('danbooru')
const path = req('path')
const fs = req('fs')
const getImageColors = req('get-image-colors')
const fileType = require('file-type')

module.exports = {
  namespaced: true,

  state: {
    status: '',
    post: null,
    postid: 0,
    progress: {progress: 0, total: 0},
    data: null,
    mime: '',
    colors: ['#f8e9e0', '#894e4b', '#d79e90', '#bd7d6a', '#947c85']
  },

  getters: {
    uri(state) {
      if(!state.data) return ''
      let image = nativeImage.createFromBuffer(state.data)
      let uri = image.toDataURL()
      return uri
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
      state.postid = payload.post.id
    },

    progress(state, payload) {
      let {progress, total} = payload
      state.progress = {progress, total}
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

      context.commit('progress', {progress: 0, total: 0})
      let booru = context.rootGetters['credentials/danbooru']
      let post, error, attempts = 5
      let tags = context.rootState.config.searchTags
      do {
        try {
          let posts = await booru.posts({tags, random: true, limit: 100})
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
      context.commit('progress', {progress: 1, total: 1})
      context.commit('data', {data})
      context.dispatch('computeColors')

      status('done')

      getImageColors(data, context.state.mime).then(colors => {
        colors = colors.map(color => color.hex())
        context.commit('colors', {colors})
      })

      function status(status) {
        context.commit('status', {status})
      }
    }
  }
}
