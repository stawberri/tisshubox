<template lang='pug'>
.tisshu
  .picture(v-if='ready' :style='pictureStyle')
  .message(v-else-if='error')
    .icon: .fa.fa-exclamation-triangle
    .text
      .primary error encountered
      .secondary {{error}}
  .message(v-else-if='tisshu.url')
    .icon: .fa.fa-circle-o-notch.fa-spin
    .text processing image
  .message(v-else-if='percent')
    .icon: .fa.fa-refresh.fa-spin
    .text
      .primary {{percent}}
      .secondary downloading
  .message(v-else)
    .icon: .fa.fa-cog.fa-spin
    .text beginning download
</template>

<script>
module.exports = {
  computed: {
    tisshu() {
      return this.$store.state.posts.tisshus[this.$store.state.posts.tisshuIndex]
    },

    pictureStyle() {
      let {tisshu} = this
      let {post} = tisshu

      return {
        width: post.file.width + 'px',
        height: post.file.height + 'px',
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
      return error.message
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
