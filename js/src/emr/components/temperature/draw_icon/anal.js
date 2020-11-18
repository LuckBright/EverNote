import Circle from './circle'
export default class analTemperature {// 口温
  constructor () {
    this.baseConfig = {
      'fill': '#fff',
      'stroke': 'blue'
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'anal') {
      return true
    }
  }
  draw (root, config = {}) {
    this.circle.draw(root, config)
  }
}
