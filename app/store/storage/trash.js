module.exports = {
  namespaced: true,
  state: {
    posts: [],
    tags: {}
  },

  mutations: {
    post(state, {post}) {
      state.posts.push('' + post.id)

      let tags = Object.assign({}, state.tags)
      for(let tag of post.tags) tags[tag] = -~tags[tag]
      state.tags = tags
    }
  }
}
