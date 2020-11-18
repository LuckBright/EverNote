import { workspace as axios } from './api'
import moment from 'moment'
import { Notification } from 'element-ui'
let url = '/arrange/appoint/'
let url1 = '/arrange/appointment/'

function list (params) {
  return axios.post(url + 'initdata', params).then(result => {
    return result.data.reduce((acc, curr) => {
      curr.appoint = curr.appoint.map(v => {
        if ([3, 9].indexOf(v.appointmentState) > -1) {
          v.appointmentState = 2
        }
        return v
      })
      curr.timetrunk.appointmentArrangeid = curr.id
      let day = curr.date
      if (!acc[day]) {
        acc[day] = []
      }
      let existDoctors = acc[day].filter(v => {
        return v.personId === curr.personId
      })
      if (!existDoctors.length) {
        curr.trunks = [curr.timetrunk]
        acc[day].push(curr)
      } else {
        // 如果已经存在该医生当天的数据，则把排班和预约放到该医生下。解决一个医生一天多个班次的问题。
        existDoctors[0].trunks.push(curr.timetrunk)
        existDoctors[0].appoint = existDoctors[0].appoint.concat(curr.appoint)
      }
      return JSON.parse(JSON.stringify(acc))
    }, {})
  })
}

function isLocked (exc, day, time) {
  if (!exc || !exc.length) {
    return false
  }
  let _datestr = day + ' ' + time + ':00'
  let _datetime = new Date(_datestr).getTime()
  return (exc.filter(v => {
    return _datetime >= v.starttime && _datetime < v.endtime
  }).length > 0)
}

function isMorning (start, end) {
  let centerNum = 12 * 60
  start = start.substring(0, 5).split(':')
  start = Number(start[0]) * 60 + Number(start[1])
  return start <= centerNum
}

function isAfternoon (start, end) {
  let centerNum = 12 * 60
  end = end.substring(0, 5).split(':')
  end = Number(end[0]) * 60 + Number(end[1])
  return end > centerNum
}

function baseDayInfo () {
  return {
    appoints: [], // 预约列表
    available: false, // 是否可预约
    locked: false, // 是否锁定
    volume: 0, // 最大预约数
    exception: [] // 锁定列表
  }
}

function setDayInfo (existDoctorDay, curr) {
  let obj = {
    id: curr.id,
    // locked: isLocked(curr.exception, curr.date, '09:00'),
    timetrunk: curr.timetrunk,
    serviceServStationArranges: curr.serviceServStationArranges,
    volume: curr.serviceServStationArranges.reduce((acc, curr1) => {
      acc += curr1.volume
      return acc
    }, 0),
    totalVolume: 0,
    same: false, // 上下午是否同一个排班
    exception: curr.exception,
    isFull: false
  }
  let timeTrunk = curr.timetrunk
  // 如果上午，下午结束时间大于该排班结束时间，则不可排班
  let arrangeEnd = moment(curr.date + ' ' + curr.timetrunk.endTime, 'YYYY-MM-DD HH:mm:ss')
  let arrangeStart = moment(curr.date + ' ' + curr.timetrunk.startTime, 'YYYY-MM-DD HH:mm:ss')
  let zhongwu = moment(moment().format('YYYY-MM-DD')).add(12, 'h')
  if (moment(curr.date).isAfter(moment(moment().format('YYYY-MM-DD')))) {
    existDoctorDay[0].available = true
    existDoctorDay[1].available = true
  }
  if (moment(curr.date).isSame(moment(moment().format('YYYY-MM-DD')))) { // 如果排班日期等于今天
    if (arrangeStart.isSameOrBefore(zhongwu) && moment().isSameOrBefore(zhongwu)) { // 如果排班起始时间小于中午则上午可预约
      existDoctorDay[0].available = true
    }
    if (arrangeEnd.isAfter(zhongwu)) {
      existDoctorDay[1].available = true
    }
  }
  if (isMorning(timeTrunk.startTime, timeTrunk.endTime) && isAfternoon(timeTrunk.startTime, timeTrunk.endTime)) {
    obj.same = true
  }
  if (isMorning(timeTrunk.startTime, timeTrunk.endTime)) {
    Object.assign(existDoctorDay[0], obj, { locked: isLocked(curr.exception, curr.date, '09:00') })
  }
  if (isAfternoon(timeTrunk.startTime, timeTrunk.endTime)) {
    Object.assign(existDoctorDay[1], obj, { locked: isLocked(curr.exception, curr.date, '14:00') })
  }
}

function list2 (params) {
  let centerNum = 12 * 60
  let days = [] // 所有列
  let start = moment(params.startdate)
  while (start.isSameOrBefore(moment(params.enddate))) {
    days.push(start.format('YYYY-MM-DD'))
    start = start.add(1, 'days')
  }
  return axios.post(url + 'initdata', params).then(result => {
    // 将每行排班数据转换成
    /**
     [
        {
          '2018-04-15': [{ // 第一个代表上午，第二个代表下午
            "appoints": [], // 预约
            "available": false, // 是否可预约
            "locked": false, // 是否锁定
            "volume": 999, // 可预约数
            "exception": [],
            "time": "09:00",
            "id": 2025,
            "timetrunk": { // 班次

            },
            "serviceServStationArranges": [ // 排班service
            ],
            "totalVolume": 0,
            "same": true // 是否上下午一个排班
          }, {
            "appoints": [], // 预约
            "available": false, // 是否可预约
            "locked": false, // 是否锁定
            "volume": 999, // 可预约数
            "exception": [],
            "time": "09:00",
            "id": 2025,
            "timetrunk": { // 班次

            },
            "serviceServStationArranges": [ // 排班service
            ],
            "totalVolume": 0,
            "same": true
          }],
          '2018-04-16': [],
          days: ['2018-04-15', '2018-04-16'], // 展示表格时遍历列属性使用
          doctor: {} //医生信息
        }
     ]
    */
    let doctorMap = result.data.reduce((acc, curr) => {
      if (!acc[curr.doctor.id]) {
        // 初始化行信息，一行代表一个医生
        acc[curr.doctor.id] = {
          doctor: curr.doctor,
          personId: curr.personId,
          providerId: curr.providerId,
          providerName: curr.providerName,
          servStationId: curr.servStationId,
          servStationName: curr.servStationName,
          serviceServStationArranges: curr.serviceServStationArranges
        }
        // 初始化天信息，确保查询时间段内每一天都能取到值，预防空值判断
        days.forEach(day => {
          acc[curr.doctor.id][day] = [Object.assign(baseDayInfo(), { time: '09:00', isMorning: true }), Object.assign(baseDayInfo(), { time: '14:00', isMorning: false })]
        })
      }
      let existDoctor = acc[curr.doctor.id]
      setDayInfo(existDoctor[curr.date], curr) // 设置本次排班信息到对应天上下午
      // 设置本次预约到对应天上下午
      curr.appoint.forEach(v => {
        if ([3, 9].indexOf(v.appointmentState) > -1) {
          v.appointmentState = 2
        }
        let appoint = v
        let start = appoint.appointmentStarttime.substring(0, 5).split(':')
        // let end = appoint.appointmentEndtime.substring(0, 5).split(':')
        start = Number(start[0]) * 60 + Number(start[1])
        // end = Number(end[0]) * 60 + Number(end[1])
        if (start <= centerNum) {
          existDoctor[curr.date][0].appoints.push(appoint)
        } else {
          existDoctor[curr.date][1].appoints.push(appoint)
        }
      })
      // 约满不能再约
      let indexArr = [0, 1]
      indexArr.forEach(index => {
        if (existDoctor[curr.date][index].same) {
          if ((existDoctor[curr.date][0].appoints.length + existDoctor[curr.date][1].appoints.length) >= existDoctor[curr.date][0].volume) {
            existDoctor[curr.date][index].available = false
            existDoctor[curr.date][index].isFull = true
          }
        } else {
          if (existDoctor[curr.date][index].appoints.length >= existDoctor[curr.date][index].volume) {
            existDoctor[curr.date][index].available = false
            existDoctor[curr.date][index].isFull = true
          }
        }
      })
      return acc
    }, {})
    return {
      columns: days,
      rows: Object.values(doctorMap)
    }
  })
}

function confirm (id) {
  return axios.post(url + 'confirm', { id })
}

function cancel (id) {
  return axios.post(url1 + 'cancel', { id })
}

function create (obj) {
  return axios.post(url + 'create', obj).then(result => {
    if (!obj.isSceneAppoint) {
      Notification.success('预约成功')
    }
    return result
  })
}
function update (obj) {
  return axios.post(url + 'update', obj)
}
function exception (obj) {
  return axios.post('/arrange/arrangeexception/create', obj)
}
function delexception (obj) {
  return axios.post('/arrange/arrangeexception/delete', obj)
}
function getProviderByDate (params) {
  return axios.post('/arrange/resourceArrange/getArrangeDepts', params).then((response) => {
    return response.data
  })
}

function getDoctors (providerId, date) {
  return axios.post('/arrange/resourceArrange/getDoctorList', {
    providerId,
    date,
    timeTrunkType: 1
  }).then(resonse => {
    return resonse.data
  })
}
// 获取药库信息
function getDrugInfo (params) {
  return axios.post('/warehouse/outpatientDispense/getTaskListByVisitSn/', params)
}
export default {
  list,
  list2,
  create,
  confirm,
  cancel,
  update,
  exception,
  delexception,
  getProviderByDate,
  getDoctors,
  getDrugInfo
}
