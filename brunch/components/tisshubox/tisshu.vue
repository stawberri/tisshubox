<template lang="pug">
  .tisshu
    img(:src='`file://${path}`')
</template>

<script>
  module.exports = {
    computed: {
      path() {
        return this.$store.state.tisshu.path
      }
    }
  }
</script>
