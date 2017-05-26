<template lang='pug'>
tisshubox(v-if='ready && !quitting')
</template>

<script>
const {remote: {getCurrentWindow}} = req('electron')

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
  },

  created() {
    window.addEventListener('beforeunload', async event => {
      event.returnValue = 0
      this.quitting = true
      await this.$store.dispatch('data/save')
      getCurrentWindow().destroy()
    })
  }
}
</script>
