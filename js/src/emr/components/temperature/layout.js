import * as d3 from 'd3'
import {DataSourceSingle, printRes} from './datasource_adapter.js'
export class Layout {
  constructor () {
    this.wrap = null
    this.titleWrap = null
    this.row = null
    this.colums = null
    this.data = DataSourceSingle().getData
    printRes('layout', this.data)
    this.createWrap()
    this.createRowDiv()
  }
  createWrap () {
    this.titleWrapDiv = d3
      .select('.left_title_div')
  }
  createRowDiv () {
    this.row = this.titleWrapDiv
      .selectAll('div')
      .data(() => {
        return this.data.filter(item => item.show)
      })
      .enter()
      .append('div')
      .attr('class', (d) => {
        return `title_${d.nameEn} title`
      })
      .style('height', function (d) {
        return `${d.height}px`
      })
      .style('width', '100%')
      .style('border-bottom', '1px solid #000')
      .style('box-sizing', 'border-box')
      .style('line-height', function (d) {
        return `${d.height}px`
      })
      .style('font-size', '14px')
      .style('padding-left', '20px')
      .style('position', 'relative')
      .text(function (d) {
        if (d.nameEn === 'temperatureAndPulse') {
          return
        } else {
          return d.nameCn
        }
      })
  }
  createColum () {

  }
}
