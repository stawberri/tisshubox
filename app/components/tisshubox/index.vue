<template lang='pug'>
#tisshubox(:style='{background: c[0]}')
  .tisshuframe: transition(
    :name='animation'
    :mode='animMode'
    @after-leave='defaultColor = false'
  ): .wrapper(:key='animKey')
    tisshu(:tisshu='tisshu || {}')
  buttons(:c='c' @press='handleButton')
</template>

<script>
const {remote} = req('electron')
const chroma = req('chroma-js')

module.exports = {
  data: () => ({
    animation: 'left',
    animating: false,
    animKey: false,
    defaultColor: false
  }),

  computed: {
    tisshus() {
      let tisshus = this.$store.state.posts.tisshus.slice()

      tisshus.index = this.$store.state.posts.tisshuIndex
      tisshus.current = tisshus[tisshus.index]

      return tisshus
    },

    tisshu() {
      return this.tisshus.current
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
    },

    animMode() {
      switch(this.animation) {
        // case 'up':
        // case 'down':
        //   return 'out-in'
        // break

        default:
          return ''
        break
      }
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
      this.animation = 'right'
      this.animKey = !this.animKey
      this.$store.commit('posts/prev')
    },

    stash() {
      this.animation = 'up'
      this.animKey = !this.animKey
      this.defaultColor = true
      this.$store.commit('posts/next')
    },

    trash() {
      this.animation = 'down'
      this.animKey = !this.animKey
      this.defaultColor = true
      this.$store.commit('posts/next')
    },

    next() {
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
    tisshu: require('./tisshu'),
    buttons: require('./buttons')
  }
}
</script>
