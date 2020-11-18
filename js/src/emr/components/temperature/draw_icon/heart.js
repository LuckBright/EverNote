import Circle from './circle'
export default class Heart {// 口温
  constructor () {
    this.baseConfig = {
      'fill': '#fff',
      'stroke': 'red',
      'r': 4
    }
    this.circle = new Circle(this.baseConfig)
  }
  support (name) {
    if (name === 'heart') {
      return true
    }
  }
  draw (root, config = {}) {
    if (config.peaceMaker) {
      this.circle.setBaseConfig({
        text: 'H',
        textColor: 'red'
      })
    }
    this.circle.draw(root, config)
  }
}
