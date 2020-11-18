<template>
  <div class="dragtoselect" :style='style'></div>
</template>

<script>
export default {
  props: {
    className: { // 需要定义右击自定义的class名字，全局时传空
      type: String
    }
  },
  data: function () {
    return {
      style: {
        visibility: 'hidden',
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      move: false,
      startIndex: 0,
      oldStart: -1,
      endIndex: 0,
      oldEnd: -1,
      moved: false,
    }
  },
  mounted () {
    document.removeEventListener('mousedown', this.mousedown)
    document.removeEventListener('mouseup', this.mouseup)

    document.addEventListener('mousedown', this.mousedown)
    document.addEventListener('mouseup', this.mouseup)
  },
  methods: {
    restore () {
      this.style.height = 0
      this.style.width = 0
      this.style.top = 0
      this.style.left = 0
      this.style.visibility = 'hidden'
    },
    index (e) {
      let index = null
      let domArr = document.querySelectorAll('.' + this.className)
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && element.className.indexOf(this.className) > -1) {
          for (let i = 0; i < domArr.length; i++) {
            if (domArr[i] === element)index = i
          }
        }
      })
      return index
    },
    mousedown (e) {
      if (!this.className) return
      let start = false
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && (element.className.indexOf(this.className) > -1 || element.className.indexOf('dragtoselect') > -1)) {
          start = true
        }
      })
      this.restore()
      if (!start) return
      this.startIndex = this.index(e)
      this.startX = e.x
      this.startY = e.y
      this.style.top = this.startY + 'px'
      this.style.left = this.startX + 'px'
      this.style.visibility = 'visible'
      document.addEventListener('mousemove', this.mousemove)
    },
    mousemove (e) {
      if (Math.abs(e.x - this.startX) < 10 && Math.abs(e.y - this.startY) < 10 && !this.moved) return
      this.moved = true
      // 节流
      if (this.move) return
      this.move = true
      setTimeout(_ => {
        this.move = false
      }, 40)
       // 节流
      let start = false
      e.path.forEach(element => {
        if (element.className && typeof element.className !== 'object' && (element.className.indexOf(this.className) > -1 || element.className.indexOf('dragtoselect') > -1)) {
          start = true
        }
      })
      if (!start) return
      this.oldStart = this.startIndex
      this.endIndex = this.index(e)
      this.endX = e.x
      this.endY = e.y
      this.style.height = Math.abs(this.startY - this.endY) - 2 + 'px'
      this.style.width = Math.abs(this.startX - this.endX) - 2 + 'px'
      this.style.top = this.startY - this.endY > 0 ? this.endY + 'px' : this.startY + 'px'
      this.style.left = this.startX - this.endX > 0 ? this.endX + 'px' : this.startX + 'px'
      if (this.oldEnd !== this.endIndex) {
        if (this.endIndex >= this.startIndex) this.$emit('select', this.startIndex, this.endIndex)
        if (this.startIndex > this.endIndex) this.$emit('select', this.endIndex, this.startIndex)

        this.oldEnd = this.endIndex
      }
    },
    mouseup (e) {
      document.removeEventListener('mousemove', this.mousemove)
      let index = this.index(e)

      if (this.oldStart - this.endIndex <= 0 && this.oldStart !== -1) {
        this.$emit('cancel', index < this.oldStart || index > this.endIndex ? null : index)
      } else if (this.oldStart - this.endIndex > 0 && this.oldStart !== -1) {
        this.$emit('cancel', index > this.oldStart || index < this.endIndex ? null : index)
      } else {
        this.$emit('cancel', null)
      }
      if (!this.moved) return
      this.moved = false
      if (this.endIndex >= this.startIndex) this.$emit('select', this.startIndex, this.endIndex)
      if (this.startIndex > this.endIndex) this.$emit('select', this.endIndex, this.startIndex)
      this.restore()
      this.oldEnd = -1
    }
  }
}
</script>
<style scoped>
.dragtoselect{
  position: fixed;
  z-index: 9999;
  background: rgba(0,0,0,.5);
}
</style>
