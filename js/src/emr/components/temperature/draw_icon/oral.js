import Circle from './circle'
export default class OralTemperature {// 口温
  constructor () {
    this.baseConfig = {
      'fill': 'blue',
      'stroke': 'blue'
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'oral') {
      return true
    }
  }
  draw (root, config = {}) {
    this.circle.draw(root, config)
  }
}
