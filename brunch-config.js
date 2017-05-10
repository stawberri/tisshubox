module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'}
  },

  paths: {
    public: 'renderer',
    watched: ['brunch']
  },

  plugins: {
    pug: {
      pugRuntime: false,
      staticPretty: false
    },

    vue: {
      babel: {}
    }
  },

  modules: {
    nameCleaner(path) {
      return path.replace(/^brunch\//, '')
    },
    autoRequire: {
      'app.js': ['scripts/index']
    }
  }
}
