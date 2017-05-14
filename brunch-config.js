module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    pug: {
      pugRuntime: false
    },

    vue: {
      babel: {}
    }
  },

  modules: {
    autoRequire: {
      'app.js': ['scripts/index']
    }
  }
}
