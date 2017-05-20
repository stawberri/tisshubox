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
      .fa.fa-circle(v-if='tisshu.current')
      .fa.fa-circle-o(v-else-if='!tisshu.ready')
      .fa.fa-exclamation-circle(v-else-if='!tisshu.seen')
      .fa.fa-circle(v-else)
</template>

<script>
module.exports = {
  props: ['c', 'outerAnim'],

  computed: {
    animation() {
      switch(this.outerAnim) {
        case 'up-left':
        case 'up-right':
          return 'page-up'
        break

        case 'down-left':
        case 'down-right':
          return 'page-down'
        break

        default:
          return 'page'
        break
      }
    },

    tisshus() {
      let {tisshus, tisshuIndex} = this.$store.state.posts
      tisshus = tisshus.map((tisshu, index) => {
        let current = index === tisshuIndex

        let color
        switch(true) {
          case current:
            color = this.c[4]
          break
          case !tisshu.seen:
            color = this.c[3]
          break
          case !tisshu.ready:
            color = this.c[2]
          break
          default:
            color = this.c[1]
          break
        }

        return Object.assign(
          Object.create(tisshu),
          {
            current,
            style: {color}
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
