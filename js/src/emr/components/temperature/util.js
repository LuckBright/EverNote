import * as d3 from 'd3'
// 获取结束时间
function getEndTime (base, days) {
  if (days === undefined || days === '') {
    days = 7
  }
  var date = new Date(base)
  date.setDate(date.getDate() + days)
  return date
}
function getConvertValue (value, min, max, height) {
  if (value === null) return
  var factor = height / (max - min)
  return (value - min) * factor
}
function setHourOfStart2 (hour) {
  if (hour >= 0 && hour < 4) {
    hour = 2
  } else if (hour >= 4 && hour < 8) {
    hour = 6
  } else if (hour >= 8 && hour < 12) {
    hour = 10
  } else if (hour >= 12 && hour < 16) {
    hour = 14
  } else if (hour >= 16 && hour < 20) {
    hour = 18
  } else if (hour >= 20 && hour < 24) {
    hour = 22
  }
  return hour
}
function setHourOfStart3 (hour) {
  if (hour < 5) {
    hour = 2
  } else if (hour >= 5 && hour < 9) {
    hour = 6
  } else if (hour >= 9 && hour < 13) {
    hour = 10
  } else if (hour >= 13 && hour < 17) {
    hour = 14
  } else if (hour >= 17 && hour < 21) {
    hour = 18
  } else if (hour >= 21) {
    hour = 22
  }
  return hour
}
function setHourOfStart4 (hour) {
  if (hour < 6) {
    hour = 2
  } else if (hour >= 6 && hour < 10) {
    hour = 6
  } else if (hour >= 10 && hour < 14) {
    hour = 10
  } else if (hour >= 14 && hour < 18) {
    hour = 14
  } else if (hour >= 18 && hour < 22) {
    hour = 18
  } else if (hour >= 22) {
    hour = 22
  }
  return hour
}
function modHour (d, h, startNum) {
  var year = new Date(d.datetime).getFullYear()
  var month = new Date(d.datetime).getMonth()
  var day = new Date(d.datetime).getDate()
  var hour = new Date(d.datetime).getHours()
  var hourConfig = {
    2: setHourOfStart2(hour),
    3: setHourOfStart3(hour),
    4: setHourOfStart4(hour)
  }
  if (startNum) {
    hour = hourConfig[startNum]
  }
  if (h || h === 0) {
    hour = h
  }
  return new Date(year, month, day, hour, 0)
}
function filterTime (type, data) { // 过滤 上午am 下午pm
  let arr = JSON.parse(JSON.stringify(data))
  let times
  function isNotNull (obj) {
    // diastolicPressure 舒张压 在后
    // systolicPressure 收缩压 在前

    if (isNaN(parseInt(obj.diastolicPressure)) || isNaN(parseInt(obj.systolicPressure))) {
      return false
    }
    return true
  }
  times = arr.filter(function (d) {
    var hour = new Date(d.datetime).getHours()
    if (type === 'am') {
      return hour < 12 && isNotNull(d.value)
    }
    if (type === 'pm') {
      return hour >= 12 && isNotNull(d.value)
    }
  })

  times.sort(function (obj1, obj2) {
    return new Date(obj1.datetime) - new Date(obj2.datetime)
  })
  return times
}
function toDou (n) {
  return n < 10 ? '0' + n : n
}
function formatTime (beginTime, time) {
  let baseDate = new Date(beginTime)
  const baseY = baseDate.getFullYear()
  const baseM = baseDate.getMonth() + 1
  const baseD = baseDate.getDate()
  const curDate = new Date(time)
  const curY = curDate.getFullYear()
  const curM = curDate.getMonth() + 1
  const curD = curDate.getDate()
  if (baseY === curY && baseM === curM && baseD === curD) {
    return curY + '-' + toDou(curM) + '-' + toDou(curD)
  } else if (baseY === curY && baseM === curM) {
    return toDou(curD)
  } else if (baseY === curY) {
    return toDou(curM) + '-' + toDou(curD)
  } else {
    return curY + '-' + toDou(curM) + '-' + toDou(curD)
  }
}
function toFixed (num) {
  return num.toFixed(4)
}
function hasNode (className) {
  let node = d3.select(className).node()
  return node
}

export {
  getEndTime,
  getConvertValue,
  filterTime,
  modHour,
  formatTime,
  toFixed,
  hasNode
}
