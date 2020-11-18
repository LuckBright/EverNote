import Cross from './cross'
export default class Pain {// 疼痛
  constructor () {
    this.baseConfig = {
      'fill': 'red',
      'stroke': 'red',
      'rotate': 45,
      'strokeWidth': 2,
      'skewX': 1,
      'skewY': -3
    }
    this.cross = new Cross(this.baseConfig)
  }
  support (name) {
    if (name === 'pain') {
      return true
    }
  }
  draw (root, config = {}) {
    this.cross.draw(root, config)
  }
}
