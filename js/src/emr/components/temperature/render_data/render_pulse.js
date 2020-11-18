import * as d3 from 'd3'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import Point from '../point.js'
import {toFixed} from '../util.js'
import {parseRePoint} from '../polygon.js'
export class Pulse {
  constructor () {
    this.rawData = DataSourceSingle().temperatureAndPulse
    this.data = []
    this.height = this.rawData.height
    this.pulseRange = this.rawData.pulseRange
    this.temperatureRange = this.rawData.temperatureRange
    this.data = this.rawData.data.filter(item => {
      return item.ml || item.patientStatus
    })
    printRes('render_pulse', this.rawData)
    this.parent = d3.select('.axis_layout_temperatureAndPulse')
    this.axis = new Axis()
    let pulseMin = this.pulseRange.pulseMin
    let pulseMax = this.pulseRange.pulseMax
    let temperatureMin = this.temperatureRange.temperatureMin
    let temperatureMax = this.temperatureRange.temperatureMax
    this.axis.setAxisConfig({
      tickSizeY: 0,
      tickFormatCallback: function (d) {
        if (d % 20 === 0) {
          return d
        }
      },
      tickValueRange: [pulseMin, pulseMax, 4],
      domainRange: [pulseMin, pulseMax],
      valueRange: [this.height, 0]

    })
    this.temperatureAxis = new Axis()
    this.temperatureAxis.setAxisConfig({
      tickFormatCallback: function (d) {
        if (Math.floor(d) === d) {
          return d
        }
      },
      tickValueRange: [temperatureMin, temperatureMax, 0.2],
      domainRange: [temperatureMin, temperatureMax],
      valueRange: [this.height, 0]
    })
  }
  renderData () {
    this.renderLine()
    this.renderPoint()
    this.renderPolygon()
  }
  renderPolygon () {
    // [[{x,y,value,point:{}}]]
    let mbData = []
    let xlData = []
    this.data.forEach((item) => {
      if ((item.ml === 0 || item.ml) && (item.xl === 0 || item.xl)) {
        mbData.push({
          point: item,
          value: item.ml,
          x: this.axis.getScaleX()(new Date(item.datetime)),
          y: this.axis.getScaleY()(item.ml),
          pacemakerStatus: item.pacemakerStatus
        })
        xlData.push({
          point: item,
          value: item.xl,
          x: this.axis.getScaleX()(new Date(item.datetime)),
          y: this.axis.getScaleY()(item.xl),
          pacemakerStatus: item.pacemakerStatus
        })
      }
    })
    let polygonArray = parseRePoint(mbData, xlData)
    d3.select('.axis_layout_temperatureAndPulse').append('g')
      .attr('class', 'polygon')
      .html(() => {
        return polygonArray
      })
  }
  getValue (d) {
    return d.ml
  }
  renderLine () {
    this.line = d3
      .line()
      .defined((d) => {
        return this.getValue(d)
      })
      .x((d) => {
        return this.axis.getScaleX()(new Date(d.datetime))
      })
      .y((d) => {
        return this.axis.getScaleY()(this.getValue(d))
      })
    this.parent
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('class', 'line')
      .attr('d', this.line)
  }
  renderPoint () {
    this.data.forEach(d => {
      let point = new Point()
      let x = this.axis.getScaleX()(new Date(d.datetime))
      let y = this.axis.getScaleY()(this.getValue(d))
      let temperatureY = this.temperatureAxis.getScaleY()(d.yw || d.kw || d.gw)
      let equal = toFixed(y) === toFixed(temperatureY)
      if (!equal) {
        point.draw(this.parent, 'pulse', {x, y})
      }
      if (d.ml > this.pulseRange.pulseMax) {
        point.draw(this.parent, 'arrow', {x: x + 10, y: y - 1})
      }
    })
  }
}
