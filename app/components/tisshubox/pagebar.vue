<template lang='pug'>
transition-group.pagebar(
  :name='animation'
  tag='div'
)
  .page(
    v-for='tisshu of tisshus'
    :key='tisshu.id'
    :style='pageStyle[tisshu.id]'
    :class='{current: tisshu.current, dummy: tisshu.dummy}'
    @click='$emit("jump", tisshu.id)'
  )
    .fa.fa-circle(v-if='tisshu.ready')
    .fa.fa-circle-o(v-else)
</template>

<script>
module.exports = {
  props: ['c', 'outerAnim'],

  computed: {
    animation() {
      switch(this.outerAnim) {
        case 'up':
        case 'down':
          return `page-${this.outerAnim}`
        break

        default:
          return 'page'
        break
      }
    },

    tisshus() {
      let mod = this
      let {tisshuIndex} = this.$store.state.posts
      let {tisshus} = this.$store.state.posts
      tisshus = tisshus.map((tisshu, index) => ({
        id: tisshu.id,
        get c() {
          if(tisshu.colors) return tisshu.colors
          else return mod.c
        },
        current: index === tisshuIndex,
        dummy: false,
        ready: tisshu.ready
      }))

      let after = tisshus.length - tisshuIndex - 1
      let difference = Math.abs(tisshuIndex - after)
      let filler = Array(difference).fill('').map((element, index) => ({
        id: `filler-${index}`,
        dummy: true
      }))

      if(tisshuIndex > after) return [...tisshus, ...filler]
      else return [...filler, ...tisshus]
    },

    pageStyle() {
      let styles = {}
      for(let tisshu of this.tisshus) {
        styles[tisshu.id] = tisshu.dummy ? {} : {
          color: tisshu.c[tisshu.current ? 4 : 2]
        }
      }
      return styles
    }
  }
}
</script>
