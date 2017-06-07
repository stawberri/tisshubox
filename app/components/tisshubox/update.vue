<template lang='pug'>
transition: .update-available(v-if='available && !dismissed')
  .wrapper
    .title Tisshubox update available
    .message.
      You're currently using Tisshubox version {{local}}, but version {{github}} is now available. You can update by heading back to Tisshubox's Github page and following the directions to install Tisshubox again, just like you did when you got this version.
      #[br]#[br]
      If you dismiss this message, you can visit Tisshubox's Github page at any time via the Help menu.
    .buttons
      .button.main(@click='visit') Visit Tisshubox on Github
      .button(@click='dismissed = true') Dismiss for now
</template>

<script>
let {shell} = req('electron')
module.exports = {
  data: () => ({
    dismissed: false
  }),

  computed: {
    local() {
      return this.$store.state.package.local.version
    },

    github() {
      let {github} = this.$store.state.package
      return github ? github.version : github
    },

    available() {
      return this.github && this.local !== this.github
    }
  },

  methods: {
    visit() {
      shell.openExternal(this.$store.state.package.local.homepage)
    }
  }
}
</script>
