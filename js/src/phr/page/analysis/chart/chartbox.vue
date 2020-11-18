<!--  -->
<template>
  <div class="chart-box">
    <circlescontainer :data="circlesData"></circlescontainer>
    <div class="echarts-container">
      <div class="echarts" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import circlescontainer from '@/phr/page/analysis/chart/circlescontainer'
export default {
  props: {
    data: {
      type: Array,
      default: () => [[], []]
    }
  },
  data () {
    return {
      circlesData: {},
      defaultSerie: {
        name: '',
        data: [],
        type: 'line',
        symbol: 'circle',
        showSymbol: false,
        smooth: true,
        smoothMonotone: 'x',
        itemStyle: {},
        areaStyle: {},
      },
      styleArr: [
        ['rgba(60,178,248,$)', 'rgba(28,123,239,$)'],
        ['rgba(255,156,154,$)', 'rgba(255,125,143,$)'],
        ['rgba(55,228,200,$)', 'rgba(17,182,232,$)'],
        ['rgba(255,203,82,$)', 'rgba(255,156,41,$)'],
        ['rgba(216,98,192,$)', 'rgba(175,84,226,$)'],
        ['rgba(170,164,255,$)', 'rgba(107,112,255,$)'],
        ['rgba(255,135,49,$)', 'rgba(255,107,82, $)'],
      ],
      chartOption: {
        legend: {
          type: 'plain',
          right: 0,
          top: 40,
          data: [],
        },
        grid: {
          left: 60,
          bottom: 40,
          right: 20,
          top: 100,
        },
        title: {
          text: '机构就诊人次分布',
          y: '20px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dotted'
            }
          }
        },
        dataZoom: [{
          type: 'inside',
          throttle: 50
        }],
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#999999'
            }
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999999'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: []
      }
    }
  },

  components: {
    circlescontainer
  },

  computed: {},

  created () {
    this.init()
  },
  mounted () {
    this.initCharts()
    this.chart = echarts.init(this.$refs.chart)
    window.addEventListener('resize', this.handleResizeChart)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.handleResizeChart)
    })
  },
  methods: {
    handleResizeChart () {
      this.chart.resize()
    },
    init () {
      this.circlesData = this.data[0]
      this.chartData = this.data[1]
      this.formatChartData()
    },
    formatChartData () {
      const { legend, xAxis, series } = this.chartOption
      if (this.chartData && Array.isArray(this.chartData[0].items)) {
        const items = this.chartData[0].items
        items.forEach(date => {
          xAxis.data.push(date.visitDate.substr(5)) // 日期
        })
      }
      for (let i = 0; i <= 6; i++) {
        if (!this.chartData[i]) break
        const { orgName, items } = this.chartData[i]
        if (orgName) {
          legend.data.push(orgName)
          const serie = JSON.parse(JSON.stringify(this.defaultSerie))
          series.push(serie)
          serie.name = orgName
          this.formatStyle(serie, i)
          if (Array.isArray(items)) {
            items.forEach(data => {
              serie.data.push(data.visitTotal)
            })
          }
        }
      }
    },
    formatStyle (serie, index) {
      const styleArr = this.styleArr[index]
      const replaceAlp = (str, alp = 1) => str.replace('$', alp)
      serie.itemStyle = {
        color: new echarts.graphic.LinearGradient(
          1, 0, 0, 1,
          [
            {
              offset: 0,
              color: replaceAlp(styleArr[0])
            },
            {
              offset: 1,
              color: replaceAlp(styleArr[0])
            }
          ]
        )
      }
      serie.areaStyle = {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: replaceAlp(styleArr[0], 0.1)
        }, {
          offset: 1,
          color: replaceAlp(styleArr[0], 0.1)
        }])
      }
    },
    initCharts () {
      const chart = echarts.init(this.$refs.chart)
      chart.setOption(this.chartOption)
    },
  }
}

</script>
<style lang='scss' scoped>
.chart-box {
  display: flex;
  .echarts-container {
    flex: 1;
    height: 480px;
    background-color: white;
    box-shadow: 0 2px 5px 0 rgba(98, 115, 135, 0.1);
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    .echarts {
      width: 95%;
      margin: 0 auto;
      height: 469px;
    }
  }
}
</style>
