import Circle from './circle'
export default class Analgesia {// 镇痛
  constructor () {
    this.baseConfig = {
      'fill': '#fff',
      'stroke': 'red'
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'analgesia') {
      return true
    }
  }
  draw (root, config = {}) {
    this.circle.draw(root, config)
  }
}
