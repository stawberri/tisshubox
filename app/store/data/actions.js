const {remote: {app}} = req('electron')
const path = req('path')
const mkdirp = req('mkdirp2')
const fs = req('fs')

module.exports = store => {
  store.registerModule(['data', 'actions'], {
    namespaced: true,

    state: () => ({
      stash: [
        {name: 'save'}
      ],
      trash: []
    }),

    getters: {
      stash(state, getters, rootState) {
        let actions = state.stash.map(action => {
          let template = rootState.dataExtra.actions.templates[action.name]
          if(!template) throw new Error(`unknown action ${action.name}`)
          let options = Object.assign({}, template.options || {}, action.options || {})

          return tisshu => template.run({options, tisshu})
        })
        return async tisshu => await Promise.all(actions.map(action => action(tisshu)))
      },

      trash(state, getters, rootState) {
        let actions = state.trash.map(action => {
          let template = rootState.dataExtra.actions.templates[action.name]
          if(!template) throw new Error(`unknown action ${action.name}`)
          let options = Object.assign({}, template.options || {}, action.options || {})

          return tisshu => template.run({options, tisshu})
        })
        return async tisshu => await Promise.all(actions.map(action => action(tisshu)))
      }
    }
  })

  store.registerModule(['dataExtra', 'actions'], {
    namespaced: true,

    state: () => ({
      templates: {
        save: {
          options: {
            path: path.join(app.getPath('downloads'), app.getName(), store.state.data.service.service)
          },

          async run({options, tisshu: {id, ext, data}}) {
            await mkdirp.promise(options.path)
            let filepath = path.join(options.path, `${id}.${ext}`)

            fs.writeFile(filepath, data())
          }
        }
      }
    })
  })
}
