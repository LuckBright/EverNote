import * as d3 from 'd3'
import {modHour} from '../util.js'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
export class Event {
  constructor (command) {
    this.command = command
    this.rawData = DataSourceSingle().temperatureAndPulse
    this.data = []
    this.height = this.rawData.height
    this.pulseRange = this.rawData.pulseRange
    this.temperatureRange = this.rawData.temperatureRange
    this.data = this.rawData[this.command]
    this.beginTime = DataSourceSingle().beginDate
    this.startNum = DataSourceSingle().startWithNum
    this.chartType = DataSourceSingle().chartType
    // console.log(DataSourceSingle(), 'signle')
    // DataSourceSingle().getData.forEach(item => {
    //   if (item.nameEn === 'temperatureAndPulse') {
    //     this.data = item[this.command]
    //     this.temperatureRange = item.temperatureRange
    //     this.height = item.height
    //     this.beginTime = item.beginTime
    //     this.startNum = item.startNum
    //   }
    // })
    printRes('render_event', this.rawData)
    printRes('render_event', this.beginTime)
    printRes('render_event', this.startNum)
    this.parent = d3.select('.axis_layout_temperatureAndPulse')
    this.axis = new Axis()
    let temperatureMin = this.temperatureRange.min
    let temperatureMax = this.temperatureRange.max
    this.axis.setAxisConfig({
      tickValueRange: [temperatureMin, temperatureMax, 0.2],
      domainRange: [temperatureMin, temperatureMax],
      valueRange: [this.height, 0]
    })
  }
  renderData () {
    if (!this.data.length) return false
    this.parent
      .append('g')
      .attr('class', 'textWrap')
      .selectAll('g')
      .data(() => {
        return this.data.filter(d => d.value)
      })
      .enter()
      .append('g')
      .attr('class', 'textItem')
      .attr('transform', (d) => {
        let x = this.axis.getScaleX()(modHour(d, null, this.startNum)) - 5
        // let y = this.axis.getScaleY()(35) + 10
        let y = this.chartType === 1 ? 510 : 428
        if (this.command === 'statusUp') {
          return 'translate(' + x + ',10)'
        } else if (this.command === 'statusDown') {
          // debugger
          return 'translate(' + x + ',' + y + ')'
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
      .attr('font-size', '10px')
      .attr('fill', 'red')
      .attr('stroke-width', 3)
      .text(function (d) {
        return d
      })
  }

}
