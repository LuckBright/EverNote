import * as d3 from 'd3'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import Point from '../point.js'
import {ConnectLine} from './connect_line.js'
export class Cooling {
  constructor () {
    let rawData = DataSourceSingle().temperatureAndPulse
    this.data = rawData.data
    this.height = rawData.height
    this.temperatureRange = rawData.temperatureRange

    // DataSourceSingle().getData.forEach(item => {
    //   if (item.nameEn === 'temperatureAndPulse') {
    //     this.data = item.data
    //     this.height = item.height
    //     this.temperatureRange = item.temperatureRange
    //   }
    // })
    printRes('render_cooling', rawData)
    this.axis = new Axis()
    let temperatureMin = this.temperatureRange.temperatureMin
    let temperatureMax = this.temperatureRange.temperatureMax
    this.axis.setAxisConfig({
      tickFormatCallback: function (d) {
        if (Math.floor(d) === d) {
          return d
        }
      },
      tickValueRange: [temperatureMin, temperatureMax, 0.2],
      domainRange: [temperatureMin, temperatureMax, 42],
      valueRange: [this.height, 0]
    })
  }
  renderData () {
    this.renderPoint()
  }
  getValue (d) {
    return d.yw || d.kw || d.gw
  }
  renderPoint () {
    let parent = d3.select('.axis_layout_temperatureAndPulse')
     // 绘制升温降温数据点
    this.data.filter(item => {
      return item.jw || item.sw
    }).forEach(d => {
      let point = new Point()
      let x = this.axis.getScaleX()(new Date(d.datetime)) || null
      let y = this.axis.getScaleY()(d.jw || d.sw) || null
      let startY = this.axis.getScaleY()(this.getValue(d)) || null
      if (this.getValue(d) && (this.getValue(d) !== d.jw || this.getValue(d) !== d.sw)) {
        /* eslint-disable no-new */
        new ConnectLine({
          startX: x,
          startY: startY,
          endX: x,
          endY: y,
          lineType: 'dashed',
          parent,
        })
        point.draw(parent, 'cooling', {x, y})
      }
    })
  }
}

/**
 * 使用心率起搏器的情况
 * 1，超过180，需要在原点右侧标注上箭头
 *  心率和脉搏重叠
 * 心率和脉搏不重叠，心率大于脉搏或者心率小于脉搏
 * 2，没有超过180
 * 心率和脉搏重叠，
 * 心率和体温重叠
*/
