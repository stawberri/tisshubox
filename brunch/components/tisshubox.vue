<template lang="pug">
  #vue
    .background(:style='{backgroundImage}')
    button.pull(@click='loadTisshu')
      .fa.fa-search(v-if='ready')
      .fa.fa-spin.fa-refresh(v-else)
    .tisshu(v-if='ready')
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

      ready() {
        return this.status === 'done'
      },

      backgroundImage() {
        return this.ready ? `url(${this.tisshuSrc})` : ''
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
