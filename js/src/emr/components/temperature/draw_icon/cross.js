export default class Cross {// 腋温
  constructor (config = {}) {
    this.baseConfig = {
      'strokeWidth': 1,
      'stroke': 'blue'
    }
    this.config = Object.assign(this.baseConfig, config)
  }
  setBaseConfig (config) {
    Object.assign(this.config, this.baseConfig, config)
  }
  draw (root, config = {}) {
    // console.log('crosss',config)
    let skewY = this.config.skewY || 0
    let skewX = this.config.skewX || 0
    let x = config.x + skewX
    let y = config.y + skewY

    var cross = root
      .append('g')
      .attr('class', 'cross')
      .attr('stroke', this.config.stroke)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', this.config.strokeWidth)
      .attr('transform', `translate(${x},${y}) scale(1.2) rotate(${this.config.rotate || 0})`)
    var pointy = 4
    cross.html(`
      <line x1="0" y1="0" x2="${pointy}" y2="${pointy}"></line>
      <line x1="${pointy}" y1="0" x2="0" y2="${pointy}"></line>
    `)
  }
}
