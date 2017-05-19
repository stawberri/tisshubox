<template lang='pug'>
#tisshubox(:style='{background: c[0]}')
  pagebar(:c='c' @jump='jump' :outerAnim='animation')
  .tisshuframe: transition(
    :name='animation'
    @after-leave='defaultColor = false'
    @after-enter='animation = "fade"'
  )
    .wrapper(:key='tisshu.id' v-if='tisshu')
      tisshu(:tisshu='tisshu')
    .wrapper(key='error' v-else-if='started && !queueLength')
      tisshu(:tisshu='noPosts')
  buttons(:c='c' @press='handleButton')
</template>

<script>
const {remote} = req('electron')
const chroma = req('chroma-js')

module.exports = {
  data: () => ({
    animation: 'fade',
    defaultColor: false,
    started: false,
    noPosts: {
      error: new Error('no posts found')
    }
  }),

  computed: {
    tisshu() {
      let {tisshuIndex} = this.$store.state.posts
      let {tisshus} = this.$store.state.posts
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
    },

    queueLength() {
      return this.$store.state.posts.queue.length
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
      this.$store.dispatch('posts/populate')
    },

    trash() {
      if(!this.tisshu) return
      this.animation = 'down'
      this.defaultColor = true
      let {post} = this.tisshu
      this.$store.commit('posts/delete')
      this.$store.dispatch('data/cache/trash', {post})
      this.$store.dispatch('posts/populate')
    },

    next() {
      if(this.$store.state.posts.tisshus.length < 2) return
      this.animation = 'left'
      this.$store.commit('posts/go')
    },

    jump(id) {
      let {tisshuIndex} = this.$store.state.posts
      let ids = this.$store.getters['posts/tisshuIds']
      let newIndex = ids.indexOf(id)
      if(~newIndex) {
        if(newIndex > tisshuIndex) this.animation = 'fade-left'
        else this.animation = 'fade-right'
      }
      this.$store.commit('posts/go', {id})
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch('posts/fetch', {queueOnly: true})
    } catch(err) {
      console.error(err)
    }
    this.started = true
  },

  components: {
    pagebar: require('./pagebar'),
    tisshu: require('./tisshu'),
    buttons: require('./buttons')
  }
}
</script>
