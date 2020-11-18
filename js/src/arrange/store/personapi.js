import {arrange as axios} from './api'
import moment from 'moment'
const url = 'arrange/'

// 获取可用班次
function getAvailableTimeTrunk (params) {
  return axios.post('timetrunk/new/getAvailableTimeTrunk', params).then((response) => {
    return response
  })
}

function list (params) {
  return axios.post(url + 'getProviderPersonArrangement/', Object.assign({
    offset: 0,
    pageSize: 10
  }, params)).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}
// 查询排班
function listNew (params) {
  return axios.post('resourceArrange/searchFormat', Object.assign({
    offset: 0,
    pageSize: 10
  }, params)).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function getPersonArrangement (params) {
  return axios.post(url + 'getPersonArrangement/', Object.assign({
    offset: 0,
    pageSize: 10
  }, params)).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function copyweek (params) {
  return axios.post('resourceArrange/copyWeek', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function copyNurseweek (params) {
  return axios.post(url + 'copyweek/', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function arrangePerson (params) {
  return axios.post(url + 'arrangePerson/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// 创建排班
function createArrange (params) {
  return axios.post('resourceArrange/create', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function updateArrange (params) {
  return axios.post('resourceArrange/update', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function del (params) {
  return axios.post('resourceArrange/delete', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getNewArrangement (params) {
  return listNew(params).then(result => {
    console.log(result, 'new')
    result = result.map(v => {
      v.arrangeGroupItemList.map(val => {
        val.arrangeGroupItemList = [...val.resourceArrangeList]
        val.arrangeGroupItemList = val.arrangeGroupItemList.reduce((sum, curr) => {
          let day = moment(curr.date).format('YYYY-MM-DD')
          if (!sum[day]) {
            sum[day] = []
          }
          sum[day].push(curr)
          return sum
        }, {})
      })
      return v
    })
    return result
  })
}

function getArrangement (params) {
  return list(params).then(result => {
    // console.log(result, 'result123123')
    //  group with weekday
    result = result.map(v => {
      v.arrangeMap = v.arrange.reduce((total, curr) => {
        // total初始值 ,curr每一项
        let day = moment(curr.date).format('YYYY-MM-DD')
        if (!total[day]) {
          total[day] = []
        }
        total[day].push(curr)
        return total
      }, {})
      return v
    })
    //  group with provider
    result = result.reduce((sum, curr) => {
      let providerId = curr.providerId
      if (!sum[providerId]) {
        sum[providerId] = []
      }
      sum[providerId].push(curr)
      return sum
    }, {})
    return result
  })
}

// 护士排班
function nurseList (params) {
  return axios.post(url + 'getArrangeListNew', Object.assign({
    offset: 0,
    pageSize: 10
  }, params)).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function getArrangeList (params) {
  return nurseList(params).then(result => {
    //  group with weekday
    result = result.map(v => {
      v.arrangeMap = v.arrange.reduce((total, curr) => {
        let day = moment(curr.date).format('YYYY-MM-DD')
        if (!total[day]) {
          total[day] = []
        }
        total[day].push(curr)
        return total
      }, {})
      return v
    })
    //  group with provider
    result = result.reduce((sum, curr) => {
      let areaId = curr.areaId
      if (!sum[areaId]) {
        sum[areaId] = []
      }
      sum[areaId].push(curr)
      return sum
    }, {})
    return result
  })
}

function createNurse (params) {
  return axios.post(url + 'createArrangeNew', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function updateNurse (params) {
  return axios.post(url + 'updateArrangeNew', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function delNurse (params) {
  return axios.post(url + 'deleteArrange', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  getNewArrangement,
  getAvailableTimeTrunk,
  list,
  listNew,
  getPersonArrangement,
  copyweek,
  copyNurseweek,
  arrangePerson,
  createArrange,
  updateArrange,
  del,
  getArrangement,
  getArrangeList,
  createNurse,
  updateNurse,
  delNurse,
  nurseList
}
