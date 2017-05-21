<template lang='pug'>
#tisshupack(v-if='quitting')
  .fa.fa-spinner.fa-pulse
  .text saving settings
tisshubox(v-else-if='ready')
#tisshupack(v-else)
  .fa.fa-spinner.fa-pulse
  .text loading settings
</template>

<script>
module.exports = {
  data: () => ({
    quitting: false
  }),

  computed: {
    ready() {
      return this.$store.state.data.rootReady
    }
  },

  components: {
    tisshubox: require('./tisshubox')
  }
}
</script>
