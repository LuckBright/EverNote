import Cross from './cross'
export default class AxillaryTemperature {// 腋温
  constructor () {
    this.baseConfig = {
      'fill': 'blue',
      'stroke': 'blue',
      'rotate': 0,
      'strokeWidth': 2,
      'skewX': -3
    }
    this.cross = new Cross(this.baseConfig)
  }
  support (name) {
    if (name === 'axillary') {
      return true
    }
  }
  draw (root, config = {}) {
    this.cross.draw(root, config)
  }
}
