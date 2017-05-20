<template lang='pug'>
#tisshubox(:style='{background: c[0]}')
  pagebar(:c='c' @jump='jump' :outerAnim='animation')
  .tisshuframe: transition(
    :name='animation'
    @after-leave='defaultColor = false'
    @leave='leaveAnim'
    @after-enter='animation = "fade"'
  )
    .wrapper(:key='tisshu.id' v-if='tisshu')
      tisshu(:tisshu='tisshu')
  buttons(:c='c' @press='handleButton')
</template>

<script>
const {remote} = req('electron')
const chroma = req('chroma-js')

module.exports = {
  data: () => ({
    animation: 'fade',
    defaultColor: false,
    fetchTimeout: null,
    lastAnimationDone: () => {}
  }),

  computed: {
    tisshu() {
      let {tisshuIndex} = this.$store.state.posts
      let {tisshus} = this.$store.state.posts
      return tisshus[tisshuIndex]
    },

    title() {
      let package = this.$store.state.package
      if(package.github && package.local.version !== package.github.version)
        return `Tisshubox v${package.local.version} — UPDATE AVAILABLE. PLEASE CHECK GITHUB FOR A NEWER VERSION.`

      let title = ''

      if(this.tisshu  && this.tisshu.post) {
        let artists = this.tisshu.post.tags.artist.join(', ')
        artists = artists.replace(/_/g, ' ')
        if(artists) title += `Drawn by ${artists}`
      }

      let hasTitle
      if(title) {
        hasTitle = true
        title += ' — '
      }
      title += `Tisshubox v${package.local.version}`
      if(!hasTitle) title += ` — ${package.local.description}`

      return title
    },

    c() {
      if(!this.defaultColor && this.tisshu && this.tisshu.colors)
        return this.tisshu.colors
      else return [
        chroma(0xf8e9e0),
        chroma(0x894e4b),
        chroma(0xd79e90),
        chroma(0xbd7d6a),
        chroma(0x947c85)
      ]
    },

    tisshuLength() {
      return this.$store.state.posts.tisshus.length
    },

    queueLength() {
      return this.$store.state.posts.queue.length
    }
  },

  watch: {
    title(title) {
      document.title = title
    },

    tisshuLength() {
      this.$store.dispatch('posts/populate')
    },

    queueLength() {
      if(!this.$store.getters['posts/queueHasEnough']) this.fetch()
    }
  },

  methods: {
    async fetch(options) {
      clearTimeout(this.fetchTimeout)
      await this.$store.dispatch('posts/fetch', options)
      this.fetchTimeout = setTimeout(() => this.fetch(), 30000)
    },

    handleButton(button) {
      switch(button) {
        case 'prev':
          this.prev()
        break
        case 'stash':
          this.stash()
        break
        case 'trash':
          this.trash()
        break
        case 'next':
          this.next()
        break
      }
    },

    prev() {
      if(this.$store.state.posts.tisshus.length < 2) return
      this.animation = 'right'
      this.$store.commit('posts/go', {offset: -1})
    },

    stash() {
      if(!this.tisshu) return
      this.animation = 'up'
      this.defaultColor = true
      let {post} = this.tisshu
      this.$store.commit('posts/delete')
      this.$store.dispatch('data/cache/stash', {post})
    },

    trash() {
      if(!this.tisshu) return
      this.animation = 'down'
      this.defaultColor = true
      let {post} = this.tisshu
      this.$store.commit('posts/delete')
      this.$store.dispatch('data/cache/trash', {post})
    },

    next() {
      if(this.$store.state.posts.tisshus.length < 2) return
      this.animation = 'left'
      this.$store.commit('posts/go')
    },

    jump(id) {
      if(this.$store.state.posts.tisshus.length < 2) return
      let {tisshus, tisshuIndex} = this.$store.state.posts
      let ids = this.$store.getters['posts/tisshuIds']
      let newIndex = ids.indexOf(id)
      if(~newIndex) {
        switch(true) {
          case (newIndex === 0 && tisshuIndex === tisshus.length - 1):
          case (newIndex === tisshuIndex + 1):
            this.animation = 'left'
          break
          case (tisshuIndex === 0 && newIndex === tisshus.length - 1):
          case (newIndex === tisshuIndex - 1):
            this.animation = 'right'
          break
          case (newIndex > tisshuIndex):
            this.animation = 'fade-left'
          break
          case (newIndex < tisshuIndex):
            this.animation = 'fade-right'
          break
          default:
            return
          break
        }
      }
      this.$store.commit('posts/go', {id})
    },

    leaveAnim(el, done) {
      this.lastAnimationDone()
      this.lastAnimationDone = done
      el.addEventListener('transitionend', event => {
        if(event.target === el) done()
      }, {once: true})
    }
  },

  async created() {
    this.fetch({queueOnly: true})
  },

  beforeDestroy() {
    clearTimeout(fetchTimeout)
  },

  components: {
    pagebar: require('./pagebar'),
    tisshu: require('./tisshu'),
    buttons: require('./buttons')
  }
}
</script>
