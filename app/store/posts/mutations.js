module.exports = {
  add(state, {post, noAlert}) {
    let id = +post.id
    let index = state.tisshus.findIndex(tisshu => tisshu.id === id)
    if(~index) throw new Error(`post ${id} already exists`)

    for(
      index = 0;
      state.tisshus.length > index &&
      state.tisshus[index].id > id;
      index++
    );

    state.tisshus.splice(index, 0, {
      id, post,
      noAlert,
      process: false,
      download: null,
      progress: null,
      url: '',
      error: null,
      ready: false,
      type: '',
      colors: null,
      seen: false
    })

    if(state.tisshus.length === 1) state.tisshuIndex = 0
    else if(index <= state.tisshuIndex) state.tisshuIndex++
    state.tisshus[state.tisshuIndex].seen = true
  },

  go(state, options = {}) {
    let length = state.tisshus.length
    if(!length) return state.tisshuIndex = 0

    let index = state.tisshuIndex
    switch(true) {
      case ('offset' in options):
        index += options.offset
      break

      case ('id' in options):
        index = state.tisshus.findIndex(tisshu => tisshu.id === +options.id)
        if(!~index) throw new Error('invalid id')
      break

      case ('index' in options):
        index = options.index
      break

      default:
        index++
      break
    }

    index = (index % length + length) % length

    state.tisshuIndex = index
    state.tisshus[index].seen = true
  },

  delete(state, {id} = {}) {
    let index = state.tisshuIndex
    if(typeof id !== 'undefined')
      index = state.tisshus.find(tisshu => tisshu.id === +id)
    if(!~index) return

    let {download, url} = state.tisshus[index]
    state.tisshus.splice(index, 1)
    if(download && typeof download.abort === 'function') download.abort()
    if(url) URL.revokeObjectURL(url)

    if(state.tisshuIndex > index) state.tisshuIndex--
    else if(state.tisshuIndex === state.tisshus.length)
      state.tisshuIndex = 0

    if(state.tisshus.length) state.tisshus[state.tisshuIndex].seen = true
  },

  edit(state, {id, data}) {
    id = +id
    let tisshu = state.tisshus.find(tisshu => tisshu.id === id)
    if(!tisshu) return

    for(let key in data) {
      if(key === 'id' && data.id !== tisshu.id)
        throw new Error("can't change post id")
      else if(key in tisshu)
        tisshu[key] = data[key]
      else {
        throw new Error(`invalid key ${key}`)
      }
    }
  },

  convey({conveyor}, {post} = {}) {
    if(post) conveyor.push(post)
    else conveyor.shift()
  },

  enqueue({queue}, {arrays}) {
    let index = 0
    while(arrays.find(array => array.length)) {
      let biggest = -2, value
      let endOfQueue = index === queue.length
      if(!endOfQueue) {
        biggest = -1
        value = +queue[index].id
      }

      arrays = arrays.filter(array => array.length)
      for(let current = 0; current < arrays.length; current++) {
        let id = +arrays[current][0].id
        if(id >= value || biggest === -2) {
          biggest = current
          value = id
        }
      }

      if(biggest === -1) index++
      else queue.splice(
        index,
        +(!endOfQueue && value === +queue[index].id),
        arrays[biggest].shift()
      )
    }
  },

  dequeue({queue}, {id} = {}) {
    let index = 0
    if(typeof id !== 'undefined')
      index = queue.find(post => +post.id === +id)
    if(~index) return queue.splice(index, 1)
  },

  reject({rejectedPosts}, {id}) {
    rejectedPosts.push(+id)
  },

  flag(state, options) {
    for(let key in options) {
      if(!(key in state)) throw new Error(`${key} is an invalid key`)
      if(typeof state[key] !== 'boolean') throw new Error(`${key} is not a flag`)
      switch(options[key]) {
        case true:
        case false:
          state[key] = options[key]
        break

        default:
          state[key] = !state[key]
        break
      }
    }
  },

  incrementRecursiveFetchPage(state) {
    state.recursiveFetchPage++
  }
}
