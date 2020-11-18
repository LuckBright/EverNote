import axios from './api'
import {diction} from '@/store/common'
const url = 'ar/archiving/'
const urlTh = diction.api

function list (params) {
  return axios.post(url + 'getList', params).then(result => {
    return result.data
  })
}
function getSettlementNo (params) {
  return axios.post(url + 'getSettlementList', params).then(result => {
    return result.data
  })
}
function createInfo (params) {
  return axios.post(url + 'create', params).then(result => {
    return result.data
  })
}
function getViewStatus (params) {
  return axios.post('ar/settlement/getViewStatus', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getInfo (params) {
  return axios.post(url + 'get', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function update (params) {
  return axios.post(url + 'update', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getBackList (level) {
  return axios.post(urlTh + '/pricemanage/sale/template/getAddrData')
  .then(function (response) {
    var CITIESLIST = response.data
    if (!level) {
      level = 1
    }
    var retObj = []
    if (level >= 1) {
      for (var i = 0; i < 36; i++) {
        if (CITIESLIST[i][2] === '1000000000') {
          var _obj = {}
          _obj.value = CITIESLIST[i][0]
          _obj.label = CITIESLIST[i][1]
          if (level >= 2) {
            _obj.children = []
            for (var j = 0; j < CITIESLIST.length; j++) {
              if (CITIESLIST[j][2] === CITIESLIST[i][0]) {
                var __obj = {}
                __obj.value = CITIESLIST[j][0]
                __obj.label = CITIESLIST[j][1]
                if (level >= 3) {
                  __obj.children = []
                  for (var k = 0; k < CITIESLIST.length; k++) {
                    if (CITIESLIST[k][2] === CITIESLIST[j][0]) {
                      var ___obj = {}
                      ___obj.value = CITIESLIST[k][0]
                      ___obj.label = CITIESLIST[k][1]
                      __obj.children.push(___obj)
                    }
                  }
                }
                _obj.children.push(__obj)
              }
            }
          }
          retObj.push(_obj)
        }
      }
    }
    return retObj
  })
  .catch(function (error) {
    console.log(error)
  })
}
export default {
  list,
  getSettlementNo,
  createInfo,
  getViewStatus,
  getBackList,
  getInfo,
  update
}

