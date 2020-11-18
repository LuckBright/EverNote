import * as d3 from 'd3'
import {getEndTime, modHour, formatTime, filterTime} from './util.js'
import {blood1, blood2} from '@/emr/config/temperaturedata.js'
let Chart = function () {
  this.init.apply(this, arguments)
  // 初始化边距
  this.margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}

Chart.prototype = {
  constructor: Chart,
  // 初始化
  init: function (options) {
    this.setData(options)
    this.setAxis()
    this.drawLayout()
    this.renderData()
  },
  lineColor: {
    temperature: 'blue', // 体温
    pulseRate: 'red'
  },
  style: {
    lineColor: '#000',
    thinLineColor: '#ccc',
    tempColor: '#000',
    circleR: 4,
    circleWidth: 1,
    breathColor: 'red',
    noramlColor: '#000',
    dataColor: 'blue',
    eventColor: 'red',
    lineWidth: 1,
    strokeRect: 2
  },
  // 处理options里面的内容
  setData: function (options) {
    this.id = options.id
    this.width = options.width
    this.height = options.height
    this.config = options.dataSource.dynamicTable.header
    this.data = options.dataSource.dynamicTable.data
    if (options.dataSource.painData && options.dataSource.painData.length > 0) {
      this.painData = options.dataSource.painData.filter(item => {
        return item.pain !== null
      })
    } else {
      this.painData = []
    }
    this.statusUp = options.dataSource.statusUp
    this.statusDown = options.dataSource.statusDown
    this.chartType = options.dataSource.charType
    this.rowHeight = 20
    if (this.chartType === '1') { // 1体温单 2疼痛单
      this.painHeight = 0
      this.tempHeight = this.height - (this.config.length + 1) * this.rowHeight - this.painHeight
      this.statusDownY = 530 // 每个格子是15，h620/42
    } else if (this.chartType === '2') {
      this.painHeight = 100
      this.tempHeight = this.height - (this.config.length + 1) * this.rowHeight - this.painHeight
      this.statusDownY = 444
    }
    this.colums = [1, 2, 3, 4, 5, 6, 7, 8]
    this.titleWidth = 130
    this.columWidth = (this.width - this.titleWidth) / (this.colums.length - 1)
    this.beginTime = new Date(options.beginTime)
    this.beginTime.setHours(0, 0, 0, 0)
    this.endTime = getEndTime(this.beginTime)
    this.tempData = options.dataSource.chartData
    // 脉搏和心率数据
    let pulseData = []
    let tiwenData = []
    this.tempData.forEach(function (d) {
      if (d.ml || d.xl || d.patientStatus) {
        pulseData.push({
          datetime: d.datetime,
          xl: d.xl,
          ml: d.ml,
          pacemakerStatus: d.pacemakerStatus,
          patientStatus: d.patientStatus
        })
      }
      if (d.yw || d.kw || d.gw || d.patientStatus) {
        tiwenData.push(d)
      }
    })
    this.dataSource = [
      {
        desc: '脉搏',
        code: 'pulseRate',
        unit: '次/分',
        min: 12,
        max: 180,
        data: pulseData
      },
      {
        desc: '体温',
        code: 'temperature',
        unit: '℃',
        min: 33.6,
        max: 42,
        data: tiwenData
      }
    ]
  },
  // 布局
  drawLayout: function () {
    const that = this
    // 绘制svg容器
    d3.select('#' + this.id).select('svg').remove()
    this.svg = d3
      .select('#' + this.id)
      .append('svg')
      .attr('width', this.width + 1)
      .attr('height', this.height + 1)
      .style('font', '10px sans-serif')
      .attr('class', 'svg')
      .append('g')
      .attr('class', 'wrap')
      .attr('transform', 'translate(1,1)')

    function hasName (arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nameEn === val) {
          return true
        }
      }
      return false
    }
    // 绘制行
    this.row = this.svg
      .selectAll('g')
      .data(this.config)
      .enter()
      .append('g')
      .attr('class', function (d, i) {
        return 'itemWrap' + ' ' + d.nameEn
      })
      .attr('transform', function (d, i) {
        if (i <= 2) {
          return 'translate(0,' + i * that.rowHeight + ')'
        } else {
          if (hasName(that.config, 'hx')) {
            if (d.nameEn === 'hx') {
              return 'translate(0,' + (i * that.rowHeight + that.tempHeight + that.painHeight) + ')'
            } else {
              return 'translate(0,' + ((i + 1) * that.rowHeight + that.tempHeight + that.painHeight) + ')'
            }
          } else {
            return 'translate(0,' + (i * that.rowHeight + that.tempHeight + that.painHeight) + ')'
          }
        }
      })

    // 绘制列
    this.colum = this.row
      .selectAll('g.item')
      .data(this.colums)
      .enter()
      .append('g')
      .attr('class', function (d, i) {
        if (i === 0) {
          return 'item itemTitle'
        } else {
          return 'item itemData'
        }
      })
      .attr('transform', function (d, i) {
        if (i === 0) {
          return 'translate(' + 0 + ',0)'
        } else {
          return 'translate(' + ((i - 1) * that.columWidth + that.titleWidth) + ',0)'
        }
      })

    this.colum
      .append('rect')
      .attr('width', function (d, i) {
        if (i === 0) {
          return that.titleWidth
        } else {
          return that.columWidth
        }
      })
      .attr('height', function (d, i) {
        return that.rowHeight
      })
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)
    // 设置边框
    this.colum
      .append('rect')
      .attr('width', function (d, i) {
        if (i > 1) {
          return 1
        } else {
          return 0
        }
      })
      .attr('height', function (d, i) {
        return that.rowHeight
      })
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
    // 呼吸单独设置高度
    this.svg
      .select('g.hx')
      .selectAll('g.item')
      .selectAll('rect')
      .attr('height', this.rowHeight * 2)

    // 绘制体温单
    this.drawTemp()
    // 绘制疼痛单
    if (this.chartType === '2') {
      this.drawPainLayout()
    }
    d3.selectAll('rect')
    .attr('fill', 'none')
  },
  // 渲染数据
  renderData: function () {
    const that = this
    this.appendTitle()
    this.appendData()
    if (this.chartType === '2') {
      this.drawPainLine(this.painData)
    }
    this.drawEvent(this.statusUp, 'up')
    this.drawEvent(this.statusDown, 'down')
    this.dataSource.forEach(function (d, i) {
      // 绘制数据线
      that.drawDataLines(d)
      // 绘制数据点
      that.drawDataCircles(d)
    })
  },
  // 插入标题
  appendTitle: function () {
    const that = this
    this.row
      .select('g.itemTitle')
      .append('text')
      .attr('class', 'textTitle')
      .attr('x', function (d, i) {
        return that.titleWidth / 2
      })
      .attr('y', function (d, i) {
        if (d.nameEn === 'hx') {
          return that.rowHeight
        } else {
          return that.rowHeight / 2
        }
      })
      .text(function (d) {
        return d.nameCn
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14')
  },
  // 插入数据
  appendData: function (val, index) {
    const that = this
    let nodes = d3.selectAll('g.itemWrap').nodes()
    this.config.map(function (key, index) {
      // 如果没有数据直接返回
      if (!that.data[key.nameEn] || !that.data[key.nameEn].length) return false
      if (key.nameEn === 'hx') {
        appendBreathData(that, key, index)
      } else if (key.nameEn === 'xueYa') {
        appendBloodPressData(that, key, index)
      } else {
        appendOtherData(that, key, index)
      }
      function appendBreathData (that, key, index) {
        d3.select('g.wrap')
            .select('g.hx')
            .selectAll('text.textData')
            .data(function () {
              return that.data[key.nameEn]
            })
            .enter()
            .append('text')
            .attr('class', 'textData')
            .attr('x', function (d) {
              const time = modHour(d)
              return that.x(time) + that.titleWidth
            })
            .attr('y', function (d, i) {
              if (i % 2 === 0) {
                return that.rowHeight / 2
              } else {
                return that.rowHeight + that.rowHeight / 2
              }
            })
            .text(function (d) {
              return d.value
            })
            .attr('fill', function (d) {
              if (d.value === 'R') {
                return 'blue'
              } else {
                return that.style.breathColor
              }
            })
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '10')
      }
      function appendAmAndPm (that, arr, index) {
        let amArr = filterTime('am', arr).splice(-1)
        let pmArr = filterTime('pm', arr).splice(-1)
        let lastArr = [...amArr, ...pmArr]
        let bloodNodes = d3.selectAll('g.textData').nodes()
        d3.select(bloodNodes[index])
          .selectAll('text.bloodData')
          .data(function () {
            return lastArr
          })
          .enter()
          .append('text')
          .attr('class', 'bloodData')
          .attr('x', function (d) {
            let hour = new Date(d.datetime).getHours()
            if (hour < 12) {
              return 20
            }
            if (hour >= 12) {
              return 60
            }
          })
          .attr('y', function () {
            return that.rowHeight / 2
          })
          .text(function (d) {
            var val = d.value
            if (!val[blood1] || !val[blood2]) return
            return val[blood1] + '/' + val[blood2]
          })
          .attr('fill', that.style.dataColor)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '10')
      }
      function appendBloodPressData (that, key, index) {
        d3.select('g.wrap')
            .select('g.xueYa')
            .selectAll('g.textData')
            .data(function () {
              return that.data['xueYa']
            })
            .enter()
            .append('g')
            .attr('class', 'textData')
            .attr('transform', function (d, index) {
              appendAmAndPm(that, d.value, index)
              let x = that.x(new Date(d.datetime)) + that.titleWidth
              let y = 0
              return 'translate(' + x + ',' + y + ')'
            })
            .append('rect')
            .attr('fill', 'none')
            .attr('width', that.columWidth)
            .attr('height', that.rowHeight)
      }
      function appendOtherData (that, key, index) {
        d3.select(nodes[index])
            .selectAll('text.textData')
            .data(function () {
              return that.data[key.nameEn]
            })
            .enter()
            .filter(function (item) {
              return item.value !== null
            })
            .append('text')
            .attr('class', 'textData')
            .attr('x', function (d) {
              const time = modHour(d, 0)
              return that.x(time) + that.titleWidth + that.columWidth / 2
            })
            .attr('y', function (d) {
              return that.rowHeight / 2
            })
            .text(function (d, i) {
              if (key.nameEn === 'date') {
                if (i === 0) {
                  return formatTime(d.value, d.value)
                } else {
                  return formatTime(that.data[key.nameEn][i - 1].value, d.value)
                }
              } else {
                return d.value
              }
            })
            .attr('fill', function () {
              let name = key.nameEn
              if (name === 'date' || name === 'zhuYuanTianshu' || name === 'shouShu') {
                return that.style.noramlColor
              } else {
                return that.style.dataColor
              }
            })
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '12')
      }
    })
  },
  // 设置坐标轴
  setAxis: function () {
    const that = this
    const h = this.tempHeight - this.rowHeight
    const w = this.width - this.titleWidth
    const tw = {
      min: 33.6,
      max: 42
    }
    const mb = {
      min: 12,
      max: 180
    }
    // 比例尺
    this.x = d3
      .scaleTime()
      .domain([this.beginTime, this.endTime])
      .range([0, w])

    this.y1 = d3
      .scaleLinear()
      .domain([tw.min, tw.max])
      .rangeRound([h, 0])
    this.y1.clamp(true)

    this.y2 = d3
      .scaleLinear()
      .domain([mb.min, mb.max])
      .rangeRound([h, 0])
    this.y2.clamp(true)
    // 坐标轴
    this.xAxis = d3
      .axisBottom(this.x)
      .tickValues(d3.timeHour.range(this.beginTime, this.endTime, 4))
      .tickSize(h)
      .tickFormat(function (d, i) {
        return
      })

    this.yAxis = d3
      .axisLeft(this.y1)
      .tickValues(d3.range(tw.min, tw.max, 0.2))
      .tickSize(-this.width)
      .tickFormat(function (d, i) {
        if (Math.floor(d) === d) {
          return d
        }
      })
    this.yAxis2 = d3
      .axisLeft(this.y2)
      .tickValues(d3.range(mb.min, mb.max, 4))
      .tickSize(0)
      .tickFormat(function (d, i) {
        if (d % 20 === 0) {
          return d
        }
      })

    // 绘制折线
    this.line = d3
      .line()
      .defined(function (d) {
        return d.svgValue
      })
      .x(function (d) {
        return that.x(new Date(d.datetime))
      })
      .y(function (d) {
        return that.y1(d.svgValue)
      })
    this.line2 = d3
      .line()
      .defined(function (d) {
        return d.svgValue
      })
      .x(function (d) {
        return that.x(new Date(d.datetime))
      })
      .y(function (d) {
        return that.y2(d.svgValue)
      })
  },
  // 绘制血压
  drawBloodPressAxis: function () {
    const bloodPressXAxis = d3
      .axisBottom(this.x)
      .tickValues(d3.timeHour.range(this.beginTime, this.endTime, 12))
      .tickSize(this.rowHeight)
      .tickFormat(function (d, i) {
        return
      })

    this.svg
      .select('g.xueYa')
      .append('g')
      .attr('class', 'x xueYaData')
      .attr('transform', 'translate(' + this.titleWidth + ',0)')
      .call(bloodPressXAxis)

    this.svg
      .select('g.hx')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'xAxisLine')
      .attr('stroke', this.style.lineColor)
      .filter(function (d, i) {
        return i % 6 === 0 && i !== 0
      })
      .attr('stroke-width', 2)
      .attr('stroke', 'red')
  },
  // 绘制事件
  drawEvent: function (data, command) {
    var that = this
    if (!data) return false
    this.chart
      .append('g')
      .attr('class', 'textWrap')
      .selectAll('g')
      .data(data)
      .enter()
      .filter(function (d) {
        return d.value
      })
      .append('g')
      .attr('class', 'textItem')
      .attr('transform', function (d, i) {
        var x = that.x(modHour(d)) - 5
        if (command === 'up') {
          return 'translate(' + x + ',10)'
        } else if (command === 'down') {
          return 'translate(' + x + ',' + that.statusDownY + ')'
        }
      })
      .selectAll('text')
      .data(function (d) {
        var txt = d.value
        return txt.split('')
      })
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('x', function (d) {
        if (d === '|') {
          return 5
        }
      })
      .attr('y', function (d, i) {
        return i * 12
      })
      .attr('font-size', '10')
      .attr('fill', this.style.eventColor)
      .attr('stroke-width', 1)
      .text(function (d) {
        return d
      })
  },
  // 绘制体温和脉搏
  drawTemp: function () {
    const that = this
    this.tempChart = this.svg
      .append('g')
      .attr('class', 'tempChart')
      .attr('transform', function () {
        return 'translate(0,' + that.rowHeight * 3 + ')'
      })

    this.tempChart
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.tempHeight)
      .attr('stroke', this.style.tempColor)
      .attr('stroke-width', this.style.strokeRect)
    this.drawTimeBar()
    this.drawChartLayout()
  },
  // 绘制折线
  drawDataLines: function (info) {
    // var that = this
    var data = info.data
    var type = info.code
    // 数据转换
    data.forEach(function (d, i) {
      if (type === 'temperature') {
        var val = d.yw || d.gw || d.kw
        d.svgValue = val
        // d.coolValue =d.jw
        // d.heatValue = getConvertValue(d.sw, info.min, info.max, that.tempHeight)
      } else {
        d.svgValue = d.ml
      }
    })
    let mlData = data.filter(d => {
      return d.ml || d.patientStatus
    })

    // 添加数据线
    if (type === 'temperature') {
      this.chart
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', this.lineColor[type])
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth)
      .attr('class', 'line')
      .attr('d', this.line)
    } else if (type === 'pulseRate') {
      this.chart
      .append('path')
      .datum(mlData)
      .attr('fill', 'none')
      .attr('stroke', this.lineColor[type])
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth)
      .attr('class', 'line')
      .attr('d', this.line2)
    }
  },
  // 绘制数据点
  drawDataCircles: function (info) {
    var that = this
    var data = info.data
    var type = info.code
    if (type === 'temperature') { // 体温
      this.chart
        .append('g')
        .attr('class', type + 'CirclesWrap CirclesWrap')
        .selectAll('g')
        .data(data)
        .enter()
        .filter(function (d) {
          const val = d.yw || d.kw || d.gw
          return val && val >= 35 && val <= 42
        })
        .append('g')
        .attr('transform', function (d, i) {
          var x = that.x(new Date(d.datetime))
          var y = that.y1(d.svgValue)
          var mby = that.y2(d.ml)
          var xly = that.y2(d.xl)
          var equal = (y === mby) || (y === xly)
          // 使用了心率起搏器并且体温===心率 //不走下面的逻辑
          if (d.pacemakerStatus && y === xly) {
            that.drawIcon(x, y - 15, 'pacemaker')
          }
          // if (d.pacemakerStatus && y === xly) {
          // } else {
             // 腋温与脉搏重合
          if (d.yw) {
            if (equal) {
              // that.drawIcon(x, y - 15, 'pacemaker')
              that.drawym(x, y)
            } else {
              that.drawCross(x, y)
            }
          }
            // 口温与脉搏重合
          if (d.kw) {
            if (equal) {
              // that.drawIcon(x, y - 15, 'pacemaker')
              that.drawkm(x, y)
            } else {
              that.drawCircle(x, y)
            }
          }
            // 肛温与脉搏重合
          if (d.gw) {
            if (equal) {
              // that.drawIcon(x, y - 15, 'pacemaker')
              that.drawgm(x, y)
            } else {
              that.drawEmptyCircle(x, y)
            }
          }
          // }

          return 'translate(' + x + ',' + y + ')'
        })
    } else if (type === 'pulseRate') { // 脉搏
      this.chart
        .append('g')
        .attr('class', type + 'CirclesWrap CirclesWrap')
        .selectAll('g')
        .data(data)
        .enter()
        .filter(function (d) {
          return d.ml
        })
        .append('g')
        .attr('transform', function (d, i) {
          var x = that.x(new Date(d.datetime))
          // var y1 = that.y1(d.svgValue)// 体温
          var y = that.y2(d.ml)
          // var xly = that.y2(d.xl)
         //
          // 判断心率和脉搏
          if (d.ml > 180) {
            that.drawIcon(x + 10, y, 'pulse&gt180')
          }
          // if (d.ml > 180) {
          //   that.drawIcon(x, y, 'pulse&gt180')
          // } else {
          //   that.drawPulse(x, y, type)
          // }
          that.drawPulse(x, y, type)

          return 'translate(' + x + ',' + y + ')'
        })

      this.drawHeartRate(data, type)
    }

    this.changeTemp(that, data, type)
  },
  // 绘制心率
  drawHeartRate: function (data, type) {
    const that = this
    let heartData = []
    let tempData = data.filter(function (d, i) {
      return d.xl || d.patientStatus
    })
    tempData.forEach(function (d, i) {
      var x1
      var x2
      var y1
      var y2
      if (!d.ml) {
        y1 = null
        x1 = null
      } else {
        y1 = that.y2(d.ml)
        x1 = that.x(new Date(d.datetime))
      }
      if (!d.xl) {
        y2 = null
        x2 = null
      } else {
        y2 = that.y2(d.xl)
        x2 = that.x(new Date(d.datetime))
      }
      that.drawConnectLine(x1, y1, x2, y2, 'solid', that.chart)
      heartData.push([x2, y2])
      if (d.ml === d.xl) {
        that.drawxm(tempData, type, i)
      } else {
        that.drawxl(tempData, type, i)
      }
    })

    if (heartData) {
      var heartLine = d3.line().defined(function (d, i) {
        return d[1] !== null
      })
      that.chart
        .insert('path', 'g.pulseRate')
        .attr('d', function () {
          return heartLine(heartData)
        })
        .attr('transform', 'translate(0,0)')
        .attr('stroke', 'red')
        .attr('stroke-width', that.style.lineWidth)
        .attr('fill', 'none')
    }
  },
  // 物理升温和降温
  changeTemp: function (that, data, type) {
    this.chart
      .append('g')
      .attr('class', type + 'cooling')
      .selectAll('circle')
      .data(data)
      .enter()
      .filter(function (d) {
        return d.yw || d.kw || d.gw
      })
      .filter(function (d, i) {
        return d.jw || d.sw
      })
      .append('circle')
      .attr('stroke', function (d) {
        if (d.jw || d.sw) {
          return 'red'
        }
      })
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', function (d) {
        if (d.jw || d.sw) {
          return '#fff'
        } else {
          return 'none'
        }
      })
      .attr('cx', function (d) {
        return that.x(new Date(d.datetime))
      })
      .attr('cy', function (d) {
        if (d.jw || d.sw) {
          var x1 = that.x(new Date(d.datetime))
          var x2 = that.x(new Date(d.datetime))
          var y1 = that.y1(d.svgValue)
          var temp = d.jw || d.sw
          var y2 = that.y1(temp)
          that.drawConnectLine(x1, y1, x2, y2, 'dashed', that.chart)
          return y2
        }
      })
      .attr('r', function (d) {
        return that.style.circleR
      })
  },
  // 绘制时间轴
  drawTimeBar: function () {
    // 生成时间点
    const that = this
    const timeAxisData = []
    for (var i = 1; i <= 7; i++) {
      for (var j = 1; j <= 6; j++) {
        timeAxisData.push(j * 4 - 2)
      }
    }
    this.tempChart
      .append('g')
      .attr('class', 'timeAxis')
      .attr('transform', 'translate(' + this.titleWidth + ',0)')

    // 时间标题
    let timeTitle = this.tempChart
      .append('g')
      .attr('class', 'timeTitle')

    timeTitle
      .append('rect')
      .attr('width', this.titleWidth)
      .attr('height', this.rowHeight)
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)

    timeTitle
      .append('text')
      .attr('x', this.titleWidth / 2)
      .attr('y', this.rowHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14')
      .text(function (d, i) {
        return '时间'
      })

    let timeBar = this.tempChart
      .select('g.timeAxis')
      .selectAll('g')
      .data(timeAxisData)
      .enter()
      .append('g')
      .attr('width', (this.width - this.titleWidth) / 42)
      .attr('height', this.rowHeight)
      .attr('transform', function (d, i) {
        const move = i * (that.width - that.titleWidth) / 42
        return 'translate(' + move + ',0)'
      })

    timeBar
      .append('rect')
      .attr('class', 'rectTime')
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)
      .attr('width', (this.width - this.titleWidth) / 42)
      .attr('height', this.rowHeight)
    timeBar
      .append('rect')
      .attr('class', 'rectTime_border')
      .attr('height', this.rowHeight)
      .attr('stroke-width', 1)
      .attr('width', 1)
      .filter(function (d, i) {
        return i % 6 === 0 && i !== 0
      })
      .attr('stroke', 'red')

    timeBar
      .append('text')
      .attr('x', this.width / 42 / 2 - 2)
      .attr('y', this.rowHeight / 2)
      .attr('fill', function (d, i) {
        let redNums = [2, 18, 22]
        if (redNums.includes(d)) {
          return 'red'
        } else {
          return '#000'
        }
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10')
      .text(function (d, i) {
        return d
      })
  },
  // 绘制脉搏和心率布局
  drawChartLayout: function () {
    const that = this
    const axisName = [
      {
        name: '脉搏',
        unit: '(次/分)'
      },
      {
        name: '体温',
        unit: '(°C)'
      }
    ]
    let axisNameWrap = this.tempChart
      .selectAll('g.tickTitle')
      .data(axisName)
      .enter()
      .append('g')
      .attr('class', 'tickTitle')
    axisNameWrap
      .append('text')
      .attr('transform', function (d, i) {
        return 'translate(' + i * that.titleWidth / 2 + ',' + that.rowHeight + ')'
      })
      .text(function (d) {
        return d.name
      })
      .attr('x', function () {
        return that.titleWidth / 2 / 2
      })
      .attr('y', function () {
        return that.rowHeight / 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14')

    axisNameWrap
      .append('text')
      .attr('transform', function (d, i) {
        return 'translate(' + i * that.titleWidth / 2 + ',' + that.rowHeight * 2 + ')'
      })
      .text(function (d) {
        return d.unit
      })
      .attr('x', function () {
        return that.titleWidth / 2 / 2
      })
      .attr('y', function () {
        return that.rowHeight / 2
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14')

    this.chart = this.tempChart
      .append('g')
      .attr('class', 'chart')
      .attr('transform', function () {
        return 'translate(' + that.titleWidth + ',' + that.rowHeight + ')'
      })

    this.chart
      .append('rect')
      .attr('width', this.width - this.titleWidth)
      .attr('height', this.tempHeight - this.rowHeight)
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)

    this.drawChartAxis()
    this.drawBreathAxis()
    this.drawBloodPressAxis()
  },
  // 呼吸轴
  drawBreathAxis: function () {
    const breathXAxis = d3
      .axisBottom(this.x)
      .tickValues(d3.timeHour.range(this.beginTime, this.endTime, 4))
      .tickSize(this.rowHeight * 2)
      .tickFormat(function (d, i) {
        return
      })
    this.svg
      .select('g.hx')
      .append('g')
      .attr('class', 'x breathData')
      .attr('transform', 'translate(' + this.titleWidth + ',0)')
      .call(breathXAxis)

    this.svg
      .select('g.hx')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'xAxisLine')
      .attr('stroke', this.style.lineColor)
      .filter(function (d, i) {
        return i % 6 === 0 && i !== 0
      })
      .attr('stroke-width', 2)
      .attr('stroke', 'red')
  },
  // 左侧y轴
  drawDataAxis: function (info, index) {
    // var that = this
    var type = info.code
    var axisData = []
    var diff = (info.max - info.min) / (info.max - info.min)
    var axisHeight = this.tempHeight - this.rowHeight
    for (var i = 0; i < 9; i++) {
      axisData.push(info.min + i * diff)
    }
    var wrap = this.tempChart
      .append('g')
      .attr('class', 'yAxisWrap')
      .attr('transform', 'translate(0,' + this.rowHeight + ')')

    wrap
      .append('rect')
      .attr('width', this.titleWidth)
      .attr('height', axisHeight)
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)

    wrap
      .append('g')
      .attr('class', type + 'Axis')
      .attr('transform', 'translate(' + this.titleWidth / 2 * index + ', 0)')

    wrap
      .select('g.' + type + 'Axis')
      .append('rect')
      .attr('width', this.titleWidth / 2)
      .attr('height', axisHeight)
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)

    wrap
      .select('g.' + type + 'Axis')
      .selectAll('text')
      .data(axisData)
      .enter()
      .append('text')
      .attr('x', this.titleWidth / 2)
      .attr('y', axisHeight)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('dy', '.35em')
      .attr('class', 'numberStick')
      .attr('transform', function (d, i) {
        var move = -i * axisHeight / 8
        if (i === 0) {
          move -= 10
        } else if (i === 8) {
          move += 10
        }
        return 'translate(-10,' + move + ')'
      })
      .text(function (d, i) {
        return d
      })
  },
  drawChartAxis: function () {
    // 绘制y轴刻度
    this.chart
      .append('g')
      .attr('class', 'y axisY')
      .call(this.yAxis)

    this.chart
      .append('g')
      .attr('class', 'y2 axisY')
      .attr('transform', 'translate(' + (-this.titleWidth / 2) + ',0)')
      .call(this.yAxis2)

    // y轴刻度线样式
    this.chart
      .select('g.y')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'yAxisLine')
      .attr('stroke', this.style.thinLineColor)
      .filter(function (d, i) {
        return Math.floor(d) === d
      })
      .attr('stroke-width', 2)
      .attr('stroke', this.style.lineColor)
     // 绘制x轴刻度
    this.chart
     .append('g')
     .attr('class', 'x axis')
     .call(this.xAxis)
   // x轴刻度线样式
    this.chart
     .select('g.x')
     .selectAll('g.tick')
     .select('line')
     .attr('class', 'xAxisLine')
     .attr('stroke', this.style.thinLineColor)
     .filter(function (d, i) {
       return i % 6 === 0 && i !== 0
     })
     .attr('stroke-width', 2)
     .attr('stroke', 'red')

    // y值刻度值的位置
    this.chart
      .selectAll('g.axisY')
      .selectAll('g.tick')
      .select('text')
      .attr('x', '-20')

    this.chart
      .selectAll('g.axis')
      .select('path.domain')
      .attr('stroke', this.style.lineColor)
  },
  // 绘制疼痛布局
  drawPainLayout: function () {
    const that = this
    this.painChart = this.svg
      .append('g')
      .attr('class', 'painChart')
      .attr('transform', function () {
        return 'translate(0,' + (that.rowHeight * 3 + that.tempHeight) + ')'// 1130没有手术
      })

    this.painChart
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.painHeight)
      .attr('stroke', this.style.tempColor)
      .attr('stroke-width', this.style.strokeRect)
    // 绘制标题
    this.painTitle = this.painChart
      .append('g')
      .attr('class', 'painTitle')
    this.painTitle
      .append('rect')
      .attr('width', this.titleWidth)
      .attr('height', this.painHeight)
      .attr('stroke', this.style.lineColor)
      .attr('stroke-width', this.style.strokeRect)
    this.painTitle
      .append('text')
      .attr('x', this.titleWidth / 2)
      .attr('y', this.painHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '14')
      .text('疼痛等级')

    this.drawPainAxis()
  },
  // 绘制疼痛坐标轴
  drawPainAxis: function () {
    const that = this
    this.painXAxis = d3
      .axisBottom(this.x)
      .tickValues(d3.timeHour.range(this.beginTime, this.endTime, 4))
      .tickSize(this.painHeight)
      .tickFormat(function (d, i) {
        return
      })

    this.painY = d3
      .scaleLinear()
      .domain([-1, 11])
      .range([100, -1])
    this.painY.clamp(true)

    this.painYAxis = d3
      .axisLeft(this.painY)
      .tickValues(d3.range(0, 110 / 10, 2))
      .tickSize(-this.width)
      .tickFormat(function (d, i) {
        return d
      })
    this.painAxis = this.painChart
      .append('g')
      .attr('class', 'painAxis')
      .attr('transform', function () {
        return 'translate(' + that.titleWidth + ',0)'
      })
    this.painAxis
      .append('g')
      .attr('class', 'painX axis')
      .call(this.painXAxis)

    this.painAxis
      .select('g.painX')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'xAxisLine')
      .attr('stroke', function () {
        return that.style.thinLineColor
      })
      .filter(function (d, i) {
        return i % 6 === 0 && i !== 0
      })
      .attr('stroke-width', 2)
      .attr('stroke', 'red')

    // 绘制y轴刻度
    this.painAxis
     .append('g')
     .attr('class', 'painY axis')
     .call(this.painYAxis)

   // y轴刻度线样式
    this.painAxis
     .select('g.painY')
     .selectAll('g.tick')
     .select('line')
     .attr('class', 'yAxisLine')
     .attr('stroke', function () {
       return that.style.thinLineColor
     })
  },
  // 绘制疼痛曲线
  drawPainLine: function (painData) {
    if (!painData) return false
    const that = this
    this.painLine = d3
      .line()
      .defined(function (d) {
        return d.pain != null
      })
      .x(function (d) {
        return that.x(new Date(d.datetime))
      })
      .y(function (d) {
        return that.painY(d.pain)
      })
    this.painAxis
      .append('path')
      .data(painData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth)
      .attr('class', 'painLine')
      .attr('d', this.painLine(painData))

    // 绘制疼痛数据点
    this.painAxis
        .append('g')
        .attr('class', 'CirclesWrap')
        .selectAll('g')
        .data(painData)
        .enter()
        .filter(function (d) {
          return d.pain !== null && d.pain >= 0
        })
        .append('g')
        .attr('stroke', 'green')
        .attr('fill', 'green')
        .attr('transform', function (d) {
          let x = that.x(new Date(d.datetime))
          let y = that.painY(d.pain)
          if (d.pain === d.zt) {
            that.drawIcon(x, y, 'painAndZt')
          } else {
            that.drawPlus(x, y)
          }
          return 'translate(' + x + ', ' + y + ')'
        })
        .attr('cx', function (d, i) {
          return that.x(new Date(d.datetime))
        })
        .attr('cy', function (d, i) {
          return that.painY(d.pain)
        })
        .attr('r', function (d, i) {
          return that.style.circleR
        })
    // 镇痛
    this.painAxis
      .append('g')
      .attr('class', 'zt')
      .selectAll('circle')
      .data(painData)
      .enter()
      .filter(function (d, i) {
        return d.pain !== null && d.zt !== null && d.zt >= 0 && d.zt <= 10 && d.zt !== d.pain
      })
      .append('circle')
      .attr('stroke', function (d) {
        if (d.zt !== null) {
          return 'red'
        }
      })
      .attr('fill', function (d) {
        if (d.zt !== null) {
          return '#fff'
        } else {
          return 'none'
        }
      })
      .attr('cx', function (d) {
        return that.x(new Date(d.datetime))
      })
      .attr('cy', function (d) {
        if (d.zt !== null) {
          var x1 = that.x(new Date(d.datetime))
          var x2 = that.x(new Date(d.datetime))
          var y1 = that.painY(d.pain)
          var y2 = that.painY(d.zt)
          that.drawConnectLine(x1, y1, x2, y2, 'dashed', that.painAxis)
          return y2
        }
      })
      .attr('r', function (d) {
        return that.style.circleR
      })
  },
  // 绘制连接线
  drawConnectLine: function (x1, y1, x2, y2, type, parent) {
    if (x1 === null || y1 === null || x2 === null || y2 === null) {
      return false
    }
    var line = parent
      .insert('g', 'g.CirclesWrap')
      .attr('class', 'line')
      .append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', this.style.lineWidth)

    if (type === 'dashed') {
      line
        .attr('stroke-dasharray', '5,5')
    }
    if (type === 'solid') {
      line
        .attr('stroke-dasharray', '5,0')
    }
  },
  drawEmptyCircle: function (x, y) {
    this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')
      .append('circle')
      .attr('stroke', 'blue')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR)
  },
  drawCircle: function (x, y) {
    this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')
      .append('circle')
      .attr('stroke', 'blue')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', 'blue')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR)
  },
  drawIcon: function (x, y, type, overlap) {
    // patientStatus:表示外出拒测0 Number类型
    // pacemakerStatue：true 表示使用的心脏起搏器
    let parent = this.chart
    let icon = ''
    let dy = 0
    let fontSize = '10px'
    if (type === 'pacemaker') { // 心脏起搏器
      icon = 'H'
      dy = 1
      fontSize = '7px'
    } else if (type === 'painAndZt') { // 镇痛和疼痛重叠
      icon = '+'
      parent = this.painAxis
    } else if (type === 'pulse&gt180') { // 脉搏或者心率大于180，不包括180
      icon = '↑'
      dy = 1
    }
    let wrap = parent
    .append('g')
    .attr('class', 'CirclesWrap')
    .attr('transform', 'translate(' + x + ',' + y + ')')
    if (type === 'painAndZt' || (type === 'pacemaker') && overlap) {
      wrap
      .append('circle')
      .attr('stroke', 'red')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR)
    }

    wrap
      .append('text')
      .attr('stroke', 'red')
      .attr('fill', 'red')
      .attr('stroke-width', 0.5)
      .attr('font-size', fontSize)
      .attr('dy', dy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(function () {
        return icon
      })
  },
  drawPulse: function (x, y, type) {
        // .append('circle')
        // .attr('stroke', this.lineColor[type])
        // .attr('stroke-width', this.style.circleWidth)
        // .attr('fill', this.lineColor[type])
        // .attr('cx', function (d, i) {
        //   return that.x(new Date(d.datetime))
        // })
        // .attr('cy', function (d, i) {
        //   return that.y2(d.ml)
        // })
        // .attr('r', function (d, i) {
        //   return that.style.circleR
        // })
    this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')
      .append('circle')
      .attr('stroke', this.lineColor[type])
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', this.lineColor[type])
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR)
  },
  drawCross: function (x, y) {
    var cross = this.chart
      .append('g')
      .attr('class', 'cross')
      .attr('transform', 'translate(' + (x - 4) + ',' + (y - 4) + ') scale(0.8)')
    var pointy = 8
    cross
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', pointy)
      .attr('y2', pointy)
      .attr('stroke', 'blue')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth + 1)

    cross
      .append('line')
      .attr('x1', pointy)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', pointy)
      .attr('stroke', 'blue')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth + 1)
  },
  // 绘制加号
  drawPlus: function (x, y) {
    var cross = this.painAxis
      .append('g')
      .attr('class', 'cross')
      .attr('transform', 'translate(' + (x - 4) + ',' + (y - 4) + ') scale(1)')
    var pointy = 8
    cross
      .append('line')
      .attr('x1', 0)
      .attr('y1', pointy)
      .attr('x2', pointy)
      .attr('y2', pointy)
      .attr('transform', 'translate(' + 0 + ',' + -pointy / 2 + ')')
      .attr('stroke', 'red')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth + 1)

    cross
      .append('line')
      .attr('x1', pointy)
      .attr('y1', 0)
      .attr('x2', pointy)
      .attr('y2', pointy)
      .attr('transform', 'translate(' + -pointy / 2 + ',' + 0 + ')')
      .attr('stroke', 'red')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.style.lineWidth + 1)
  },
  // 肛温和脉搏重叠
  drawgm: function (x, y) {
    var gm = this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')

    gm
      .append('circle')
      .attr('stroke', 'blue')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR + 1)

    gm
      .append('circle')
      .attr('stroke', 'none')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', 'red')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 2)
  },
  // 口温和脉搏重叠
  drawkm: function (x, y) {
    var km = this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')

    km
      .append('circle')
      .attr('stroke', 'red')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR + 1)

    km
      .append('circle')
      .attr('stroke', 'none')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', 'blue')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 2)
  },
  // 腋温和脉搏重叠
  drawym: function (x, y) {
    var ym = this.chart
      .append('g')
      .attr('class', 'CirclesWrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')

    ym
      .append('circle')
      .attr('stroke', 'red')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR + 1)
    this.drawCross(x, y)
  },
  // 腋温和脉搏重叠
  drawxm: function (data, type, index) {
    const that = this
    var xm = this.chart
      .selectAll('g.' + type)
      .data(data)
      .enter()
      .filter(function (d, i) {
        return d.xl && d.xl >= 12 && d.xl <= 176 && i === index
      })
      .append('g')
      .attr('class', type)
      .attr('transform', function (d, i) {
        const x = that.x(new Date(d.datetime))
        const y = that.y2(d.xl)
        return 'translate(' + x + ', ' + y + ')'
      })
    xm
      .append('circle')
      .attr('stroke', 'red')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', '#fff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.style.circleR + 1)
    xm
      .append('circle')
      .attr('stroke', 'none')
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', 'red')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 2)
  },
  // 心率点
  drawxl: function (data, type, index) {
    let that = this
    // 心率大于180绘制上箭头
    let curVal = data[index]
    if (curVal.xl && curVal.xl > 180) {
      this.drawIcon(that.x(new Date(curVal.datetime)) + 10, that.y2(curVal.xl), 'pulse&gt180')
      if (curVal.pacemakerStatus) {
        this.drawIcon(that.x(new Date(curVal.datetime)), that.y2(curVal.xl), 'pacemaker', true)
        return false
      }
      // return false
    } else if (curVal.xl && curVal.pacemakerStatus) {
      this.drawIcon(that.x(new Date(curVal.datetime)), that.y2(curVal.xl), 'pacemaker', true)
      return false
    }
    // 心率小于等于180正常绘制流程
    this.chart
      .append('g')
      .attr('class', type)
      .selectAll('circle')
      .data(data)
      .enter()
      .filter(function (d, i) {
        return d.xl && i === index
      })
      .append('circle')
      .attr('stroke', function (d) {
        if (d.xl) {
          return 'red'
        }
      })
      .attr('stroke-width', this.style.circleWidth)
      .attr('fill', function (d) {
        if (d.xl) {
          return '#fff'
        } else {
          return 'none'
        }
      })
      .attr('cx', function (d) {
        return that.x(new Date(d.datetime))
      })
      .attr('cy', function (d) {
        var y2 = that.y2(d.xl)
        return y2
      })
      .attr('r', function () {
        return that.style.circleR
      })
  }

}

export {Chart}
