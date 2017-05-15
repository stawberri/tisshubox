<template lang="pug">
#tisshubox
</template>

<script>
module.exports = {
  async mounted() {
    await this.$store.dispatch('posts/fetch', {initial: true})
    await this.$store.dispatch('posts/populate')
  }
}
</script>
