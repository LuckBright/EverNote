import * as d3 from 'd3'
import {modHour} from '../util.js'
import {Axis} from '../draw_axis/axis.js'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
export class Breath {
  constructor () {
    this.rawData = DataSourceSingle().breath
    this.data = this.rawData.data
    // DataSourceSingle().getData.forEach(item => {
    //   if (item.nameEn === 'hx') {
    //     this.data = item.data || []
    //     this.startNum = item.startNum
    //   }
    // })
    printRes('render_breath', this.rawData)
  }
  renderData () {
    let axis = new Axis()
    d3.select('g.axis_layout_hx')
        .selectAll('text.textData')
        .data(this.data)
        .enter()
        .append('text')
        .attr('class', 'textData aaa')
        .attr('x', (d) => {
          const time = modHour(d, null, this.startNum)
          return axis.getScaleX()(time)
        })
        .attr('y', function (d, i) {
          if (i % 2 === 0) {
            return 10
          } else {
            return 30
          }
        })
        .text(function (d) {
          return d.value
        })
        .attr('fill', function (d) {
          if (d.value === 'R') {
            return 'blue'
          } else {
            return 'red'
          }
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10')
  }
}
