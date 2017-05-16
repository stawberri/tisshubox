<template lang="pug">
#tisshubox
</template>

<script>
module.exports = {
  computed: {
    title() {
      let tisshu = this.$store.getters['posts/tisshu']
      if(!tisshu) return ''
      let artists = tisshu.post.tags.artist.join(', ')
      artists = artists.replace(/_/g, ' ')
      return `Drawn by ${artists}`
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
  }
}
</script>
