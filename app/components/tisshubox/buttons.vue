<template lang='pug'>
.buttons
  .prev(
    :style='styles.prev'
    @mouseenter='states.prev.hover = true'
    @mouseleave='states.prev.hover = false'
    @mousedown='handleActive($event, "prev")'
    @click='$emit("press", "prev")'
  ): .fa.fa-arrow-left
  .stash(
    :style='styles.stash'
    @mouseenter='states.stash.hover = true'
    @mouseleave='states.stash.hover = false'
    @mousedown='handleActive($event, "stash")'
    @click='$emit("press", "stash")'
  ): .fa.fa-archive
  .trash(
    :style='styles.trash'
    @mouseenter='states.trash.hover = true'
    @mouseleave='states.trash.hover = false'
    @mousedown='handleActive($event, "trash")'
    @click='$emit("press", "trash")'
  ): .fa.fa-trash
  .next(
    :style='styles.next'
    @mouseenter='states.next.hover = true'
    @mouseleave='states.next.hover = false'
    @mousedown='handleActive($event, "next")'
    @click='$emit("press", "next")'
  ): .fa.fa-arrow-right
</template>

<script>
module.exports = {
  data: () => ({
    states: {
      prev: {hover: false, active: false},
      stash: {hover: false, active: false},
      trash: {hover: false, active: false},
      next: {hover: false, active: false}
    }
  }),

  props: ['c', 'tisshu'],

  computed: {
    length() {
      return this.$store.state.posts.tisshus.length
    },

    styles() {
      let styles = {}
      let states = this.states

      for(let button in states) {
        let display
        let color
        switch(button) {
          case 'prev':
            color = this.c[1]
            display = this.length > 1
          break

          case 'next':
            color = this.c[1]
            display = this.length > 1
          break

          case 'stash':
            color = this.c[2]
            display = this.tisshu && this.tisshu.ready
          break

          case 'trash':
            color = this.c[3]
            display = this.tisshu && this.tisshu.ready
          break
        }

        styles[button] = {}
        if(display) {
          switch(true) {
            case (states[button].active):
              Object.assign(styles[button], {
                color, textShadow: `0 0 5px ${color}`
              })
            break

            case (states[button].hover):
              Object.assign(styles[button], {
                textShadow: `0 0 15px ${color}`
              })
            break

            default:
              Object.assign(styles[button], {
                textShadow: `0 0 10px ${this.c[4]}`
              })
            break
          }
        } else {
          Object.assign(styles[button], {
            opacity: 0.3,
            pointerEvents: 'none'
          })
        }
      }

      return styles
    }
  },

  methods: {
    handleActive(event, button) {
      let element = event.currentTarget
      let state = this.states[button]
      state.active = true

      let interval = setInterval(() => {
        if(element.matches(':active')) return
        state.active = false
        clearInterval(interval)
      }, 100)
    }
  }
}
</script>
