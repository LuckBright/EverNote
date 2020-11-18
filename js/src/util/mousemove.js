import storage from '@/util/storage.js'
var component = {
  data () {
    return {
      moved: false
    }
  },
  methods: {
    mousedownInit (ref) {
      let top = storage.getLocalStorage(`${this.$route.matched[0].meta.space}_${ref}`)
      if (top) this.$refs[ref].style.top = top
    },
    mousedown (ev, ref) {
      let yOffset = ev.clientY - this.$refs[ref].offsetTop
      let top = ev.clientY
      let move = ev => {
        var moveY = ev.clientY - yOffset// 得到距离上边距离
        if (moveY < 30) return // 不要画出边界
        if (Math.abs(ev.clientY - top) < 5) return
        this.moved = true
        storage.setLocalStorage(`${this.$route.matched[0].meta.space}_${ref}`, moveY + 'px')
        this.$refs[ref].style.top = moveY + 'px'
      }
      let up = ev => {
        document.removeEventListener('mouseup', up, true)
        document.removeEventListener('mousemove', move, false)
        setTimeout(_ => {
          this.moved = false
        })
      }
      document.addEventListener('mousemove', move, false)
      document.addEventListener('mouseup', up, true)
    },
  }
}

export default component
