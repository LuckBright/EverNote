import * as d3 from 'd3'
import phrapi from '@/inpatient/store/phr'
const BMI = 'BMI'
const HEIGHT = 'HEIGHT'
const WEIGHT = 'WEIGHT'
const HEAD = 'HEAD'
const days = 30.4375
const month3 = 91
const month6 = 183
const month24 = 731
const month60 = 1856
const domain = {
  'WHO': {
    'HEIGHT': {
      'sixMonths': [45, 73],
      'twoYears': [45, 95],
      'fiveYears': [43, 122]
    },
    'WEIGHT': {
      'sixMonths': [1.7, 10.3],
      'twoYears': [1.7, 15.3],
      'fiveYears': [1, 25]
    },
    'HEAD': {
      'thirteenWeek': [31, 43.5],
      'twoYears': [31, 52],
      'fiveYears': [31, 54.5]
    },
    'BMI': {
      'twoYears': [9.6, 21.4],
      'fiveYears': [9.6, 21.4]
    }
  },
  'CDC': {
    'HEIGHT': {
      'threeYears': [40, 110],
      'eighteenYears': [70, 205]
    },
    'WEIGHT': {
      'threeYears': [1.4, 19],
      'eighteenYears': [5, 106]
    },
    'HEAD': {
      'thirteenWeek': [29, 58]
    },
    'BMI': {
      'eighteenYears': [10, 37]
    }
  }
}

const axisName = {
  'HEIGHT': {
    'xName': '年龄',
    'yName': '身高（cm）'
  },
  'WEIGHT': {
    'xName': '年龄',
    'yName': '体重(kg)'
  },
  'HEAD': {
    'xName': '年龄',
    'yName': '头围（cm）'
  },
  'BMI': {
    'xName': '年龄',
    'yName': 'BMI（kg/m²）'
  }
}
function _getDomainName (chartType, signType, age) {
  let domainName = ''
  if (chartType === 'WHO') {
      // 身高和体重
    if (signType === HEIGHT || signType === WEIGHT) {
      if (age <= month6) {
        domainName = 'sixMonths'
      } else if (age <= month24) {
        domainName = 'twoYears'
      } else if (age <= month60) {
        domainName = 'fiveYears'
      }
    }
      // 头围
    if (signType === HEAD) {
      if (age <= month3) {
        domainName = 'thirteenWeek'
      } else if (age <= month24) {
        domainName = 'twoYears'
      } else if (age <= month60) {
        domainName = 'fiveYears'
      }
    }
    if (signType === BMI) {
      if (age <= month24) {
        domainName = 'twoYears'
      } else if (age <= month60) {
        domainName = 'fiveYears'
      }
    }
  } else {
    if (signType === HEIGHT || signType === WEIGHT) {
      if (age < 36) {
        domainName = 'threeYears'
      } else if (age > 24 && age <= 240) {
        domainName = 'eighteenYears'
      }
    }
    if (signType === HEAD) {
      if (age < 36) {
        domainName = 'thirteenWeek'
      }
    }
    if (signType === BMI) {
      if (age >= 24 && age <= 240) {
        domainName = 'eighteenYears'
      }
    }
  }
  return domainName
}
function getDomain (chartType, signType, age) {
  let key = _getDomainName(chartType, signType, age)
  return domain[chartType][signType][key]
}
function getAxisName (signType, axisType) {
  return axisName[signType][axisType]
}
function getTextConfig (signType, age, chartType) {
  let textConfig = {}
  if (chartType === 'WHO') {
    if ((signType === HEIGHT || signType === WEIGHT) && age <= month6) {
      textConfig = {
        up: '周',
        down: '月',
        strokeLine: '#000'
      }
    } else if (signType === HEAD && age <= month3) {
      textConfig = {
        up: '周',
        down: '',
        strokeLine: 'none'
      }
    } else {
      textConfig = {
        up: '月',
        down: '',
        strokeLine: 'none'
      }
    }
  } else {
    if (age <= 36 && (signType === HEIGHT || signType === WEIGHT || signType === HEAD)) {
      textConfig = {
        up: '月',
        down: '',
        strokeLine: 'none'
      }
    } else if (age >= 24 && signType === BMI) {
      textConfig = {
        up: '岁',
        down: '',
        strokeLine: 'none'
      }
    } else if (age > 36 && (signType === HEIGHT || signType === WEIGHT)) {
      textConfig = {
        up: '岁',
        down: '',
        strokeLine: 'none'
      }
    }
  }

  return textConfig
}
// let monthSet = new Set()
function operateData (age, signType, data, operation, monthSet, chartType) {
  if (chartType === 'WHO') {
  // let data = Number(dataSource.date)
    if (age <= month3 && signType === HEAD) {
      // console.log('适用于WHO头围0-13周')
      if (operation === 'filter') return _weekFormat()
      return _week()
    }
    if (age <= month6 && (signType === HEIGHT || signType === WEIGHT)) {
      // console.log('适用于WHO身高年龄，体重年龄0-6个月')
      if (operation === 'filter') return _upWeekDownMonthFormat()
      return _upWeekDownMonth()
    }
    if (age <= month24 && (signType === BMI || signType === HEIGHT || signType === WEIGHT)) {
      // console.log('使用于WHO身高年龄0-2岁，体重年龄0-2岁，BMI0-2岁')
      if (operation === 'filter') return _upMonthDownYearAllFormat()
      return _upMonthDownYearAll()
    }
    if (age <= month60 && (signType === BMI || signType === HEIGHT || signType === WEIGHT || signType === HEAD)) {
      // console.log('使用于WHO身高年龄0-5岁，体重年龄0-5岁，头围0-2岁，头围0-5岁，BMI0-5岁')
      if (operation === 'filter') return _upMonthDownYearEvenFormat()
      return _upMonthDownYearEven()
    }
  } else if (chartType === 'CDC') {
    if (age <= 36 && signType !== BMI) {
      // console.log('适用于CDC0到36个月的身高，体重，头围')
      if (operation === 'filter') return _cdcWeekFormat()
      return _month()
    } else if (age > 24 && age <= 240 && signType !== HEAD) {
      // console.log('适用于CDC2到20岁的身高，体重，BMI')
      if (operation === 'filter') return _cdcYearFormat()
      return _year()
    }
  }
  function _year () {
    if (data % 6 === 0) { return true }
  }
  function _cdcYearFormat () {
    // console.log(data, 'data')
    if (data % 12 === 0) {
      return data / 12
    }
  }
  function _month () {
    return true
  }
  // 只显示周
  function _week () {
    return true
  }
  function _cdcWeekFormat () {
    if (data % 3 === 0) {
      if (data === 0) return '生日'
      return data
    }
  }
  function _weekFormat () {
    if (data % 7 === 0) {
      return data / 7
    }
  }
  // 上周下月
  function _upWeekDownMonth () {
    if (data <= days * 3) {
      return data % 7 === 0
    }
    if (data >= days * 3) {
      let month = Math.floor(data / days)
      if (!monthSet.has(month)) {
        monthSet.add(month)
        return true
      } else {
        return false
      }
    }
  }
  function _upWeekDownMonthFormat () {
    let week = 7
    if (data <= days * 3) {
      return data / week
    }
    if (data > days * 3) {
      let month = Math.floor(data / days)
      return month % 12
    }
  }
  // 上月下年全显示
  function _upMonthDownYearAll () {
    let month = Math.floor(data / days)
    if (!monthSet.has(month)) {
      monthSet.add(month)
      return true
    }
  }
  function _upMonthDownYearAllFormat () {
    let month = Math.floor(data / days)
    return month % 12
  }
  // 上月下年显示偶数月
  function _upMonthDownYearEven () {
    if (signType !== HEAD && age <= 24) return false
    let month = Math.floor(data / days)
    if (!monthSet.has(month)) {
      monthSet.add(month)
      return true
    }
  }
  function _upMonthDownYearEvenFormat () {
    if (signType !== HEAD && age <= 24) return false
    let month = Math.floor(data / days)
    if (month % 2 === 0) {
      return month % 12
    }
  }
}
function showUpDown (age, signType, parent, chartType) {
  if (chartType === 'WHO') {
    if (age <= month6 && (signType === HEIGHT || signType === WEIGHT)) {
      formatMonthAxis(parent)
    } else if (age <= month24 && (signType === BMI || signType === HEIGHT || signType === WEIGHT)) {
      formatYearAxis(parent)
    } else if (signType === HEAD && age <= month3) {
      return false
    } else if (age <= month60 && (signType === BMI || signType === HEIGHT || signType === WEIGHT || signType === HEAD)) {
      if ((signType === HEIGHT || signType === WEIGHT) && age <= 6) return false
      return formatYearAxis(parent)
    }
  } else if (chartType === 'CDC') {
    if (age <= 36 && signType === HEIGHT) {
      return true
    }
  }
}
function creatData (age, signType, chartType) {
  let data = []
  let days = 30.4375
  let max = 0
  let start = 0
  if (chartType === 'WHO') {
    if (age <= month3 && signType === HEAD) {
      max = days * 3
    }
    if (age > month3 && age <= month24 && signType === HEAD) {
      max = days * 24 + 1
    }
    if (age <= month24 && (signType === BMI || signType === HEIGHT || signType === WEIGHT)) {
      max = days * 24 + 1
    }
    if (age > month24 && age <= month60) {
      max = 1856 // days * 60
    }
    if (age <= month6 && (signType === HEIGHT || signType === WEIGHT)) {
      max = days * 6 + 2
    }
  } else if (chartType === 'CDC') {
    if (age <= 36 && (signType === HEIGHT || signType === WEIGHT || signType === HEAD)) {
      max = 37
    } else if ((age > 36 && age <= 240) && (signType === HEIGHT || signType === WEIGHT)) {
      max = 241
      start = 24
    } else if (age > 24 && signType === BMI) {
      max = 241
      start = 24
    }
  }
  // function getRandom (n, m) {
  //   return Math.random() * (m - n) + n
  // }

  for (let i = start; i < max; i++) { // 控制生成几组数据
    data.push(i)
    // data[i] = []
    // console.log('max', max)
    // for (let j = 0; j <= max; j++) { // 控制每组数据多少个点
    // data.push(i)
    // let value = j < 110 ? j : (max - j - 30)
    // data[i].push({
    //   date: j + '',
    //   value: getRandom(10, 100)
    // })
    // }
  }

  return data
}
// 上月下年时间轴格式化
function formatYearAxis (parent) {
  let nodes = parent.selectAll('.who_axis_x .tick').nodes()
  // console.log('nodes', nodes)
  let myMap = d3.map(nodes)
  myMap.each(function (value, key) {
    if (Number(key) % 12 === 0) {
      d3.select(nodes[key])
        .select('text')
        .attr('y', 16)
        .text(function () {
          if (Number(key) === 0) {
            return '生日'
          } else {
            return Number(key) / 12 + '年'
          }
        })

      d3.select(nodes[key])
        .select('line')
        .attr('y2', 8)
        .attr('stroke', '#e7e7e7')
        .attr('stroke-width', 2)
    }
  })
}
// 上周下月时间轴格式化
function formatMonthAxis (parent) {
  let nodes = parent.selectAll('.who_axis_x .tick').nodes()
  let myMap = d3.map(nodes)
  myMap.each(function (value, key) {
    // d3.select(nodes[key])
    //   .filter(function (d, index) {
    //     return d !== 92
    //   })
    //   .append('line')
    //   .attr('x1', 0)
    //   .attr('y1', 0)
    //   .attr('x2', 0)
    //   .attr('y2', -50)
    //   .attr('stroke', '#000')
    if (Number(key) > 13) {
      d3.select(nodes[key])
        .select('text')
        .attr('y', 20)
    }
  })
}
// y轴格式化
function formatAxisY (signType, age, data, chartType) {
  function _weightAndHead () {
    if (age > 24 && age <= 60) {
      if (chartType === 'CDC' && signType === 'WEIGHT' && age > 36) {
        if (data % 5 === 0) {
          return data
        }
      } else {
        if (data % 2 === 0) {
          return data
        }
      }
    } else {
      if (chartType === 'CDC' && signType === 'WEIGHT' && age > 36) {
        if (data % 5 === 0) {
          return data
        }
      } else if (data === parseInt(data)) {
        return data
      }
    }
  }
  if (signType === 'HEIGHT') { // 身高0-6个月 0-2岁 0-5岁都一样
    if (data % 5 === 0) {
      return data
    }
  } else if (signType === 'WEIGHT') { // 体重0-6个月
    return _weightAndHead()
  } else if (signType === 'HEAD') {
    return _weightAndHead()
  } else if (signType === 'BMI') {
    if (data === parseInt(data)) {
      return data
    }
  }
}
// 控制y轴显示多少刻度
function getTickCount (signType, age, dataRange) {
  let tickCount = null
  // 身高0-6个月 0-2岁 0-5岁都一样
  if (signType === 'HEIGHT') {
    tickCount = Math.ceil(dataRange[1] - dataRange[0])
  } else if (signType === 'WEIGHT') {
    if (age > 24 && age <= 60) { // 体重0-5岁每格表示1kg，其他每格表示0.1kg
      tickCount = Math.ceil(dataRange[1] - dataRange[0])
    } else {
      tickCount = Math.ceil(dataRange[1] - dataRange[0]) * 10
    }
  } else if (signType === 'HEAD') {
    tickCount = Math.ceil(dataRange[1] - dataRange[0]) * 2
  } else if (signType === 'BMI') {
    tickCount = Math.ceil(dataRange[1] - dataRange[0]) * 5
  }
  return tickCount
}
// 获取月龄
function getAgeOfMonth (birthtime) {
  const birthDate = new Date(birthtime)
  const birthYear = birthDate.getFullYear()
  const birthMonth = birthDate.getMonth() + 1
  const birthDay = birthDate.getDate()
  const nowDate = new Date()
  const nowYear = nowDate.getFullYear()
  const nowMonth = nowDate.getMonth() + 1
  const nowDay = nowDate.getDate()
  const year = nowYear - birthYear
  const month = nowMonth - birthMonth
  const day = nowDay - birthDay
  let age = 0
  if (day > 15) {
    age = year * 12 + month + 0.5
  } else {
    age = year * 12 + month
  }
  return age
}

async function getOriginAgeOfMonth (patientId, type) { // 通过后端接口获取月龄
  let ageOfMonth = 0
  try {
    ageOfMonth = await phrapi.getPatientInfo(patientId).then(res => {
      if (res) {
        let {age, day, month} = {
          birthday: res.birthday,
          age: res.age,
          month: res.isMonth,
          day: res.isDay
        }
        if (type === 'WHO') {
          if (day > 0) {
            ageOfMonth = age * 12 + month + 1
          } else {
            ageOfMonth = age * 12 + month
          }
        } else if (type === 'CDC') {
          if (day <= 15) {
            ageOfMonth = age * 12 + month
          } else {
            ageOfMonth = age * 12 + month + 1
          }
        } else {
          if (age === null && month === null && day === null) {
            ageOfMonth = 404// 意思是没有年龄信息，显示非标准曲线（使用场景：患者信息头）
          } else {
            ageOfMonth = age * 12 + month
          }
        }
        return ageOfMonth
      }
    })
  } catch (e) {
    throw Error('计算月龄出现问题', e)
  }
  if (type === 'CDC') {
    return ageOfMonth
  } else if (type === 'WHO') {
    return getAgeOfDay(ageOfMonth)
  } else {
    return ageOfMonth
  }
}
function getAgeOfDay (ageOfMonth) { // 获取天龄
  let days = 0
  if (ageOfMonth <= 3) {
    days = 91
  } else if (ageOfMonth <= 6) {
    days = 183
  } else if (ageOfMonth <= 24) {
    days = 731
  } else if (ageOfMonth <= 60) {
    days = 1856
  } else { // 大于5岁了没有相关标准曲线
    days = 1857
  }
  return days
}

export {
  getAgeOfDay,
  getOriginAgeOfMonth,
  creatData,
  formatYearAxis,
  formatMonthAxis,
  operateData,
  showUpDown,
  formatAxisY,
  getTickCount,
  getDomain,
  getAxisName,
  getTextConfig,
  getAgeOfMonth
}
