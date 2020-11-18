export default function circle (el, forecolor, percent, lineWidth = 10, globalAlpha = 1, liner) {
  if (percent <= 0) return
  const context = el.getContext('2d')
  const x = el.width / 2
  const y = el.height / 2
  const rad = Math.PI * 2 / 100
  context.save()
  let linearGradient
  if (liner) {
    const {diameter, startColor, endColor} = liner
    linearGradient = context.createLinearGradient(diameter / 2, 0, 0, diameter)
    linearGradient.addColorStop(0, startColor)
    linearGradient.addColorStop(0.8, startColor)
    linearGradient.addColorStop(1, endColor)
  }
  context.strokeStyle = liner ? linearGradient : forecolor
  context.globalAlpha = globalAlpha
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  var radius = x - context.lineWidth
  context.beginPath()
  context.arc(
    x,
    y,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + percent * rad,
    false
  )
  context.stroke()
  context.closePath()
  context.restore()
}
