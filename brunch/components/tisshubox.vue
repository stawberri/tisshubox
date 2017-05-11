<template lang="pug">
  #tisshubox
    .background(:style='{backgroundImage}')
    .tisshu(:style='{backgroundImage}')
    .buttons
      button.pull(
        @click='pull'
        :disabled='status !== "done"'
        :style='{background: c[1], color: c[0], outline: `2px solid ${c[0]}`}'
      )
        template(v-if='this.status === "done"')
          .fa.fa-search
          | find another
        template(v-else-if='status === "search"')
          .fa.fa-spin.fa-refresh
          | searching
        template(v-else-if='status === "download"')
          .fa.fa-spin.fa-refresh
          | downloading: {{percent}}%
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
        return this.tisshuSrc ? `url(${this.tisshuSrc})` : ''
      },

      percent() {
        let {progress, total} = this.$store.state.tisshu.progress
        if(total === 0) return '0'
        return (progress * 100 / total).toFixed()
      },

      c() {
        return this.$store.state.tisshu.colors
      }
    },
    methods: {
      pull() {
        this.$store.dispatch('tisshu/pull')
      }
    },
    mounted() {
      this.pull()
    }
  }
</script>
