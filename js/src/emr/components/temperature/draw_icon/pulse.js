import Circle from './circle'
export default class Pulse {// 脉搏
  constructor () {
    this.baseConfig = {
      'fill': 'red',
      'stroke': 'red',
      'r': 4
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'pulse') {
      return true
    }
  }
  draw (root, config = {}) {
    this.circle.draw(root, config)
  }
}
