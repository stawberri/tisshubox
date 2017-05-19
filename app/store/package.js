const {remote} = req('electron')
const https = req('https')

module.exports = store => {
  store.registerModule('package', {
    namespaced: true,

    state: () => ({
      local: remote.require('./package'),
      github: null
    }),

    mutations: {
      githubData(state, {data}) {
        if(state.github) throw new Error('already has github data')
        state.github = data
      }
    }
  })

  let request = https.get('https://raw.githubusercontent.com/stawberri/tisshubox/master/package.json')
  request.on('response', async response => {
    response.setEncoding('utf8')
    let body = ''
    response.on('data', chunk => body += chunk)
    await new Promise(resolve => response.on('end', resolve))
    let data = JSON.parse(body)
    store.commit('package/githubData', {data})
  })
}
