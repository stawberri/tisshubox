<template lang='pug'>
transition-group.pagebar(
  :name='animation'
  tag='div'
)
  .page(
    v-for='tisshu of tisshus'
    :key='tisshu.id'
  )
    .contents(
      @click='$emit("jump", tisshu.id)'
      :style='tisshu.style'
      :class='{current: tisshu.current}'
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
      let {tisshus, tisshuIndex} = this.$store.state.posts
      tisshus = tisshus.map((tisshu, index) => {
        let color = tisshu.colors || this.c
        let current = index === tisshuIndex
        return Object.assign(
          Object.create(tisshu),
          {
            current,
            style: {
              color: color[current ? 4 : 2]
            }
          }
        )
      })

      let after = tisshus.length - tisshuIndex - 1
      let difference = Math.abs(tisshuIndex - after)
      let filler = Array(difference).fill('').map((element, index) => ({
        id: `filler-${index}`,
        style: {visibility: 'hidden'}
      }))

      if(tisshuIndex > after) return [...tisshus, ...filler]
      else return [...filler, ...tisshus]
    }
  }
}
</script>
