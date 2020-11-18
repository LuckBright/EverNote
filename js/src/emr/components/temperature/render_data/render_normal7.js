import * as d3 from 'd3'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
import {Axis} from '../draw_axis/axis.js'
import {modHour, formatTime} from '../util.js'
export class Normal7 {
  constructor () {
    this.data = DataSourceSingle().getData
    this.colums = DataSourceSingle().dynamicColums
    printRes('render_normal7', this.colums)
  }
  renderData () {
    // 需要是动态的
    // dynamicDataNames
    let nodes = d3.selectAll('.axis_layout').nodes()
    this.data.forEach((item, index) => {
      if (!this.colums.includes(item.nameEn)) return false
      let axis = new Axis()
      d3.select(nodes[index])
        .selectAll('text.textData')
        .data(function () {
          return item.data ? item.data.filter(item => item.value === 0 || item.value) : []
        })
        .enter()
        .append('text')
        .classed('textData', true)
        .attr('x', function (d) {
          const time = modHour(d, 0)
          return axis.getScaleX()(time) + item.width / 2
        })
        .attr('y', function () {
          return item.height / 2
        })
        .text(function (d, i) {
          if (item.nameEn === 'date') {
            if (i === 0) {
              return formatTime(d.value, d.value)
            } else {
              return formatTime(item.data[i - 1].value, d.value)
            }
          } else {
            return d.value
          }
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 12)
    })
  }
}
