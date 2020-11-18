import Cross from './cross'
import Circle from './circle'
export default class Overlap {// 腋温，口温,肛温分别与脉搏重叠
  constructor () {
    this.baseConfig = {
      dy: 1
    }
    this.cross = new Cross()
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'overlap') {
      return true
    }
  }
  draw (root, config) {
    if (config.overlapType) {
      this[config.overlapType](root, config)
    } else {
      console.error(`不存在${config.overlapType}的交互图标`)
    }
  }
  axillaryAndHeart (root, config) { // 蓝× 红圈
    let cross = new Cross()
    let circle = new Circle()
    cross.setBaseConfig({
      skewX: -2,
      skewY: -2
    })
    circle.setBaseConfig({
      fill: '#fff'
    })

    circle.draw(root, config)
    cross.draw(root, config)
  }
  oralAndHeart (root, config) { // 蓝点红圈
    let circle = new Circle()
    circle.setBaseConfig({
      text: '·',
      textColor: 'blue',
      fontSize: '14px',
      dy: 1,
      fill: '#fff'
    })
    circle.draw(root, config)
  }
  analAndHeart (root, config) { // 红点蓝圈
    let circle = new Circle()
    circle.setBaseConfig({
      text: '·',
      textColor: 'red',
      stroke: 'blue',
      fontSize: '14px',
      dy: 1,
      fill: '#fff'
    })
    circle.draw(root, config)
  }
  pulseAndHeart (root, config) { // 红点红圈
    this.circle.setBaseConfig({
      stroke: 'red',
      text: '·',
      fill: '#fff',
      textColor: 'red',
      fontSize: '14px'
    })
    this.circle.draw(root, config)
  }
  painAndAnalgesia (root, config) { // 红叉红圈
    let cross = new Cross()
    let circle = new Circle()
    cross.setBaseConfig({
      rotate: 45,
      stroke: 'red',
      skewY: -4
    })
    circle.setBaseConfig({
      fill: '#fff'
    })
    circle.draw(root, config)
    cross.draw(root, config)
  }
}
