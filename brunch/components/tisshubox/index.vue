<template lang="pug">
  #vue(:class='{hover, active}')
    button.pull(@click='loadTisshu'): span {{status}}
    tisshu(v-if="status === 'done'")
</template>

<script>
  const tisshu = require('./tisshu')

  module.exports = {
    components: {
      tisshu
    },
    computed: {
      status() {
        return this.$store.state.tisshu.status
      }
    },
    methods: {
      loadTisshu() {
        this.$store.dispatch('tisshu/fetch')
      }
    }
  }
</script>
