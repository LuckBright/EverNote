// import xlData from './data/xl.json'
// import mbData from './data/mb.json'

/**
 * @method parseRePoint 解析是否存在重合的坐标点，若有请假事件，则将其分组，获取脉搏短促多边形
 * @param {JSON} pointData 时间录入信息
 * @param {String} curDate 当前时间
 * @return
 */
export function parseRePoint (mbData, xlData) {
    // 绘制点、折线、脉搏短促
  let pointArray = []
  let mb = mergeArr(mbData)
  let xl = mergeArr(xlData)
    // 根据心率和脉搏点，绘制多边形（脉搏短促）
    // 统计出现的多边形
  let polygonArray = getPolygon(mb, xl)
    // 绘制多边形
  for (let i = 0; i < polygonArray.length; i++) {
    let polygon = polygonArray[i]
    pointArray.push(drawRedLine(polygon))
  }
  return pointArray
}

/**
 * @method getPolygon 获取多边形
 * @param {Array} mbPoints 脉搏点
 * @param {Array} xlPoints 心率点
 * 脉搏短绌即在同一单位时间内，脉率少于心率
 */
function getPolygon (mbPoints, xlPoints) {
  let polygonArray = []
  let intersectionArray = [] // 缓存交点数组
  for (let i = 0; i < mbPoints.length; i++) {
    intersectionArray[i] = []
    let mbArray = mbPoints[i]
    let xlArray = xlPoints[i]
        // 如果不存在脉搏大于心率的点则不绘制多边形
    if (mbArray.length === 0 || xlArray.length === 0) {
      return polygonArray
    }
    for (let j = 0; j < mbArray.length; j++) {
      let curMbX = getParseFloat(mbArray[j].x, 4)
      let curMbY = getParseFloat(mbArray[j].y, 4)
      if (mbArray[j + 1] !== undefined) {
        let nextMbX = getParseFloat(mbArray[j + 1].x, 4)
        let nextMbY = getParseFloat(mbArray[j + 1].y, 4)
        let line1 = lineX({'x': curMbX, 'y': curMbY}, {'x': nextMbX, 'y': nextMbY})
        for (let h = 0; h < xlArray.length; h++) {
          let curXlX = getParseFloat(xlArray[h].x, 4)
          let curXlY = getParseFloat(xlArray[h].y, 4)
          if (xlArray[h + 1] !== undefined) {
            let nextXlX = getParseFloat(xlArray[h + 1].x, 4)
            let nextXlY = getParseFloat(xlArray[h + 1].y, 4)
            let line2 = lineX({'x': curXlX, 'y': curXlY}, {'x': nextXlX, 'y': nextXlY})
            let interX = segmentsIntr(line1, line2).x
            let interY = segmentsIntr(line1, line2).y
                        // 交点在心率线段上
            // if (h === xlArray.length - 2 && j === xlArray.length - 2) {
            //                 // console.log(segmentsIntr(line1,line2))
            // }
            let xlBool = interX >= curXlX && interX <= nextXlX && (interY >= curXlY && interY <= nextXlY || interY <= curXlY && interY >= nextXlY)
                        // 交点在脉搏线段上
            let mbBool = interX >= curMbX && interX <= nextMbX && (interY >= curMbY && interY <= nextMbY || interY <= curMbY && interY >= nextMbY)
            if (xlBool && mbBool) {
              intersectionArray[i].push(segmentsIntr(line1, line2))
            }
          }
        }
      }
    }
  }
    // 根据交点计算多边形
  for (let i = 0; i < intersectionArray.length; i++) {
    let interArray = intersectionArray[i]
    let xlPoint = xlPoints[i]
    let mbPoint = mbPoints[i]
    if (interArray.length === 0) { // 不存在交点
            // 判断是否所有脉搏小于心率的点,按x坐标分组
      let coor = {}
      for (let j = 0; j < xlPoint.length; j++) {
        let x = xlPoint[j].x
        let y = xlPoint[j].y
        coor[x] = coor[x] || []
        coor[x]['xl'] = y
      }
      for (let j = 0; j < mbPoint.length; j++) {
        let x = mbPoint[j].x
        let y = mbPoint[j].y
        coor[x] = coor[x] || []
        coor[x]['mb'] = y
      }
      let isMore = true
      for (let j in coor) {
        if (coor[j].xl && coor[j].mb) {
          if (coor[j].xl > coor[j].mb) {
            isMore = false
            break
          }
        }
      }
      if (isMore) { // 存在脉搏短促
        let newXlpoint = xlPoint
        let newMbpoint = mbPoint
        let newPoint
        newXlpoint.reverse()
        newPoint = newMbpoint.concat(newXlpoint)
        newPoint.push(newMbpoint[0])
        polygonArray.push(newPoint)
      }
    }
        // 存在交点，绘制交点前的多边形
        // console.log(intersectionArray)
    if (interArray.length > 0 && mbPoint.length > 0) {
            // 获取第一个交点前脉搏、心率点
      let mbArray = []
      let xlArray = []
      let firstInter = interArray[0]
      let firstInterX = interArray[0].x
      for (let k = 0; k < mbPoint.length; k++) {
        let moreX = mbPoint[k].x
        if (moreX <= firstInterX) {
          mbArray.push(mbPoint[k])
        }
      }
      for (let k = 0; k < xlPoint.length; k++) {
        let moreX = xlPoint[k].x
        if (moreX <= firstInterX) {
          xlArray.push(xlPoint[k])
        }
      }
      if (mbArray.length > 0 || xlArray.length > 0) {
        mbArray.push(firstInter)
        xlArray.reverse()
        mbArray = mbArray.concat(xlArray)
        mbArray.push(mbArray[0])
        polygonArray.push(mbArray)
      }
    }
        // 存在多个交点
    for (let f = 0; f < interArray.length; f++) {
      if (interArray[f] && interArray[f + 1] !== undefined) {
        let enterX = interArray[f].x
        let enterNextX = interArray[f + 1].x
        let morePointArray = [] // 保存相邻的两个 交点（心率）
        let lessPointArray = [] // 保存相邻的两个 交点（脉搏）
        for (let j = 0; j < mbPoint.length; j++) {
          let moreX = mbPoint[j].x
          if (moreX >= enterX && moreX <= enterNextX) {
            morePointArray.push(mbPoint[j])
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          let moreX = xlPoint[j].x
          if (moreX >= enterX && moreX <= enterNextX) {
            lessPointArray.push(xlPoint[j])
          }
        }
        if (morePointArray.length > 0) { // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f])
          lessPointArray.reverse()
          morePointArray.push(interArray[f + 1])
          morePointArray = morePointArray.concat(lessPointArray)
          morePointArray.push(interArray[f])
          polygonArray.push(morePointArray)
        }
      } else if (interArray[f] && interArray[f + 1] === undefined) {
                // 获取最后的节点
        let morePointArray = [] // 保存相邻的两个 交点（心率）
        let lessPointArray = [] // 保存相邻的两个 交点（脉搏）
        let enterX = interArray[f].x
        for (let j = 0; j < mbPoint.length; j++) {
          let moreX = mbPoint[j].x
          if (moreX > enterX) {
            morePointArray.push(mbPoint[j])
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          let moreX = xlPoint[j].x
          if (moreX > enterX) {
            lessPointArray.push(xlPoint[j])
          }
        }
        if (morePointArray.length > 0 && lessPointArray.length > 0) { // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f])
          lessPointArray.reverse()
          morePointArray = morePointArray.concat(lessPointArray)
          morePointArray.push(interArray[f])
          polygonArray.push(morePointArray)
        }
      }
    }
  }
  return polygonArray || []
}

/**
 * @method getParseFloat 将浮点数保留多少位小数
 * @param {String/Float} number 数字
 * @param {String/Float} sub 保留多少位小数
 */
function getParseFloat (number, sub) {
  return parseFloat(parseFloat(number).toFixed(sub))
}

/**
 * @method drawPolygon 绘制多边形
 * @param {Array} points 多边形的点[{"x":x,"y":y},{"x":x,"y":y}]
 * @param {String} color 多边形颜色
 * @param {String/Number} key react数组key值（唯一）
 * @return {JSON} polygonLinear 多边形边的二元一次方程的数组；polygonHtml 多边形显示组件；point多边形的点的数组
 */
function drawPolygon (points, color) {
  if (points.length === 0) {
    return ''
  }
  color = color || '#000'
  let polygonLinear = []
  let pointStr
  let pointStrArray = []
  let point = []
  for (let i = 0; i < points.length; i++) {
    pointStr = points[i].x + ',' + points[i].y
        // 根据两点求方程
    if (points[i + 1] !== undefined) {
      let linear = lineX(points[i], points[i + 1])
      polygonLinear.push(linear)
      point.push([points[i], points[i + 1]])
    }
    pointStrArray.push(pointStr)
  }
  pointStr = pointStrArray.join(' ')
  let polygonHtml = ` <polygon key=${Math.random()} points="${pointStr}" fill="none" stroke="${color}" stroke-width="1"/>`
  return {
    'html': polygonHtml,
    'linear': polygonLinear,
    'point': point
  }
}

/**
 * @method lineX 根据两点求二元一次方程
 * @param {JSON} point1 点1{x:"",y:""}
 * @param {JSON} point2 点2{x:"",y:""}
 * @return {JSON} a为常数，b为系数, 返回x为垂直于x轴的直线，返回Y为垂直于y轴的直线
 * */
function lineX (point1, point2) {
  let x1 = point1.x
  let x2 = point2.x
  let y1 = point1.y
  let y2 = point2.y
  if (x2 - x1 === 0) {
    return {x: x1}
  }
    /* if(y1 - y2 === 0){
     return {y : y1}
     } */
    // 求系数
  let b = (y2 - y1) / (x2 - x1)
    // 求常数
  let a = y1 - b * x1
  return {
    a: a,
    b: b
  }
}

/**
 * @method segmentsIntr  求二元一次方程的交点
 * @param {JSON} line1 线条1方程
 * @param {JSON} line2 线条2方程
 * @return 交点
 * */
function segmentsIntr (line1, line2) {
  let a1 = line1.a
  let a2 = line2.a
  let b1 = line1.b
  let b2 = line2.b
  let x, y
  if (a2 === undefined || b2 === undefined) {
    x = line2.x
    y = a1 + b1 * x
  } else {
    x = (a1 - a2) / (b2 - b1)
    y = a1 + b1 * x
  }
  x = parseFloat(parseFloat(x).toFixed(4))
  y = parseFloat(parseFloat(y).toFixed(4))
  return {
    x: x,
    y: y
  }
}

/**
 * @method getDoundary 计算边界
 * @param point
 * @returns {{maxX: Number, minX: Number, maxY: Number, minY: Number}}
 */

function getDoundary (point) {
  let maxX = +point[0].x
  let minX = +point[0].x
  let maxY = +point[0].y
  let minY = +point[0].y
  for (let i = 0; i < point.length; i++) {
    let pointX = +point[i].x
    let pointY = +point[i].y
    if (pointX > maxX) {
      maxX = pointX
    }
    if (pointX < minX) {
      minX = pointX
    }
    if (pointY > maxY) {
      maxY = pointY
    }
    if (pointY < minY) {
      minY = pointY
    }
  }
  return {
    maxX: parseFloat(parseFloat(maxX).toFixed(4)),
    minX: parseFloat(parseFloat(minX).toFixed(4)),
    maxY: parseFloat(parseFloat(maxY).toFixed(4)),
    minY: parseFloat(parseFloat(minY).toFixed(4))
  }
}

/**
 * @getBlueLineFuncs 获取蓝斜线方法
 * @param {Number/Float} b 斜度
 * @returns {Array}
 */
function getBlueLineFuncs (b) {
  b = b || -4
  let blueLineFuncs = []
    // 计算蓝斜线可能显示的最大区域，即根据系数，计算常数的最小值，和最大值
  let svgW = 15 * 42
  let svgH = 15 * 55
    // let disI = parseInt(b) * 3;
  if (b < 0) {
    let a1 = 0
    let a2 = svgH - b * svgW
    for (let i = a1; i < a2; i = i + 16) { //
      blueLineFuncs.push({a: i, b: b})
    }
  } else {
    let a1 = -(svgW / b)
    let a2 = svgH
    for (let i = a1; i < a2; i = i + 16) {
      blueLineFuncs.push({a: i, b: b})
    }
  }
  return blueLineFuncs
}

/**
 * @method drawRedLine 绘制红斜线
 * @param {Array} polygonArray 多边形点的数组集合
 * @param {String/Number} key react数组的key值
 * @return
 */
function drawRedLine (polygonArray) {
  let htmlArray = []
  let polygonline = drawPolygon(polygonArray, 'red').linear
  let htmlde = drawPolygon(polygonArray, 'red', 'polygon').html
  let point = drawPolygon(polygonArray, 'red').point
  let totalPoints = []
  let blueLineFuncs = getBlueLineFuncs()
  for (let i = 0; i < blueLineFuncs.length; i++) {
    let pointArray = []
    for (let j = 0; j < polygonline.length; j++) {
      let pointNow = point[j]
      let maxX = getDoundary(pointNow).maxX
      let minX = getDoundary(pointNow).minX
      let maxY = getDoundary(pointNow).maxY
      let minY = getDoundary(pointNow).minY
            // 一条边与斜线的交点
            // 计算交点
      let line1 = blueLineFuncs[i]
      let line2 = polygonline[j]
      let points = segmentsIntr(line1, line2)
            // 判断交点是否在线段上，即在多边形内
            // console.log(minX+"~"+maxX+"~"+minY+"~"+maxY)
      if (points.x >= minX && points.x <= maxX && points.y >= minY && points.y <= maxY) {
        pointArray.push(points)
      }
    }
    if (pointArray.length) {
      totalPoints.push(pointArray)
    }
  }
  for (let j = 0; j < totalPoints.length; j++) {
    let points = totalPoints[j]
    if (points.length === 2) {
      htmlArray.push(`<line key="${Math.random()}points" x1="${points[0].x}" y1="${points[0].y}" x2="${points[1].x}" y2="${points[1].y}"
                             stroke="red" stroke-width="1"/>`)
    } else if (points.length > 2 && points.length % 2 === 0) {
            // 根据x值大小排序（升序）冒泡排序
      for (let i = 0; i < points.length - 1; i++) { // 取数组中任意两点匹配
        for (let k = 0; k < points.length - 1 - i; k++) {
          let pointX = points[k].x
          let nextPointX = points[k + 1].x
          if (pointX > nextPointX) {
            let temp = points[k]
            points[k] = points[k + 1]
            points[k + 1] = temp
          }
        }
      }
            // 相邻两点生成一条线段
      for (let i = 0; i < points.length; i = i + 2) {
        htmlArray.push(`<line key="xiangling${i}" x1="${points[i].x}" y1="${points[i].y}" x2="${points[i + 1].x}"
                                     y2="${points[i + 1].y}" stroke="red" stroke-width="1"/>`)
      }
    }
  }
  htmlArray.push(htmlde)
  return htmlArray
}
/**
 * 1，过滤掉心率起搏器的点
 * 2，如果有心率起搏器就对数组进行分割
 * 3，返回分割后的子数组集合
*/
export function mergeArr (arr) {
  let store = []
  let res = []
  arr.map(item => {
    // store.push(item)//不过滤心率起搏器
    if (!item.pacemakerStatus) {
      store.push(item)
    } else {
      res.push(store)
      store = []
    }
  })
  if (store.length > 0) {
    res.push(store)
  }
  return res
}
