<template lang="pug">
  .tisshu
    #preview(:style='{backgroundImage: `url(${src})`}')
</template>

<script>
  module.exports = {
    computed: {
      src() {
        return this.$store.getters['tisshu/uri']
      }
    }
  }
</script>
