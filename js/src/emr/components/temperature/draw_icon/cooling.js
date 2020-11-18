import Circle from './circle'
export default class Cooling {// 口温
  constructor () {
    this.baseConfig = {
      'fill': '#fff',
      'stroke': 'red'
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'cooling') {
      return true
    }
  }
  draw (root, config = {}) {
    this.circle.draw(root, config)
  }
}
