import * as d3 from 'd3'
import {DataSourceSingle, printRes} from '../datasource_adapter.js'
export class TimeBar {
  constructor () {
    this.timeAxisData = []
    this.data = []
    this.createTime(DataSourceSingle().timeBarType || 'start2of24')
    // DataSourceSingle().getData.forEach(item => {
    //   if (item.nameEn === 'time') {
    //     this.createTime(item.timeBarType || 'start2of24')
    //   }
    // })
    printRes('render_time_bar', DataSourceSingle().timeBarType)
  }
  renderData () {
    let width = 570
    let height = 20
    let timeBar = d3
      .select('g.axis_layout_time')
      .selectAll('g.time_bar')
      .data(this.timeAxisData)
      .enter()
      .append('g')
      .attr('class', 'time_bar')
      .attr('width', width / 42)
      .attr('height', height)
      .attr('transform', function (d, i) {
        const move = i * width / 42 - 2
        return 'translate(' + move + ',0)'
      })
    timeBar
      .append('text')
      .attr('x', width / 42 / 2)
      .attr('y', height / 2)
      .attr('fill', function (d, i) {
        const baseNum = i % 6
        if (baseNum === 0 || baseNum === 4 || baseNum === 5) {
          return 'red'
        }
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10')
      .text(function (d) {
        return d
      })
  }
  createTime (type) {
    for (var i = 1; i <= 7; i++) {
      for (var j = 1; j <= 6; j++) {
        switch (type) {
          case 'start2of24':
            this.timeAxisData.push(j * 4 - 2)
            break
          case 'start2of12':
            if (j > 3) {
              this.timeAxisData.push((j % 4 + 1) * 4 - 2)
            } else {
              this.timeAxisData.push(j * 4 - 2)
            }
            break
          case 'start3of24':
            this.timeAxisData.push(j * 4 - 1)
            break
          case 'start3of12':
            if (j > 3) {
              this.timeAxisData.push((j % 4 + 1) * 4 - 1)
            } else {
              this.timeAxisData.push(j * 4 - 1)
            }
            break
          case 'start4of24':
            this.timeAxisData.push(j * 4)
            break
          case 'start4of12':
            if (j > 3) {
              this.timeAxisData.push((j % 4 + 1) * 4)
            } else {
              this.timeAxisData.push(j * 4)
            }
            break
        }
      }
    }
  }
}
// 另外一种算法
// function getNumber(num,start){
//   // num 指的是 24小时 ，还是 12小时制的
//   // start 从几点开始
//   const timeAxisData = []
//   if(num==12){
//     for (var i = 1; i <= 7; i++) {
//       for (var j = 0; j < 3; j++) {
//       timeAxisData.push(start + j * 4 )
//       }
//       for (var j = 0; j < 3; j++) {
//       timeAxisData.push(start + j * 4 )
//       }
//     }
//   }
//   console.log(timeAxisData,'dada')
// }
// getNumber(12,3)
