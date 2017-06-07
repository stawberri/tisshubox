<template lang='pug'>
#tisshubox(:style='mainStyle')
  transition: pagebar(v-if='active' :c='c' @jump='jump' :outerAnim='animation')
  transition(:name='animation')
  .tisshuframe
    transition(:name='animation')
      .background(:key='tisshu.id' v-if='tisshu')
        .bg: .inner(v-if='tisshu.ready' :style='backgroundStyle')
    transition(
      :name='animation'
      @after-leave='colorOverride = null'
      @leave='leaveAnim'
      @after-enter='animation = "fade"'
    ): .wrapper(:key='tisshu.id' v-if='tisshu')
      tisshu(:c='c' :tisshu='tisshu')
  transition: buttons(v-if='active' :c='c' :tisshu='tisshu' @press='handleButton')
  update
</template>

<script>
const chroma = req('chroma-js')
const tisshuHelpers = require('scripts/tisshubox/helpers')

module.exports = {
  data: () => ({
    animation: 'fade',
    colorOverride: null,
    fetchTimeout: null,
    lastAnimationDone: () => {}
  }),

  computed: {
    tisshus() {
      return this.$store.state.posts.tisshus
    },

    tisshu() {
      return this.$store.getters['posts/tisshu']
    },

    c() {
      let c = [
        chroma(0xf8e9e0),
        chroma(0x894e4b),
        chroma(0xd79e90),
        chroma(0xbd7d6a),
        chroma(0x947c85)
      ]
      if(this.tisshu && this.tisshu.colors) c = this.tisshu.colors

      if(this.colorOverride) {
        if(this.colorOverride.c) c = this.colorOverride.c
        c = c.map(color => {
          let {brighten, darken} = this.colorOverride

          if(brighten) color = color.brighten(brighten)
          if(darken) color = color.darken(darken)

          return color
        })
      }

      return c
    },

    ids() {
      return this.$store.getters['posts/tisshuIds']
    },

    tisshuLength() {
      return this.tisshus.length
    },

    queueLength() {
      return this.$store.state.posts.queue.length
    },

    active() {
      return this.$store.getters['window/active']
    },

    focused() {
      return this.$store.state.window.focused
    },

    mainStyle() {
      let mainStyle = {
        background: this.c[0]
      }

      if(this.focused && !this.active)
        mainStyle.cursor = 'none'

      return mainStyle
    },

    backgroundStyle() {
      return {
        backgroundImage: `url(${this.tisshu.url})`
      }
    }
  },

  watch: {
    tisshuLength() {
      this.$store.dispatch('posts/populate')
    },

    queueLength() {
      if(!this.$store.getters['posts/queueHasEnough']) this.fetch()
    },

    tisshu() {
      if(this.tisshu && this.tisshu.post) {
        this.$store.commit('window/title', {title: this.tisshu.post.title})
      }
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
      if(this.tisshus.length < 2) return
      this.animation = 'right'
      this.$store.commit('posts/go', {offset: -1})
    },

    stash() {
      if(!(this.tisshu && this.tisshu.ready)) return
      let index = this.$store.state.posts.tisshuIndex
      this.animation = index === this.tisshuLength - 1 ? 'up-right' : 'up-left'
      this.colorOverride = {c: this.c.slice(), brighten: 2}
      let {tisshu} = this
      this.$store.commit('posts/delete')
      this.$store.dispatch('data/cache/stash', {tisshu})
    },

    trash() {
      if(!(this.tisshu && this.tisshu.ready)) return
      let index = this.$store.state.posts.tisshuIndex
      this.animation = index === this.tisshuLength - 1 ? 'down-right' : 'down-left'
      this.colorOverride = {c: this.c.slice(), darken: 2}
      let {tisshu} = this
      this.$store.commit('posts/delete')
      this.$store.dispatch('data/cache/trash', {tisshu})
    },

    next() {
      if(this.tisshus.length < 2) return
      this.animation = 'left'
      this.$store.commit('posts/go')
    },

    jump(id) {
      if(this.tisshus.length < 2) return
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

    jumpIndex(index) {
      if(index > this.ids.length - 1) index = this.ids.length - 1
      this.jump(this.ids[index])
    },

    leaveAnim(el, done) {
      this.lastAnimationDone()
      this.lastAnimationDone = done
      el.addEventListener('transitionend', event => {
        if(event.target === el) done()
      }, {once: true})
    },

    run(action) {
      let actionType, template
      if(!action.service) {
        actionType = 'action'
        template = this.$store.state.dataExtra.actions[action.name]
      } else {
        actionType = 'service action'
        // Service template
      }
      if(!template) throw new Error(`unknown ${actionType} ${action.name}`)
      let options = Object.assign({}, template.options || {}, action.options || {})
      return template.run({options, tisshu: this.tisshu})
    }
  },

  created() {
    tisshuHelpers(this)
    this.fetch({queueOnly: true})
  },

  beforeDestroy() {
    clearTimeout(this.fetchTimeout)
  },

  components: {
    pagebar: require('./pagebar'),
    tisshu: require('./tisshu'),
    buttons: require('./buttons'),
    update: require('./update')
  }
}
</script>
