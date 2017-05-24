const Danbooru = req('danbooru')

module.exports = {
  state: {
    auth: {},
    safe: true,
    searches: [
      {
        tags: 'score:5..'
      }
    ]
  },

  computed: {
    booru: {
      watch(state) {
        let {auth: {login, api_key}, safe} = state
        return JSON.stringify([login, api_key, safe])
      },
      value(state) {
        let {login, api_key} = state.auth
        let auth = (login && api_key) ? {login, api_key} : {}
        if(state.safe) return new Danbooru.Safebooru(auth)
        else return new Danbooru(auth)
      }
    },

    baseUrl: {
      watch(state) {
        return state.safe
      },
      value(state) {
        if(state.safe) return 'https://safebooru.donmai.us'
        else return 'https://danbooru.donmai.us'
      }
    }
  },

  async fetch({state, computed}, {page} = {}) {
    let posts = await Promise.all(state.searches.map(search => {
      let {tags} = search
      return computed.booru.posts(Object.assign(
        {limit: 100, page},
        {tags}
      ))
    }))
    posts = posts.reduce((posts, array) => [...posts, ...array], [])
    posts = posts.map(rawPost => {
      let id = rawPost.id

      let artists = rawPost.tags.artist.join(', ')
      artists = artists.replace(/_/g, ' ')

      if(!('request' in rawPost.file)) return {id}

      let post = {
        id,
        ext: rawPost.file.ext,
        download: computed.baseUrl + rawPost.raw.file_url
      }
      if(artists) post.title = `Drawn by ${artists}`

      return post
    })
    posts = posts.filter(post => !!post)
    return posts
  }
}
