module.exports = {
  add(state, {post}) {
    let id = +post.id
    let index = state.tisshus.findIndex(tisshu => tisshu.id === id)
    if(~index) return state.tisshus[index].post = post

    for(
      index = 0;
      state.tisshus.length > index &&
      state.tisshus[index].id > id;
      index++
    );

    state.tisshus.splice(index, 0, {id, post})
    if(state.tisshus.length === 1) state.tisshuIndex = 0
    else if(index <= state.tisshuIndex) state.tisshuIndex++
  },

  next(state) {
    if(!state.tisshus.length) return
    let {tisshuIndex: i, tisshus: t} = state
    state.tisshuIndex = ++i % t.length
  },

  prev(state) {
    if(!state.tisshus.length) return
    let {tisshuIndex: i, tisshus: t} = state
    state.tisshuIndex = (--i + t.length) % t.length
  },

  delete(state, {id} = {}) {
    let index = state.tisshuIndex
    if(typeof id !== 'undefined')
      index = state.tisshus.find(tisshu => tisshu.id === +id)
    if(!~index) return

    state.tisshus.splice(index, 1)
    if(state.tisshuIndex > index) state.tisshuIndex--
    else if(state.tisshuIndex === state.tisshus.length)
      state.tisshuIndex = 0
  },

  edit(state, {id, data}) {
    id = +id
    let index = state.tisshus.findIndex(tisshu => tisshu.id === id)
    state.tisshus.splice(index, 1, Object.assign(
      {}, state.tisshus[index], data, {id}
    ))
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
      index = queue.find(post => post.id === '' + id)
    if(~index) return queue.splice(index, 1)
  }
}
