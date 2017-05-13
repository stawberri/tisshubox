<template lang="pug">
  #tisshubox
    .search(:style='{outlineColor: c[0]}')
      input(
        v-model='searchTags'
        :style='{background: chroma(c[1]).alpha(0.69).css(), color: c[0]}'
        @keydown.enter='pull'
      )
      button.pull(
        @click='pull'
        :style='{background: c[0], color: c[1]}'
      )
        template(v-if='this.status === "done"')
          .fa.fa-play
        template(v-else)
          .fa.fa-spin.fa-circle-o-notch
    .background(:style='{backgroundImage}')
    .tisshu(:style='{backgroundImage}')
    .title(
      v-if='this.title'
      :style='{color: c[0], textShadow: `0 0 5px ${c[2]}`}'
    ) {{title}}
    .buttons
</template>

<script>
  const chroma = req('chroma-js')

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
      },

      searchTags: {
        get() {
          return this.$store.state.config.searchTags
        },

        set(tags) {
          this.$store.commit('config/tags', {tags})
        }
      }
    },

    methods: {
      chroma,

      pull(force) {
        if(force || this.status === 'done')
          this.$store.dispatch('tisshu/pull')
      }
    },

    mounted() {
      this.pull(true)
    }
  }
</script>
