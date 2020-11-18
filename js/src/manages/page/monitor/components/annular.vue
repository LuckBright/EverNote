<!--  -->
<template>
  <div class="annular-box">
    <div class="inline">
      <canvas class="all annular" width="400px" height="400px"></canvas>
    </div>
    <div class="inline text-box">
      <ul class="text-ul">
        <li class="text">全站数据总量</li>
        <li class="number" :title="total">{{ total | numberStr }}</li>
      </ul>
    </div>
    <div class="inline">
      <canvas class="correct annular" width="400px" height="400px"></canvas>
    </div>
    <div class="inline text-box">
      <ul class="text-ul">
        <li class="text">全站已同步数据量</li>
        <li class="number" :title="correctCount">
          {{ correctCount | numberStr }}
        </li>
      </ul>
    </div>
    <div class="inline">
      <canvas class="errorEl annular" width="400px" height="400px"></canvas>
    </div>
    <div class="inline text-box">
      <ul class="text-ul">
        <li class="text">全站未同步数据量</li>
        <li class="number" :title="errorCount">{{ errorCount | numberStr }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
function circle (el, forecolor, percent) {
  const context = el.getContext('2d')
  const x = el.width / 2
  const y = el.height / 2
  const rad = Math.PI * 2 / 100
  context.save()
  context.strokeStyle = forecolor
  context.lineWidth = 40
  context.lineCap = 'round'
  var radius = x - context.lineWidth
  context.beginPath()
  context.arc(
    x,
    y,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + percent * rad,
    false
  )
  context.stroke()
  context.closePath()
  context.restore()
}
export default {
  props: ['total', 'errorCount', 'correctCount'],
  data () {
    return {
    }
  },
  filters: {
    numberStr (val) {
      if (val > 999) {
        const str = val + ''
        return str.substring(0, str.length - 3) + '.' + str.substring(str.length - 3, str.length - 2) + 'K'
      } else {
        return val
      }
    }
  },
  components: {},

  computed: {},
  watch: {
    total (val) {
      const correct = document.querySelector('.correct')
      const errorEl = document.querySelector('.errorEl')
      if (val !== 0) {
        circle(correct, '#63D6C3', parseInt((this.correctCount / this.total) * 100))
        circle(errorEl, '#FF8180', parseInt((this.errorCount / this.total) * 100))
      } else {
        circle(correct, '#63D6C3', 0)
        circle(errorEl, '#FF8180', 0)
      }
    }
  },
  mounted () {
    const all = document.querySelector('.all')
    const correct = document.querySelector('.correct')
    const errorEl = document.querySelector('.errorEl')
    circle(all, '#1C7BEF', 100)
    circle(correct, '#eef7e4', 100)
    circle(errorEl, '#F8E5E5', 100)
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.inline {
  display: inline-block;
}
.annular-box {
  margin: 20px;
  .annular {
    width: 100px;
    height: 100px;
  }
  .text-box {
    position: relative;
    margin: 10px;
  }
  .text-ul {
    padding: 0px;
    margin: 0px;
    margin-left: 10px;
    position: relative;
    bottom: 20px;
  }
  .text {
    font-size: 12px;
    font-weight: 100;
    margin: 0px;
  }
  .number {
    font-size: 40px;
    margin: 5px 0px 0px -4px;
  }
}
</style>
