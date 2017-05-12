<template lang="pug">
  #tisshubox
    .background(:style='{backgroundImage}')
    .tisshu(:style='{backgroundImage}')
    .card(
      v-if='this.title'
      :style='{background: c[0], color: c[1], border: `3px solid ${c[1]}`}'
    )
      .title {{title}}
      .tags
        .tag(
          v-for='tag of tags'
          :class='tag.type'
          :style='{color: c[(tag.typeNum + 1) % 5], background: c[tag.typeNum]}'
        ) {{tag.name}}
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
          | downloading: {{progress}}
</template>

<script>
  module.exports = {
    computed: {
      title() {
        let post = this.$store.state.tisshu.post
        if(!post) return ''
        let artist = post.tags.artist[0]
        if(artist) {
          artist = artist.replace(/_/g, ' ')
          return `drawn by ${artist}`
        } else {
          return 'artist unknown'
        }
      },

      tags() {
        let post = this.$store.state.tisshu.post
        if(!post) return []
        let tags = [
          ...post.tags.artist.map(tag => ({
            name: tag.replace(/_/g, ' '),
            type: 'artist',
            typeNum: 1
          })),
          ...post.tags.character.map(tag => ({
            name: tag.replace(/_/g, ' '),
            type: 'character',
            typeNum: 2
          })),
          ...post.tags.copyright.map(tag => ({
            name: tag.replace(/_/g, ' '),
            type: 'copyright',
            typeNum: 3
          })),
          ...post.tags.general.map(tag => ({
            name: tag.replace(/_/g, ' '),
            type: 'general',
            typeNum: 0
          }))
        ]
        let length = tags.length
        if(tags.length > 20) {
          tags.length = 20
          tags.push({
            name: `${length - tags.length} more tags`,
            type: 'meta',
            typeNum: 4
          })
        }
        return tags
      },

      status() {
        return this.$store.state.tisshu.status
      },

      backgroundImage() {
        let tisshu = this.$store.getters['tisshu/uri']
        return tisshu ? `url(${tisshu})` : ''
      },

      progress() {
        return this.$store.state.tisshu.progress
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
