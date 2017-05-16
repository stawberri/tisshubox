<template lang='pug'>
.tisshu
  .picture(v-if='tisshu.url' :style='pictureStyle')
  .message(v-else-if='tisshu.data')
    .icon: .fa.fa-circle-o-notch.fa-spin
    .text processing image
  .message(v-else-if='tisshu.progress')
    .icon: .fa.fa-refresh.fa-spin
    .text
      .primary {{percent}}
      .secondary downloading
  .message(v-else)
    .icon: .fa.fa-cog.fa-spin
    .text preparing download
</template>

<script>
module.exports = {
  props: ['tisshu'],

  computed: {
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
      let {part, total} = this.tisshu.progress
      let percent = (part * 100 / total).toFixed(2)
      return `${percent}%`
    }
  }
}
</script>
