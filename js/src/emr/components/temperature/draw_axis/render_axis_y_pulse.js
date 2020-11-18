import * as d3 from 'd3'
import {Axis} from './axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import {hasNode} from '../util.js'
export class PulseAxisY {
  constructor () {
    this.rawData = DataSourceSingle().temperatureAndPulse
    this.height = this.rawData.height
    this.pulseRange = this.rawData.pulseRange
    this.data = this.rawData.data || []
    printRes('render_axis_y_pulse', this.rawData)
  }
  render () {
    let axis = new Axis()
    axis.setAxisConfig({
      tickSizeY: 0,
      tickFormatCallback: function (d, i) {
        if (d % 20 === 0) {
          if (i === 0 && d % 20 === 0) {
            return d
          }
          return d
        }
      },
      tickValueRange: [this.pulseRange.pulseMin, this.pulseRange.pulseMax, 4],
      domainRange: [this.pulseRange.pulseMin, this.pulseRange.pulseMax],
      valueRange: [this.height, 0]

    })
    if (hasNode('.title_temperatureAndPulse div.pulse_box')) return false
    let tickNumberParent = d3.select('.title_temperatureAndPulse')
      .append('div')
      .attr('class', 'pulse_box')
      .style('width', '55px')
      .style('height', '100%')
      .style('position', 'absolute')
      .style('left', '10px')
      .style('top', 0)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    tickNumberParent
      .append('g')
      .classed('tickPulseNumber', true)
      .attr('transform', `translate(54,0)`)
      .call(axis.getAxisY())
    tickNumberParent.select('.tickPulseNumber').selectAll('.tick')
    .select('line')
    .attr('stroke', 'none')
    tickNumberParent.select('.tickPulseNumber').selectAll('.tick')
      .select('text')
      .attr('x', '-2')
      .attr('y', '-6')
    this.drawTitleText()
  }
  drawTitleText () {
    let textArr = ['脉搏', '(次/分)']
    d3.select('.pulse_box').selectAll('p')
    .data(textArr)
    .enter()
    .append('p')
    .style('margin', 0)
    .style('height', '20px')
    .style('line-height', '20px')
    .style('position', 'absolute')
    .style('left', '-6px')
    .style('top', (d, i) => {
      return `${i * 20}px`
    })
    .text((d) => d)
  }
}
