<template lang="pug">
  #vue(:class='{hover, active}')
    button.pull(@click='loadTisshu'): span {{status}}
    .tisshu(v-if="status === 'done'")
      #preview(:style='{backgroundImage: `url(${tisshuSrc})`}')
</template>

<script>
  module.exports = {
    computed: {
      status() {
        return this.$store.state.tisshu.status
      },

      tisshuSrc() {
        return this.$store.getters['tisshu/uri']
      }
    },
    methods: {
      loadTisshu() {
        this.$store.dispatch('tisshu/fetch')
      }
    }
  }
</script>
