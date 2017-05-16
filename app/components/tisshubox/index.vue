<template lang="pug">
#tisshubox(:style='{background: c[0]}')
  tisshu(v-if='tisshu' :tisshu='tisshu')
</template>

<script>
const {remote} = req('electron')
const chroma = req('chroma-js')

module.exports = {
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
      let colors = [
        chroma(0xf8e9e0),
        chroma(0x894e4b),
        chroma(0xd79e90),
        chroma(0xbd7d6a),
        chroma(0x947c85)
      ]

      if(this.tisshu && this.tisshu.colors)
        colors = this.tisshu.colors.slice()

      colors.sort((a, b) =>
        chroma.contrast(a, '#fff') - chroma.contrast(b, '#fff')
      )

      return colors
    }
  },

  watch: {
    title(title) {
      document.title = title
    }
  },

  async mounted() {
    await this.$store.dispatch('posts/fetch', {initial: true})
    await this.$store.dispatch('posts/populate')
  },

  components: {
    tisshu: require('./tisshu')
  }
}
</script>
