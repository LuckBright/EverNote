import * as d3 from 'd3'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import Point from '../point.js'
export class Pain {
  constructor () {
    this.rawData = DataSourceSingle().painData
    this.data = this.rawData.data.filter(dataItem => {
      return dataItem.pain
    })
    this.painLine = null
    printRes('render_pain', this.rawData)
    this.axis = new Axis()
    this.axis.setAxisConfig({
      tickValueRange: [0, 110 / 10, 2],
      domainRange: [-1, 11],
      valueRange: [100, -1]
    })
  }
  renderData () {
    this.renderLine()
    this.renderPoint()
  }
  renderLine () {
    this.painLine = d3
      .line()
      .defined(function (d) {
        return d.pain != null
      })
      .x((d) => {
        return this.axis.getScaleX()(new Date(d.datetime))
      })
      .y((d) => {
        return this.axis.getScaleY()(d.pain)//
      })
    d3.select('.axis_layout_pain')
      .append('path')
      .data(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('class', 'painLine')
      .attr('d', this.painLine(this.data))
  }
  renderPoint () {
    let parent = d3.select('.axis_layout_pain')
     // 绘制疼痛数据点
    this.data.forEach(d => {
      let point = new Point()
      let x = this.axis.getScaleX()(new Date(d.datetime))
      let y = this.axis.getScaleY()(d.pain)

      if (d.pain && d.pain === d.zt) {
        point.draw(parent, 'overlap', {x, y, overlapType: 'painAndAnalgesia'})
      } else {
        point.draw(parent, 'pain', {x, y})
      }
    })
  }
}
