export default class HIcon {
  draw (root, config = {}) {
    let {x, y} = config
    let wrap = root
    .append('g')
    .attr('class', 'circles_wrap')
    .attr('transform', 'translate(' + x + ',' + y + ')')
    wrap
      .append('text')
      .attr('stroke', 'red')
      .attr('fill', 'red')
      .attr('stroke-width', 1)
      .attr('font-size', '8px')
      .attr('dy', 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(function () {
        return 'H'
      })
  }
}
