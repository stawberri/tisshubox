<template lang="pug">
  #vue
    button.pull(@click='loadTisshu'): span {{status}}
    .tisshu(v-if="status === 'done'")
      #preview(:style='{backgroundImage}')
</template>

<script>
  module.exports = {
    computed: {
      status() {
        return this.$store.state.tisshu.status
      },

      tisshuSrc() {
        return this.$store.getters['tisshu/uri']
      },

      backgroundImage() {
        return `url(${this.tisshuSrc})`
      }
    },
    methods: {
      loadTisshu() {
        this.$store.dispatch('tisshu/fetch')
      }
    },
    mounted() {
      this.loadTisshu()
    }
  }
</script>
