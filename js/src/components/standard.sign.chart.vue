<template>
    <div class="wrap">
      <div class="axisWrap" :class="'axisWrap'+patientId+signType+chartType" :style="{width:width,height:height}" v-if="(sex===1||sex===2)&&res!==null">
        <div :class="'dialog'+signType+chartType" :ref="'dialog'+signType+chartType" :style="dialogStyle"></div>
      </div>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
</template>
<script>
/*
    1，只显示周 头围 0-13周
    2，上月下年（月全显示） 身高年龄0-2岁，体重年龄0-2岁，BMI0-2岁
    3，上月下年（月只显示偶数月）身高年龄0-5岁，体重年龄0-5岁，头围0-2岁，头围0-5岁，BMI0-5岁
    4，上周下月 身高年龄0-6个月，体重年龄0-6个月
*/
import * as d3 from 'd3'
import phrapi from '@/inpatient/store/phr'
import {getOriginAgeOfMonth, operateData, showUpDown, formatAxisY, getTickCount, creatData, getDomain, getAxisName, getTextConfig} from '@/util/standardchart'
// import {dataSource} from './CDC_HEIGHT'
export default {
  props: {
    showTitle: {
      type: Boolean,
      default: true
    },
    chartTitle: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 636
    },
    height: {
      type: Number,
      default: 380
    },
    patientId: {// 患者id
      type: String,
      default: ''
    },
    sex: {// 患者性别
      type: Number,
      default: ''
    },
    birthDay: {// 患者生日2001-02-01 00:00:00
      type: String,
      default: ''
    },
    signType: {// 身高HEIGHT,体重WEIGHT,头围HEAD,BMI
      type: String,
      default: ''
    },
    chartType: {// 标准曲线类型WHO，CDC
      type: String,
      default: ''
    }
  },
  data () {
    return {
      res: null,
      age: null, // CDC以月为单位,WHO以天为单位
      month3: 91,
      month6: 183,
      month24: 731,
      month60: 1856,
      monthSet: new Set(),
      title: this.chartType,
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
        'display': 'none',
        'z-index': 1
      },
      birthInfo: {}
    }
  },
  created () {

  },
  mounted () {
    this.initAge()
  },
  methods: {
    async initAge () {
      this.age = await getOriginAgeOfMonth(this.patientId, this.chartType).then(res => {
        console.log('月龄' + this.chartType, res)
        if (res === 0 || res) {
          return res
        } else {
          console.error('获取年龄信息有问题')
        }
      })
      if (isNaN(this.age)) return false
      if (!this.birthDay || !this.signType) {
        console.error('请检查birthDay和signType是否传入')
        return false
      }
      if (this.age > this.month60 && this.chartType === 'WHO') {
        console.error('年龄大于60个月没有WHO标准曲线信息')
        return false
      }
      // if (this.age >= 240) {
      //   console.error('年龄大于20岁没有CDC标准曲线信息')
      //   return false
      // }
      if (this.age > 36 && this.chartType === 'CDC' && this.signType === 'HEAD') {
        console.error('年龄大于36个月的没有CDC头围信息')
        return false
      }
      if ((this.age <= 24 || this.age > 240) && this.chartType === 'CDC' && this.signType === 'BMI') {
        console.error('年龄小于等于24个月大于240个月的的没有CDCBMI信息')
        return false
      }
      phrapi.getStandardSignChart({
        'patientId': this.patientId,
        'curveType': this.chartType,
        'signType': this.signType
      }).then(res => {
        this.res = res
        if (res === null) return false
        this.$nextTick(_ => {
          this.initChart(res)
        })
      })
    },
    getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return document.defaultView.getComputedStyle(obj, null)[attr]
      }
    },
    initChart (dataSource) {
      let seriesName = {
        'p15': '15th',
        'p85': '85th',
        'p3': '3rd',
        'p10': '10th',
        'p25': '25th',
        'p50': '50th',
        'p75': '75th',
        'p90': '90th',
        'p97': '97th'
      }
      let chartName = {
        'WEIGHT': '体重',
        'HEIGHT': '身高',
        'HEAD': '头围',
        'BMI': 'BMI'
      }
      let _this = this
      let dialog = this.$refs['dialog' + this.signType + this.chartType]
      // 创建模拟数据
      let data = creatData(this.age, this.signType, this.chartType)
      let testData = {}
      for (var name in dataSource) {
        testData[name] = dataSource[name]
      }
      // let testData = Object.values(dataSource).map(item => {
      //   return item.slice(0, 740)
      // })
      let extraData = {
        'CDC': ['p15', 'p85', 'p5', 'p95'],
        'WHO': ['p10', 'p25', 'p75', 'p90']
      }
      let dataList = JSON.parse(JSON.stringify(testData))
      extraData[this.chartType].forEach(item => {
        delete dataList[item]
      })
      delete dataList.measure
      let definedData = testData.measure
      let width = this.width
      let height = this.height
      let padding = {
        left: 30,
        top: 35,
        right: 40,
        bottom: 30
      }
      let tickSize = 0
      let gridLineColor = '#e7e7e7'
      let axisLineColor = '#aaa'
      let innerWidth = width - padding.left - padding.right - 30
      let innerHeight = height - padding.top - padding.bottom - 30
      // 创建svg容器
      let axisSvg = d3.select('.axisWrap' + this.patientId + this.signType + this.chartType)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        // .style('border', '1px solid red')
        .append('g')
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      // 绘制标题
      function drawTitle (title) {
        axisSvg.append('text')
          .classed('chart_title', true)
          .attr('x', innerWidth / 2)
          .attr('y', -10)
          .text(title)
      }
      if (this.showTitle) {
        drawTitle(this.title)
      }

      // 设置x轴
      let axisXData = data
      let standardData = Object.values(dataList)[0].map(item => Number(item.date))
      let min = 0
      if (this.age <= 36 && this.chartType === 'CDC' && this.signType !== 'BMI') {
        min = 0
      } else if (this.age > 24 && this.age <= 240 && this.chartType === 'CDC') {
        min = 24
      }
      // console.log('dataList', dataList)
      // 设置定义域和值域

      let linearX = d3.scaleLinear()
        .domain([min, d3.max([...axisXData, ...standardData])])
        .range([0, innerWidth])
      function drawAxisX (age, signType, monthSet, chartType) {
        // let axisXData = data.map(item => Number(item.date))
        // // 设置定义域和值域
        // let linearX = d3.scaleLinear()
        //   .domain([0, d3.max(axisXData)])
        //   .range([0, innerWidth])

        let monthAxis = d3.axisBottom()
          .scale(linearX)
          .tickFormat((d) => {
            // console.log('filters', operateData(age, signType, d, 'filter', monthSet))
            return operateData(age, signType, d, 'filter', monthSet, chartType)
          })
          .tickValues(axisXData.filter(item => {
            // console.log('values', operateData(age, signType, item, '', monthSet))
            return operateData(age, signType, item, '', monthSet, chartType)
          }))
          .tickSize(tickSize)
          .tickPadding(6)
        axisSvg.append('g')
          .attr('transform', 'translate(' + padding.left + ',' + (innerHeight) + ')')
          .classed('who_axis_x', true)
          .call(monthAxis)
        showUpDown(age, signType, axisSvg, chartType)
      }
      drawAxisX(this.age, this.signType, this.monthSet, this.chartType)
      // 设置y轴
      let dataRange = getDomain(this.chartType, this.signType, this.age)
      let tickCount = getTickCount(this.signType, this.age, dataRange)

      let linearY = d3.scaleLinear()
        .domain(dataRange)
        .range([innerHeight, 0])
        .clamp(true)
      function drawAxisY (age, signType, chartType) {
        // let dataRange = getDomain('WHO', signType, age)
        // let tickCount = getTickCount(signType, age, dataRange)

        // let linearY = d3.scaleLinear()
        //   .domain(dataRange)
        //   .range([innerHeight, 0])
        let scaleY = d3.axisLeft()
          .scale(linearY)
          .ticks(tickCount)
          .tickFormat(d => {
            return formatAxisY(signType, age, d, chartType)
          })
          .tickSize(tickSize)
        axisSvg.append('g')
          .attr('transform', 'translate(' + padding.left + ',0)')
          .classed('who_axis_y', true)
          .call(scaleY)
      }
      drawAxisY(this.age, this.signType, this.chartType)
      function drawGridY (parent, signType, chartType, age) {
        let nodes = parent.selectAll('.who_axis_y .tick').nodes()
        let myMap = d3.map(nodes)
        function createGrid (key) {
          d3.select(nodes[key])
            .append('line')
            .attr('x1', 0 + 1)
            .attr('y1', 0)
            .attr('x2', innerWidth)
            .attr('y2', 0)
            .attr('stroke', gridLineColor)
        }
        myMap.each(function (value, key) {
          if (signType === 'WEIGHT' && chartType === 'CDC') {
            if (age > 60) {
              if (key % 10 === 0) {
                createGrid(key)
              }
            } else {
              if (key % 2 === 0) {
                createGrid(key)
              }
            }
          } else {
            createGrid(key)
          }
        })
        parent.selectAll('.who_axis_y path')
          .attr('stroke', axisLineColor)
      }
      drawGridY(axisSvg, this.signType, this.chartType, this.age)
      function drawGridX (parent, signType, age) {
        let nodes = parent.selectAll('.who_axis_x .tick').nodes()
        let myMap = d3.map(nodes)
        myMap.each(function (value, key) {
          d3.select(nodes[key])
            .filter(d => {
              if ((signType === 'HEIGHT' || signType === 'WEIGHT') && age <= 6) {
                return d !== 92
              } else {
                return true
              }
            })
            .append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', -innerHeight)
            .attr('stroke', gridLineColor)
        })
        parent.selectAll('.who_axis_x path')
          .attr('stroke', axisLineColor)
      }
      drawGridX(axisSvg, this.signType, this.age)
      // 绘制折线
      let line = d3.line()
        .x(function (d, i) {
          // return d.date
          return padding.left + linearX(Number(d.date))
        })
        .y(function (d, i) {
          // return d.value
          return linearY((d.value))
        })
      function drawLine () {
        // console.log(dataList, 'data')
        let keys = Object.keys(dataList)
        let values = Object.values(dataList)
        // console.log(keys, values)
        // var lineName = ['97th', '85th', '50th', '15th', '3rd']
        let lineWrap = axisSvg.append('g')
          .classed('line', true)

        let lineColor = {
          'p3': '#f82129',
          'p15': '#ff852b',
          'p50': '#14a642',
          'p85': '#ff852b',
          'p97': '#f82129'
        }
        values.map((item, index) => {
          lineWrap.append('path')
            .attr('stroke', function () {
              if (_this.chartType === 'WHO') {
                return lineColor[keys[index]]
              } else {
                return '#AAA'
              }
            })
            .attr('stroke-width', '1px')
            .attr('fill', 'none')
            .attr('class', 'line')
            .attr('d', line(item))
          var dataItem = values[index]
          lineWrap.append('text')
            .attr('x', function () {
              return padding.left + linearX(Number(dataItem[dataItem.length - 1].date)) + 5
            })
            .attr('y', function () {
              return linearY((dataItem[dataItem.length - 1].value))
            })
            .attr('font-size', '12px')
            .text(seriesName[keys[index]])
        })
        if (!definedData) return false
        lineWrap.append('path')
          .attr('stroke', '#1C7BEF')
          .attr('stroke-width', '1px')
          .attr('fill', 'none')
          .attr('class', 'line')
          .attr('d', line(definedData))
      }
      drawLine()
      function drawCircle (className, data, strokeColor) {
        if (!definedData) return false
        let circleWrap = axisSvg.selectAll(className)
          .data(definedData)
          .enter()
          .filter(function (d) {
            return d.value !== null && d.value !== ''
          })
          .append('g')
          .attr('class', className)
          .style('fill', '#fff')
          .style('stroke', strokeColor)
          .style('stroke-width', '1')
          .attr('transform', function (d) {
            var x = (padding.left + linearX(Number(d.date)))
            var y = (linearY(d.value))
            return 'translate(' + x + ',' + y + ')'
          })
          .style('cursor', 'pointer')
        circleWrap.append('circle').classed('circleL', true).attr('r', 3)
        circleWrap.append('circle').classed('circleS', true).attr('r', 0.4)

        return circleWrap
      }
      function drawCross () {
        let focus = axisSvg.append('g').attr('class', 'focus').style('display', 'none')
        focus.append('line')
          // .attr('id', 'focusLineX')
          .attr('class', 'focusLine focusLineX')
        focus.append('line')
          // .attr('id', 'focusLineY')
          .attr('class', 'focusLine focusLineY')

        d3.selectAll('.focusLine')
          .style('fill', 'none')
          .style('stroke', '#EE4433')
          .style('stroke-width', '1px')

        return focus
      }
      let focus = drawCross()
      if (definedData) {
        let circles = drawCircle('patient_circle', definedData, '#1C7BEF')
        circles.on('mouseover', function (currentNode) {
          // console.log('signtyp', _this.signType)
          d3.select(this).call(msover, chartName[_this.signType], currentNode)
        }).on('mouseout', msout)
      }

      // 移入
      function msover () {
        // arguments
        // 0当前对象，1，传入的的体征名称，2当前数据
        let currentNode = d3.select(arguments[0]).node()
        let signName = arguments[1]
        let currentData = arguments[2]
        focus.style('display', null)

        var x = linearX(Number(currentData.date))
        var y = linearY(currentData.value)
        // 设置坐标点和十字线
        hoverCirCle(currentNode, x, y)
        // 弹框
        toolTip(currentData, signName, x, y)
      }
      // 移出
      function msout () {
        // 当前点放大
        var currentNode = d3.select(this)
        currentNode.style('stroke-width', 1)
        currentNode.select('circle.circleL')
          .attr('r', 3)
          .style('stroke-opacity', 1)
        currentNode.select('circle.circleS')
          .attr('r', 0.4)
        // 十字线隐藏
        focus.style('display', 'none')
        // 文字提示
        d3.select('.dialog' + _this.signType + _this.chartType)
          .style('display', 'none')
      }
      // 设置坐标点和十字线
      function hoverCirCle (currentNode, x, y) {
        // console.log('hover效果', currentNode, x, y)
        currentNode.style('stroke-width', 2)
        currentNode.select('circle.circleL')
          .attr('r', 6)
          .style('stroke-opacity', 0.4)
        currentNode.select('circle.circleS')
          .attr('r', 4)

        focus.select('.focusLineX')
          .attr('x1', x + padding.left).attr('y1', 0)
          .attr('x2', x + padding.left).attr('y2', innerHeight)
        focus.select('.focusLineY')
          .attr('x1', 0 + padding.left).attr('y1', y)
          .attr('x2', width - padding.right).attr('y2', y)
      }
      function toolTip (currentData, signName, x, y) {
        // const unit = {
        //   'WHO': '天',
        //   'CDC': '月'
        // }
        d3.select('.dialog' + _this.signType + _this.chartType)
          .style('text-anchor', 'middle')
          .style('display', 'block')
          .style('opacity', '0.7')
          .html(function () {
            const time = currentData.originDate
            return `<i class="triangle"></i>
              <p class="time">年龄:${time ? _this.$filters.birthdayComputed(_this.birthDay, time) : ''}</p>
              <p class="name">${signName}:${currentData.value} </p>`
          })
          .style('left', function () {
            // return x + 2 * padding.left + 'px'
            // padding.left + 30
            return (x + padding.left + 30 / 2) + 'px'
          })
          .style('margin-left', function () {
            var w = parseFloat(_this.getStyle(dialog, 'width'))
            return (-w / 2 + 15) + 'px'
          })
          .style('top', (y + 2 * padding.top) + 'px')
        // 设置p标签样式
        d3.selectAll('.dialog' + _this.signType + _this.chartType + ' p')
          .style('line-height', '14px')
          .style('text-align', 'left')
          .style('font-size', '14px')
          .style('color', '#fff')
        // 设置小三角样式
        d3.selectAll('.dialog' + _this.signType + _this.chartType + ' .triangle')
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
      // 添加x轴名称
      function drawAxisXName (parent, signType) {
        const text = getAxisName(signType, 'xName')
        parent.append('g')
          .classed('who_axis_name', true)
          .attr('transform', 'translate(0,' + (innerHeight - 15) + ')')
          .append('text')
          .attr('x', innerWidth / 2)
          .attr('y', padding.bottom + padding.top)
          .attr('text-anchor', 'middle')
          .text(text)
      }
      drawAxisXName(axisSvg, this.signType)
      // 添加y轴名称
      function drawAxisYName (parent, signType) {
        const text = getAxisName(signType, 'yName')
        parent.append('g')
          .classed('who_axis_name', true)
          .attr('transform', 'translate(0,' + (innerHeight / 2) + ')')
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('text-anchor', 'middle')
          .text(text)
      }
      drawAxisYName(axisSvg, this.signType)
      // 获取年龄
      let textConfig = getTextConfig(this.signType, this.age, this.chartType)
      function drawAxisName () {
        axisSvg.append('g')
          .attr('transform', 'translate(-20,' + (innerHeight + 15) + ')')
          .style('font-size', '10px')
          .html(`<text x="10">${textConfig.up}</text>
          <line x1="0" y1="4" x2="38" y2="4" stroke="${textConfig.strokeLine}" stroke-width="0.8"></line>
          <text y="16" x="10">${textConfig.down}</text>`)
      }
      drawAxisName()
    }

  }
}
</script>
<style scoped>
.wrap{
    width: 636px;
    margin:0 auto;
}
.axisWrap{
    margin:0 auto;
    position: relative;
    background:#fff;
}
</style>
