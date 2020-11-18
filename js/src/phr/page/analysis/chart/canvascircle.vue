<!--  -->
<template>
  <canvas ref="circle" v-bind="$attrs"></canvas>
</template>

<script>
import circle from '@/phr/page/analysis/chart/circle'

export default {
  props: {
    color: String,
    lineWidth: Number,
    type: {
      type: String,
      default: 'single'
    },
    topcolor: String,
    globalAlpha: {
      type: Number,
      default: 1
    },
    data: Object
  },
  data () {
    return {
      ...this.data
    }
  },

  components: {},

  computed: {},

  created () { },
  mounted () {
    const el = this.$refs.circle
    if (this.type === 'single') {
      circle(el, this.color, 100, this.lineWidth, this.globalAlpha)
    } else {
      circle(el, this.color, 100, this.lineWidth, this.globalAlpha)
      circle(el, this.topcolor || this.color, this.percent, this.lineWidth, this.globalAlpha, this.liner)
    }
  },
  methods: {
    init (none) {
      const el = this.$refs.circle
      el.height = el.height
      if (none) {
        circle(el, this.color, 100, this.lineWidth, this.globalAlpha)
      } else {
        circle(el, this.color, 100, this.lineWidth, this.globalAlpha)
        circle(el, this.topcolor || this.color, this.percent, this.lineWidth, this.globalAlpha, this.liner)
      }
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
