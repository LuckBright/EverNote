export default class Circle {
  constructor (config = {}) {
    this.baseConfig = {
      stroke: 'red',
      fill: 'none',
      strokeWidth: 1,
      text: '',
      textColor: '',
      r: 4,
      dy: 0,
      fontSize: '7px'
    }
    this.config = Object.assign(this.baseConfig, config)
  }
  setBaseConfig (config) {
    Object.assign(this.config, this.baseConfig, config)
  }
  draw (root, config) {
    // console.log(this.config,root,config)
    let x = config.x
    let y = config.y

    let wrap = root.append('g')
      .attr('class', 'circles_wrap')
      .attr('transform', 'translate(' + x + ',' + y + ')')
    wrap.append('circle')
      .attr('stroke', this.config.stroke)
      .attr('stroke-width', this.baseConfig.strokeWidth)
      .attr('fill', this.config.fill)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.config.r)
    if (this.config.text) {
      wrap
      .append('text')
      .attr('stroke', this.config.textColor)
      .attr('stroke-width', 1)
      .attr('font-size', this.config.fontSize)
      .attr('dy', this.config.dy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(() => this.config.text)
    }
  }
}
