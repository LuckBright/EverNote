import * as d3 from 'd3'
import {Axis} from './axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import {hasNode} from '../util.js'
export class PainAxisY {
  constructor () {
    this.rawData = DataSourceSingle().painData
    this.height = this.rawData.height
    this.data = this.rawData.data
    printRes('render_axis_y_pain', this.rawData)
    this.axis = new Axis()
  }
  render () {
    let parent = d3.select('.axis_layout_pain')
    this.axis.setAxisConfig({
      tickValueRange: [0, 110 / 10, 2],
      domainRange: [-1, 11],
      valueRange: [this.height, -1]
    })
    parent
      .append('g')
      .attr('class', 'painY axis')
      .attr('transform', `translate(0,0)`)
      .call(this.axis.getAxisY())
    d3.select('.painY')
      .selectAll('g.tick')
      .select('line')
      .attr('class', 'yAxisLine')
      .attr('stroke', function () {
        return '#ccc'
      })
      .attr('stroke-width', function () {
        return 1
      })
    if (hasNode('.title_pain div.pain_box')) return false
    let tickNumberParent = d3.select('.title_pain')
      .append('div')
      .attr('class', 'pain_box')
      .style('width', '30px')
      .style('height', '100%')
      .style('position', 'absolute')
      .style('right', 0)
      .style('top', 0)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')

    tickNumberParent
      .append('g')
      .classed('tickNumber', true)
      .attr('transform', `translate(30,0)`)
      .call(this.axis.getAxisY())
  }

}
