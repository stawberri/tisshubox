<template lang='pug'>
transition-group.pagebar(
  name='page'
  tag='div'
)
  .page(
    v-for='tisshu of tisshus'
    :key='tisshu.id'
    :style='pageStyle[tisshu.id]'
    :class='{current: tisshu.current, dummy: tisshu.dummy}'
    @click='$emit("jump", tisshu.id)'
  )
    .fa.fa-circle(v-if='tisshu.current')
    .fa.fa-circle-o(v-else)
</template>

<script>
module.exports = {
  props: ['c'],

  computed: {
    tisshus() {
      let mod = this
      let {tisshuIndex} = this.$store.state.posts
      let tisshus = this.$store.getters['posts/tisshus']
      tisshus = tisshus.map((tisshu, index) => ({
        id: tisshu.id,
        get c() {
          if(tisshu.colors) return tisshu.colors
          else return mod.c
        },
        current: index === tisshuIndex,
        dummy: false
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
