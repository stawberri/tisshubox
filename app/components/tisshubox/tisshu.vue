<template lang='pug'>
.tisshu
  .picture(v-if='ready' :style='pictureStyle')
  .message(v-else-if='error' :style='{color: c[1]}')
    .icon: .fa.fa-exclamation-triangle
    .text(:style='{color: c[4]}')
      .primary error encountered
      .secondary(:style='{color: c[3]}') {{error}}
  .message(v-else-if='tisshu.url')
    .icon: .fa.fa-circle-o-notch.fa-spin
    .text(:style='{color: c[4]}') processing image
  .message(v-else-if='percent')
    .icon: .fa.fa-refresh.fa-spin
    .text(:style='{color: c[4]}')
      .primary {{percent}}
      .secondary(:style='{color: c[3]}') downloading
  .message(v-else)
    .icon: .fa.fa-cog.fa-spin
    .text(:style='{color: c[4]}') beginning download
</template>

<script>
module.exports = {
  props: ['c'],

  computed: {
    tisshu() {
      return this.$store.state.posts.tisshus[this.$store.state.posts.tisshuIndex]
    },

    pictureStyle() {
      let {tisshu} = this

      return {
        width: tisshu.size.width + 'px',
        height: tisshu.size.height + 'px',
        backgroundImage: `url(${this.tisshu.url})`
      }
    },

    percent() {
      let {progress} = this.tisshu
      if(!progress) return
      let {part, total} = progress
      return (part * 100 / total).toFixed(2) + '%'
    },

    error() {
      let {error} = this.tisshu
      if(!error) return
      return error.message || 'unknown error'
    },

    ready() {
      return this.tisshu.ready
    }
  },

  watch: {
    ready: 'seen'
  },

  methods: {
    seen() {
      if(this.tisshu.seen) return
      let {id} = this.tisshu
      this.$store.commit('posts/edit', {id, data: {seen: true}})
    }
  },

  created() {
    if(this.ready) this.seen()
  }
}
</script>
