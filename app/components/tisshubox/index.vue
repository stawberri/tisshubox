<template lang='pug'>
#tisshubox(:style='{background: c[0]}')
  pagebar(:c='c')
  .tisshuframe: transition(
    :name='animation'
    @after-leave='defaultColor = false'
    @after-enter='animation = ""'
  )
    .wrapper(:key='animKey' v-if='tisshu')
      tisshu(:tisshu='tisshu')
  buttons(:c='c' @press='handleButton')
</template>

<script>
const {remote} = req('electron')
const chroma = req('chroma-js')

module.exports = {
  data: () => ({
    animation: '',
    animating: false,
    animKey: false,
    defaultColor: false
  }),

  computed: {
    tisshu() {
      let {tisshuIndex} = this.$store.state.posts
      let tisshus = this.$store.getters['posts/tisshus']
      return tisshus[tisshuIndex]
    },

    title() {
      if(!this.tisshu || !this.tisshu.post) return ''
      let artists = this.tisshu.post.tags.artist.join(', ')
      artists = artists.replace(/_/g, ' ')
      if(artists) return `Drawn by ${artists}`
      else return 'Artist unknown'
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
    }
  },

  watch: {
    title(title) {
      document.title = title
    }
  },

  methods: {
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
      if(this.$store.getters['posts/tisshus'].length < 2) return
      this.animation = 'right'
      this.animKey = !this.animKey
      this.$store.commit('posts/prev')
    },

    stash() {
      if(!this.tisshu) return
      this.animation = 'up'
      this.animKey = !this.animKey
      this.defaultColor = true
      this.$store.commit('posts/delete')
    },

    trash() {
      if(!this.tisshu) return
      this.animation = 'down'
      this.animKey = !this.animKey
      this.defaultColor = true
      this.$store.commit('posts/delete')
    },

    next() {
      if(this.$store.getters['posts/tisshus'].length < 2) return
      this.animation = 'left'
      this.animKey = !this.animKey
      this.$store.commit('posts/next')
    }
  },

  async mounted() {
    await this.$store.dispatch('posts/fetch', {queueOnly: true})
    await this.$store.dispatch('posts/populate')
  },

  components: {
    pagebar: require('./pagebar'),
    tisshu: require('./tisshu'),
    buttons: require('./buttons')
  }
}
</script>
