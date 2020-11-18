import * as d3 from 'd3'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import Point from '../point.js'
import {toFixed} from '../util.js'
export class Heart {
  constructor () {
    this.rawData = DataSourceSingle().temperatureAndPulse
    this.data = []
    this.height = this.rawData.height
    this.pulseRange = this.rawData.pulseRange
    this.temperatureRange = this.rawData.temperatureRange
    this.data = this.rawData.data.filter(item => {
      return item.xl || item.patientStatus
    })
    printRes('render_heart', this.rawData)
    this.parent = d3.select('.axis_layout_temperatureAndPulse')
    let pulseMin = this.pulseRange.pulseMin
    let pulseMax = this.pulseRange.pulseMax
    let temperatureMin = this.temperatureRange.temperatureMin
    let temperatureMax = this.temperatureRange.temperatureMax
    this.axis = new Axis()
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
  }
  getValue (d) {
    return d.xl
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
      var x = this.axis.getScaleX()(new Date(d.datetime))
      var y = this.axis.getScaleY()(this.getValue(d))
      let temperatureY = this.temperatureAxis.getScaleY()(d.yw || d.kw || d.gw || null)
      let equal = toFixed(y) === toFixed(temperatureY)
      if (!equal) {
        if (d.ml === d.xl) {
          point.draw(this.parent, 'overlap', {x, y, overlapType: 'pulseAndHeart'})
        } else {
          // if (d.ml > 180 && d.xl > 180) return
          if (d.ml > this.pulseRange.pulseMax && d.xl > this.pulseRange.pulseMax) return
          if (d.xl > this.pulseRange.pulseMax) {
            point.draw(this.parent, 'arrow', {x: x + 10, y: y})
          }
          if (d.pacemakerStatus) {
            point.draw(this.parent, 'heart', {x, y, peaceMaker: true})
          } else {
            point.draw(this.parent, 'heart', {x, y})
          }
        }
      }
    })
  }
}
