import * as d3 from 'd3'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import Point from '../point.js'
import {toFixed} from '../util.js'
export class Temperature {
  constructor () {
    this.rawData = DataSourceSingle().temperatureAndPulse
    this.data = []
    this.height = this.rawData.height
    this.pulseRange = this.rawData.pulseRange
    this.temperatureRange = this.rawData.temperatureRange
    let pulseMin = this.pulseRange.pulseMin
    let pulseMax = this.pulseRange.pulseMax
    let temperatureMin = this.temperatureRange.temperatureMin
    let temperatureMax = this.temperatureRange.temperatureMax
    this.data = this.rawData.data.filter(item => {
      const val = this.getValue(item)
      return (val && val >= temperatureMin && val <= temperatureMax) || item.patientStatus
    })
    printRes('render_temperature', this.rawData)
    this.parent = d3.select('.axis_layout_temperatureAndPulse')
    this.axis = new Axis()

    this.axis.setAxisConfig({
      tickFormatCallback: function (d) {
        if (Math.floor(d) === d) {
          return d
        }
      },
      tickValueRange: [temperatureMin, temperatureMax, 0.2],
      domainRange: [temperatureMin, temperatureMax],
      valueRange: [this.height, 0]
    })
    this.pulseAxis = new Axis()
    this.pulseAxis.setAxisConfig({
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
  }
  renderData () {
    this.renderLine()
    this.renderPoint()
  }
  getValue (d) {
    return d.yw || d.kw || d.gw
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
      .attr('stroke', 'blue')
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
      let mby = d.ml ? this.pulseAxis.getScaleY()(d.ml) : -999
      let xly = d.xl ? this.pulseAxis.getScaleY()(d.xl) : -666
      let equal = (toFixed(y) === toFixed(mby)) || (toFixed(y) === toFixed(xly))
      if (d.yw) {
        if (equal) {
          point.draw(this.parent, 'overlap', {x, y, overlapType: 'axillaryAndHeart'})
        } else {
          point.draw(this.parent, 'axillary', {x, y})
        }
      }
      if (d.kw) {
        if (equal) {
          point.draw(this.parent, 'overlap', {x, y, overlapType: 'oralAndHeart'})
        } else {
          point.draw(this.parent, 'oral', {x, y})
        }
      }
      if (d.gw) {
        if (equal) {
          point.draw(this.parent, 'overlap', {x, y, overlapType: 'analAndHeart'})
        } else {
          point.draw(this.parent, 'anal', {x, y})
        }
      }
      if (d.pacemakerStatus && equal) {
        point.draw(this.parent, 'HIcon', {x: x, y: y - 10})
      }
    })
  }
}
