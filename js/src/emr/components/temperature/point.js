
import * as d3 from 'd3'
import Axillary from './draw_icon/axillary.js'
import Oral from './draw_icon/oral.js'
import Anal from './draw_icon/anal.js'
import Cooling from './draw_icon/cooling.js'
import Pulse from './draw_icon/pulse.js'
import Heart from './draw_icon/heart.js'
import Pain from './draw_icon/pain.js'
import Analgesia from './draw_icon/analgesia.js'
import Overlap from './draw_icon/overlap.js'
import Arrow from './draw_icon/arrow.js'
import HIcon from './draw_icon/h.js'
export function DrawIconTest () {
  d3.selectAll('.test-icon').insert('svg', 'p')
   .attr('width', 30)
   .attr('height', 20)
   .append('g')
   .attr('class', 'g-icon')
   .attr('transform', 'translate(0,0)')
  let nodes = d3.selectAll('g.g-icon').nodes()
  let point = new Point()
  point.draw(d3.select(nodes[0]), 'axillary', {x: 10, y: 10})
  point.draw(d3.select(nodes[1]), 'oral', {x: 10, y: 10})
  point.draw(d3.select(nodes[2]), 'anal', {x: 10, y: 10})
  point.draw(d3.select(nodes[3]), 'cooling', {x: 10, y: 10})
  point.draw(d3.select(nodes[4]), 'pulse', {x: 10, y: 10})
  point.draw(d3.select(nodes[5]), 'heart', {x: 10, y: 10})
  point.draw(d3.select(nodes[6]), 'heart', {x: 10, y: 10, peaceMaker: true})
  point.draw(d3.select(nodes[7]), 'pain', {x: 10, y: 10})
  point.draw(d3.select(nodes[8]), 'analgesia', {x: 10, y: 10})
  point.draw(d3.select(nodes[9]), 'overlap', {x: 10, y: 10, overlapType: 'axillaryAndHeart'})
  point.draw(d3.select(nodes[10]), 'overlap', {x: 10, y: 10, overlapType: 'oralAndHeart'})
  point.draw(d3.select(nodes[11]), 'overlap', {x: 10, y: 10, overlapType: 'analAndHeart'})
  point.draw(d3.select(nodes[12]), 'overlap', {x: 10, y: 10, overlapType: 'pulseAndHeart'})
  point.draw(d3.select(nodes[13]), 'overlap', {x: 10, y: 10, overlapType: 'painAndAnalgesia'})
  point.draw(d3.select(nodes[14]), 'arrow', {x: 10, y: 10})
  point.draw(d3.select(nodes[15]), 'HIcon', {x: 10, y: 10})
}
export default class Point {// 提供点的渲染，处理点交叉的逻辑
  constructor () {
    // 对象形式
    this.pointMap = {
      axillary: new Axillary(),
      oral: new Oral(),
      anal: new Anal(),
      cooling: new Cooling(),
      pulse: new Pulse(),
      heart: new Heart(),
      analgesia: new Analgesia(),
      pain: new Pain(),
      overlap: new Overlap(),
      arrow: new Arrow(),
      HIcon: new HIcon()
    }
  }
  draw (root, name, config = {}) {
    if (this.pointMap[name]) {
      this.pointMap[name].draw(root, config)
    } else {
      console.error(`不支持name为${name}绘制图标`)
    }
  }
}

/**
 * AxillaryTemperature 腋温 1
 * OralTemperature 口温 1
 * AnalTemperature 肛温 1
 * Cooling 降温 1
 * PulseRate 脉率 1
 * HeatrRate 心率 1
 * PulsePacemaker 脉搏起搏器 1
 * Pain 疼痛 1
 * Analgesia 镇痛 1
 *
 * OverLap 重叠
 * OverStandard 超标
 * 腋温与脉搏重叠
 * 口温与脉搏重叠
 * 肛温和脉搏重叠
 * 脉搏和心率重叠
 * 体温和使用心率起搏器重叠
 * 疼痛和镇痛重叠
*/
