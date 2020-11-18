<template>
  <div id="pie_test"></div>
</template>
<script>
import * as d3 from 'd3'
let arr = [{
  population: 200,
  education: 'aaa'
}, {
  population: 400,
  education: 'bbb'
}, {
  population: 600,
  education: 'ccc'
}, {
  population: 500,
  education: 'ddd'
}]
function drawPie (arr) {
  const width = 400
  const height = 400
  let svg =
  d3.select('#pie_test').append('svg').attr('width', width).attr('height', height)
  let g = svg.append('g').attr('transform', 'translate(200,200)')
  let colors = ['red', 'green', 'yellow', 'pink']
  function generateBar (innerRadius, outerRadius, startAngle, endAngle, index, color) {
    console.log(innerRadius, outerRadius, startAngle, endAngle, index)
    let arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(startAngle)
    g.append('path').datum({endAngle: endAngle}).attr('class', 'path path' + index).attr('d', arcGenerator).style('fill', function (d, i) { return color || colors[index] })
  }
  const baseInnerRadius = 10
  const baseOuterRadius = 20
  arr.forEach((item, index) => {
    let baseNum = index * 20
    let ratio = item.population / 1000
    generateBar(baseInnerRadius + baseNum, baseOuterRadius + baseNum, 0, Math.PI * 2, index, '#ccc')
    generateBar(baseInnerRadius + baseNum, baseOuterRadius + baseNum, 0, Math.PI * 2 * ratio, index)
  })
}

export default {
  mounted () {
    drawPie(arr)
  }
}
</script>
