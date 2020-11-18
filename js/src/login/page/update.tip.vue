<!--  -->
<template>
  <div class="update-tip" v-drag>
    <i class="el-icon-setting"></i>{{title}}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '系统维护中,请稍后操作数据,敬请谅解！'
    }
  },
  data () {
    return {
      vm: this,
    }
  },
  directives: {
    drag: {
      bind (el) {
        el.onmousedown = (e) => {
          const X = e.clientX - el.offsetLeft
          const Y = e.clientY - el.offsetTop
          document.onmousemove = (e) => {
            const left = e.clientX - X
            const top = e.clientY - Y
            el.style.left = left + 'px'
            el.style.top = top + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  components: {},

  computed: {},

  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.update-tip {
  position: absolute;
  display: inline-block;
  z-index: 1000000000;
  user-select: none;
  left: 50px;
  top: 50px;
  color: #c00;
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  width: 300px;
  padding: 10px;
  user-select: none;
  font-weight: bold;
  border-radius: 5px;
  cursor: move;
}
</style>
