import * as d3 from 'd3'
import {Axis} from './axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import {hasNode} from '../util.js'
export class TemperatureAxisY {
  render () {
    let axis = new Axis()
    let parent = d3.select('.axis_layout_temperatureAndPulse')
    this.rowData = DataSourceSingle().temperatureAndPulse
    this.data = this.rowData.data || []
    this.height = this.rowData.height
    this.temperatureRange = this.rowData.temperatureRange

    printRes('render_axis_y_temperature', this.rowData)
    let min = this.temperatureRange.temperatureMin
    let max = this.temperatureRange.temperatureMax
    axis.setAxisConfig({
      tickFormatCallback: function (d, i) {
        // return d
        if (Math.floor(d) === d) {
          if (i === 0 && Math.floor(d) === d) {
            return d
          }
          return d
        }
      },
      tickValueRange: [min, max, 0.2],
      domainRange: [min, max],
      valueRange: [this.height, 0]
    })
    parent
      .append('g')
      .attr('class', 'temperatureY axisY')
      .attr('transform', `translate(0,0)`)
      .call(axis.getAxisY())
    d3.select('.temperatureY')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'yAxisLine')
      .attr('stroke', function (d) {
        if (Math.floor(d) === d || d === max) {
          return '#000'
        } else {
          return '#ccc'
        }
      })
      .attr('stroke-width', function (d) {
        if (Math.floor(d) === d) {
          return 2
        } else {
          return 1
        }
      })
    if (hasNode('.title_temperatureAndPulse div.temperature_box')) return false
    let tickNumberParent = d3.select('.title_temperatureAndPulse')
      .append('div')
      .style('width', '55px')
      .style('height', '100%')
      .attr('class', 'temperature_box')
      .style('position', 'absolute')
      .style('right', '5px')
      .style('top', 0)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    tickNumberParent
      .append('g')
      .classed('tickTemperatureNumber', true)
      .attr('transform', `translate(56,-5)`)
      .call(axis.getAxisY())
    tickNumberParent.select('.tickTemperatureNumber').selectAll('.tick')
    .select('line')
    .attr('stroke', 'none')
    tickNumberParent.select('.tickTemperatureNumber').select('path')
    .attr('stroke', 'none')
    this.drawTitleText()
  }
  drawTitleText () {
    let textArr = ['体温', '(°C)']
    d3.select('.temperature_box').selectAll('p')
    .data(textArr)
    .enter()
    .append('p')
    .style('margin', 0)
    .style('height', '20px')
    .style('line-height', '20px')
    .style('position', 'absolute')
    .style('left', '10px')
    .style('top', (d, i) => {
      return `${i * 20}px`
    })
    .text((d) => d)
  }
}
