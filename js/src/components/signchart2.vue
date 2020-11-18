<template>
  <div class="chartView2" :style="{'width':chartConfig.width+'px','height':chartConfig.height+'px'}" 
  v-loading="chartLoading"
  element-loading-background="rgba(0,0,0,0)">
    <div v-if="dataSource">
      <div class="chartTitle">{{chartConfig.chartTitle}}</div>
      <div class="view">
        <div class="yAxisName" v-if="chartConfig.yAxisName">
          <span  v-for="(item,index) in chartConfig.yAxisName" :key="index">
            {{item}}
          </span>
          <!-- <span>y</span>
          <span>轴</span>
          <span>名</span>
          <span>称</span> -->
        </div>
        <div :class="'areaChart'+signType" style="position:relative;">
          <div class="unit" style="text-align:left">单位:{{row.unit}}</div>
          <div :class="'dialog'+signType" ref="dialog" :style="dialogStyle">
            <!-- <i class="icon"></i>
            <p class="time">时间:10-02 11:00</p>
            <p class="name">标题：标题标题标题</p> -->
          </div>
        </div>
      </div>
      <div class="xAxisName" v-if="chartConfig.xAxisName">{{chartConfig.xAxisName}}</div>
    </div>
    <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
  </div>
</template>

<script>
import * as d3 from 'd3'
import phrapi from '@/inpatient/store/phr'
// let chartData = [
//   {
//     level: {
//       min: 10,
//       max: 35
//     },
//     data: [
//       {dateTime: '2019-04-22 10:58:14', value: '41'},
//       {dateTime: '2019-04-23 10:58:14', value: '30'}
//     ]

//   }
// ]
export default {
  props: {
    row: {
      type: Object
    },
    chartConfig: {
      type: Object,
      default: () => {
        return {
          width: 660,
          height: 380,
          xAxisName: '',
          yAxisName: '',
          chartTitle: ''
        }
      }
    },
    patientId: {
      type: String,
      default: ''
    },
    signType: {
      type: String,
      default: ''
    }
  },
  data: function () {
    let dataSource = null
    return {
      chartLoading: true,
      dataSource: dataSource,
      padding: {
        left: '40px',
        right: '30px',
        top: '20px',
        bottom: '60px'
      },
      dialogStyle: {
        'padding': '2px 8px',
        'letter-spacing': '1px',
        'opacity': 0.7,
        'background': '#000',
        'border': '1px solid #979797',
        'border-radius': '2px',
        'position': 'absolute',
        'min-width': '128px',
        'left': '100px',
        'top': '50px',
        'display': 'none'
      },
      level: {}
    }
  },
  mounted () {
    console.log('row', this.row)
    // phr检验组件曲线接口
    phrapi.getSignChartWithBaseLine({
      patientId: this.row.patientId,
      inspectionServiceId: this.row.serviceId,
      times: '',
      inspectUnitCode: this.row.inspectUnitCode
    }).then(res => {
      this.chartLoading = false
      this.dataSource = res[0].data
      this.$nextTick(_ => {
        this.initChart(res[0].level)
        this.level = res[0].level
      })
    })
  },
  methods: {
    getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr]
      }
    },
    initChart (baseline) {
      let _this = this
      let dialog = this.$refs.dialog
    // dom容器宽高,参数padding获取
      let width = parseFloat(this.chartConfig.width)
      let height = parseFloat(this.chartConfig.height) - 40
      let padLeft = parseFloat(this.padding.left)
      let padRight = parseFloat(this.padding.right)
      let padTop = parseFloat(this.padding.top)
      let padBottom = parseFloat(this.padding.bottom)
      let minHeight = parseFloat(this.minHeight) || 0
      let innerWidth = this.chartConfig.width - padLeft - padRight
    // let innerHeight = this.chartConfig.height - padTop - padBottom
      if (isNaN(width) || isNaN(height)) {
        console.error('width 或 height 参数错误')
        return
      }
    // 检查padding参数是否有问题
      if (isNaN(padLeft) || isNaN(padRight) || isNaN(padTop) || isNaN(padBottom)) {
        console.error('padding 参数错误')
        return
      }

    // 开始绘图,创建svg画布
      let svg = d3.select('.areaChart' + this.signType)
      .append('svg')
      .attr('width', width)
      .attr('height', height + 60)

      let xScale = setAxisX(this.dataSource)
      let yScale = setAxisY(this.dataSource, null, baseline)

    // 绘制网格线
      drawGrid()

      let circles = []
      let colors = ['#1C7BEF', 'red']
      let line = null

    // 创建线段生成器
      line = d3.line()
      .defined(function (d) {
        return d.value
      })
      .x(function (d, i) {
        return padLeft + xScale(new Date(d.dateTime))
      })
      .y(function (d, i) {
        return yScale(d.value) + padTop
      })

      // 添加线段
      svg.append('path')
        .attr('d', line(this.dataSource))
        .attr('stroke', colors[0])
        .attr('stroke-width', '2px')
        .attr('fill', 'none')
        .attr('class', 'pathLine')

      let focus = drawCross()
      // 添加数据点
      circles.push(drawCircle('circleWrap', this.dataSource, colors[0]))

    // 鼠标移入移出数据点
      circles.forEach((item, index) => {
        // let _index = index
        circles[index].on('mouseover', function (currentNode) {
          d3.select(this).call(msover, '数值', currentNode)
        }).on('mouseout', msout)
      })
    // 浮层
      drawShadow()

    // 移入
      function msover () {
      // arguments
      // 0当前对象，1，传入的的体征名称，2当前数据
        let currentNode = d3.select(arguments[0]).node()
        let signName = arguments[1]
        let currentData = arguments[2]
        focus.style('display', null)

        var x = Math.round(xScale(new Date(currentData.dateTime)))
        var y = yScale(currentData.value)
      // 设置坐标点和十字线
        hoverCirCle(currentNode, x, y)
      // 弹框
        toolTip(currentData, signName, x, y)
      }

    // 移出
      function msout () {
        d3.select(this)
        .transition()
        .ease(d3.easeBounceOut)
        .duration(100).attr('r', function (d, i) { return 3 })
      // 鼠标移入十字线隐藏
        focus.style('display', 'none')
      // 文字提示
        d3.select('.dialog' + _this.signType)
        .style('display', 'none')

        var currentNode = d3.select(this)
        currentNode.style('stroke-width', 1)
        currentNode.select('circle.circleL')
        .attr('r', 3)
        .style('stroke-opacity', 1)
        currentNode.select('circle.circleS')
        .attr('r', 0.4)
      }
    // 鼠标移入数据点状态的变化和十字线显示
      function hoverCirCle (currentNode, x, y) {
        currentNode.style('stroke-width', 2)
        currentNode.select('circle.circleL')
        .attr('r', 6)
        .style('stroke-opacity', 0.4)
        currentNode.select('circle.circleS')
        .attr('r', 4)

        focus.select('#focusLineX')
        .attr('x1', x + padLeft).attr('y1', 0 + padTop)
        .attr('x2', x + padLeft).attr('y2', height - padBottom)
        focus.select('#focusLineY')
        .attr('x1', 0 + padLeft).attr('y1', y + padTop)
        .attr('x2', width - padRight).attr('y2', y + padTop)
      }
    //  鼠标移入显示具体数据
      function toolTip (currentData, signName, x, y) {
        d3.select('.dialog' + _this.signType)
        .style('text-anchor', 'middle')
        .style('display', 'block')
        .style('opacity', '0.7')
        .html(function () {
          const time = d3.timeFormat('%Y-%m-%d %H:%M')(new Date(currentData.dateTime))
          return `<i class="triangle"></i>
              <p class="time">时间:${time}</p>
              <p class="name">${signName}:${currentData.value} ${_this.row.unit}</p>`
        })
        .style('left', function () {
          return x + padLeft + 'px'
        })
        .style('margin-left', function () {
          var w = parseFloat(_this.getStyle(dialog, 'width'))
          return -w / 2 + 'px'
        })
        .style('top', (y + 2 * padTop) + 'px')
      // 设置p标签样式
        d3.selectAll('.dialog' + _this.signType + ' p')
        .style('line-height', '14px')
        .style('text-align', 'left')
        .style('font-size', '14px')
        .style('color', '#fff')
      // 设置小三角样式
        d3.selectAll('.dialog' + _this.signType + ' .triangle')
        .style('border', '7px solid tranparent')
        .style('border-width', '7px')
        .style('border-style', 'solid')
        .style('border-color', 'transparent')
        .style('opacity', 0.7)
        .style('border-bottom-color', '#000')
        .style('top', '-14px')
        .style('left', '50%')
        .style('margin-left', '-14px')
        .style('position', 'absolute')
      }
    // x轴
      function setAxisX (dataSource, range) {
      // x轴比例尺(当数据只有一条或者只有一天的数据，数据点会在最右侧，展示的不好看，所以在后面另外加个日期)
        let dateRange = range || addLastDate(dataSource)
      // 设置定义域和值域
        let scale = d3.scaleTime()
        .domain(dateRange)
        .range([0, innerWidth])
      // 格式化坐标轴时间
        let dateList = new Set()
        let yearList = new Set()
        let xAxis = d3.axisBottom().scale(scale).tickFormat(function (d) {
          const dateItem = d3.timeFormat('%x')(d)
          const yearItem = d3.timeFormat('%Y')(d)
          if (!yearList.has(yearItem)) {
            yearList.add(yearItem)
            dateList.add(dateItem)
            return d3.timeFormat('%Y/%m/%d %H:%M')(d)
          }
          if (!dateList.has(dateItem)) {
            dateList.add(dateItem)
            return d3.timeFormat('%m/%d %H:%M')(d)
        // return formatTime(d)
          } else {
            return d3.timeFormat('%H:%M')(d)
          }
        })
        xAxis.tickPadding(10)
        svg.append('g')
        .attr('transform', 'translate(' + padLeft + ',' + (height - padBottom) + ')')
        .call(xAxis)
        .style('font-size', '12px')
        .classed('x-axis', true)

        d3.selectAll('.x-axis')
        .selectAll('.tick')
        .select('text')
        .style('transform', 'rotate(-50deg)')
        .style('transform-origin', '20px 30px')

        return scale
      }
    // y轴
      function setAxisY (dataSource, range, baseline) {
      // y轴比例尺

        let yData = range || getMinAndMax(dataSource, 'value')
        let max = d3.max(yData) + 2
        if (baseline && baseline.max && max < baseline.max) {
          max = baseline.max + 2
        }
        let yScale = d3.scaleLinear().domain([0, max]).range([height - padBottom - padTop, minHeight])
        let yAxis = d3.axisLeft().scale(yScale)
      // 绘制y轴
        svg.append('g')
        .attr('transform', 'translate(' + padLeft + ',' + padTop + ')')
        .call(yAxis)
        .style('font-size', '12px')
        .classed('y-axis', true)

        d3.selectAll('g.tick')
        .select('line')
        .attr('stroke', '#AAA')
        d3.selectAll('path.domain')
        .attr('stroke', '#aaa')

        return yScale
      }
      // 绘制基线
      function drawBaseLine (obj) {
        if (!obj) return false
        if (obj.max) {
          let yMax = yScale(Number(obj.max))
          d3.selectAll('g.y-axis')
            .append('line')
            .classed('baseline', true)
            .attr('x1', 0)
            .attr('y1', yMax)
            .attr('x2', innerWidth)
            .attr('y2', yMax)
            .attr('stroke', function (d, index) {
              return 'red'
            })
          d3.selectAll('g.y-axis')
            .append('text')
            .attr('x', innerWidth + padRight)
            .attr('y', yMax)
            .attr('fill', 'red')
            .text(function () {
              return 'H ' + obj.max
            })
        }
        if (obj.min) {
          let yMin = yScale(Number(obj.min))
          d3.selectAll('g.y-axis')
            .append('line')
            .classed('baseline', true)
            .attr('x1', 0)
            .attr('y1', yMin)
            .attr('x2', innerWidth)
            .attr('y2', yMin)
            .attr('stroke', function (d, index) {
              return 'green'
            })
          d3.selectAll('g.y-axis')
            .append('text')
            .attr('x', innerWidth + padRight)
            .attr('y', yMin)
            .attr('fill', 'green')
            .text(function () {
              return 'L ' + obj.min
            })
        }
      }
      drawBaseLine(baseline)

    // 网格
      function drawGrid () {
      // x轴网格线
        d3.selectAll('g.x-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -(height - padTop - padBottom))
        .attr('stroke', function (d, index) {
          if (index === 0) {
            return 'none'
          }
          return '#e7e7e7'
        })
      // y轴网格线
        d3.selectAll('g.y-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', innerWidth)
        .attr('y2', 0)
        .attr('stroke', function (d, index) {
          if (index === 0) {
            return 'none'
          }
          return '#e7e7e7'
        })
        d3.selectAll('g.tick line.grid-line')
        .style('shape-rendering', 'crispEdges')
      }
      function drawCross () {
        let focus = svg.append('g').attr('class', 'focus').style('display', 'none')
        focus.append('line')
        .attr('id', 'focusLineX')
        .attr('class', 'focusLine')
        focus.append('line')
        .attr('id', 'focusLineY')
        .attr('class', 'focusLine')

        d3.selectAll('.focusLine')
        .style('fill', 'none')
        .style('stroke', '#EE4433')
        .style('stroke-width', '1px')

        return focus
      }
      function drawCircle (className, data, strokeColor) {
        let circleWrap = svg.selectAll(className)
        .data(data)
        .enter()
        .filter(function (d) {
          return d.value !== null && d.value !== ''
        })
        .append('g')
        .attr('class', className)
        .style('fill', '#fff')
        .style('stroke', function (d) {
          if (baseline && baseline.max && Number(d.value) > baseline.max) {
            return 'red'
          } else if (baseline && baseline.min && Number(d.value) < baseline.min) {
            return 'green'
          } else {
            return strokeColor
          }
        })
        .style('stroke-width', '1')
        .attr('transform', function (d) {
          var x = (padLeft + xScale(new Date(d.dateTime)))
          var y = (yScale(d.value) + padTop)
          return 'translate(' + x + ',' + y + ')'
        })
        .style('cursor', 'pointer')
        circleWrap.append('circle').classed('circleL', true).attr('r', 3)
        circleWrap.append('circle').classed('circleS', true).attr('r', 0.4)

        return circleWrap
      }
      function drawShadow () {
        let shadow = svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .style('fill', '#fff')
        .attr('x', 0)
      // 移动遮罩,完成动画
        shadow.transition()
        .delay(500)
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('x', width)
        .attr('width', 0)
      }
      function getMinAndMax (dataSource, val) {
        let data = []
        data.push(...d3.extent(dataSource, function (obj) {
          if (val === 'value') return Number(obj[val])
          return obj[val]
        }))
        return d3.extent(data)
      }
    // 向数据后面多加一个日期
      function addLastDate (dataSource) {
        let xData = getMinAndMax(dataSource, 'dateTime').map(item => new Date(item))
        let firstDate = xData[0]
        firstDate.setHours(0, 0, 0)
        let lastDate = xData[xData.length - 1]
        let year = lastDate.getFullYear()
        let month = lastDate.getMonth()
        let day = lastDate.getDate() + 1
        let tail = new Date(new Date().setFullYear(year, month, day))
        tail.setHours(0, 0, 0)
        return d3.extent([firstDate, ...xData, tail])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.unit{
  text-align: left;
  position: absolute;
  left: 15px;
  top: -8px;
}
.chartView2{
  display:flex;
  flex-direction:column;
  text-align: center;
  padding:10px 15px;
  -border:1px solid #000;
}
.chartTitle{
  text-align: left;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000000;
  line-height:22px;
}
.view{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.yAxisName{
  width:17px;
  height: auto;
  transform:rotate(180deg);
  align-items:center;
  align-content:center;
}
.yAxisName span{
  display:inline-block;
  transform: rotate(90deg);
}
.yAxisName,.xAxisName{
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
}

.areaChart{
  position: relative;
}

.dialogChart{
    padding:2px 8px;
    letter-spacing: 1px;
    opacity: 0.7;
    background: #000;
    border: 1px solid #979797;
    border-radius: 2px;
    position: absolute;
    min-width:128px;
    left:100px;
    top:50px;
    display:none;
}

</style>
