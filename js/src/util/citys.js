import axios from 'axios'
import diction from '@/store/common'
const url1 = diction.api + '/thc-platform-core/'

async function getData () {
  let CITIESLIST = []
  if (localStorage.getItem('CITIESLIST') !== 'undefined' && localStorage.getItem('CITIESLIST') !== null && localStorage.getItem('CITIESLIST')) {
    CITIESLIST = JSON.parse(localStorage.getItem('CITIESLIST'))
  } else {
    let res = await axios.get(diction.api + '/thc-platform-core/area/getAllAreaCodes')
    if (res.head.errCode === 0) {
      CITIESLIST = res.data
      localStorage.setItem('CITIESLIST', JSON.stringify(CITIESLIST))
    }
  }
  return CITIESLIST
}

function getCityData () {
  return axios.get(url1 + 'area/getAllAreaCodes').then(res => {
    return res.data
  })
}

var resultObj = {}
var requestMap = {}
function listOnce (code = 'citys') {
  // 有name为模糊查询 需要每次都重新查询；如果clear为true 强制重新查询
  if (!resultObj[code]) {
    if (!requestMap[code]) {
      requestMap[code] = []
    }
    let promise = new Promise(function (resolve, reject) {
      requestMap[code].push(resolve)
    })
    if (requestMap[code].length < 2) {
      getCityData().then(result => {
        resultObj[code] = result
        requestMap[code].forEach(p => {
          p(result)
        })
        requestMap[code] = []
      })
    }
    return promise
  } else {
    return Promise.resolve(resultObj[code])
  }
}

function getAddressList (obj) {
  let resArr = []
  if (obj.enMode) {
    resArr = renderListEn(obj.level)
  } else {
    resArr = renderList(obj.level)
  }
  return resArr
}

function renderList (level) {
  return listOnce().then(res => {
    let CITIESLIST = res
    let retObj = []
    if (level >= 1) {
      for (let i = 0; i < CITIESLIST.length; i++) {
        let _obj = {}
        _obj.value = CITIESLIST[i].code
        _obj.label = CITIESLIST[i].name
        _obj.nameEn = CITIESLIST[i].nameEn
        if (level >= 2) {
          _obj.children = []
          if (CITIESLIST[i].subAreas && CITIESLIST[i].subAreas.length > 0) {
            for (let j = 0; j < CITIESLIST[i].subAreas.length; j++) {
              let __obj = {}
              __obj.value = CITIESLIST[i].subAreas[j].code
              __obj.label = CITIESLIST[i].subAreas[j].name
              __obj.nameEn = CITIESLIST[i].subAreas[j].nameEn
              if (level >= 3) {
                __obj.children = []
                if (Array.isArray(CITIESLIST[i].subAreas[j].subAreas) && CITIESLIST[i].subAreas[j].subAreas.length) {
                  for (let k = 0; k < CITIESLIST[i].subAreas[j].subAreas.length; k++) {
                    let ___obj = {}
                    ___obj.value = CITIESLIST[i].subAreas[j].subAreas[k].code
                    ___obj.label = CITIESLIST[i].subAreas[j].subAreas[k].name
                    ___obj.nameEn = CITIESLIST[i].subAreas[j].subAreas[k].nameEn
                    __obj.children.push(___obj)
                  }
                }
              }
              if (__obj.children && __obj.children.length === 0) {
                delete __obj.children
              }
              _obj.children.push(__obj)
            }
          }
        }
        if (_obj.children && _obj.children.length === 0) {
          delete _obj.children
        }
        retObj.push(_obj)
      }
    }
    return retObj
  })
}

function renderListEn (level) {
  return listOnce().then(res => {
    let CITIESLIST = res
    let retObj = []
    if (level >= 1) {
      for (let i = 0; i < CITIESLIST.length; i++) {
        if (CITIESLIST[i].nameEn) {
          let _obj = {}
          _obj.value = CITIESLIST[i].code
          _obj.label = CITIESLIST[i].nameEn
          if (level >= 2) {
            _obj.children = []
            for (let j = 0; j < CITIESLIST[i].subAreas.length; j++) {
              if (CITIESLIST[i].subAreas[j].nameEn) {
                let __obj = {}
                __obj.value = CITIESLIST[i].subAreas[j].code
                __obj.label = CITIESLIST[i].subAreas[j].nameEn
                if (level >= 3) {
                  __obj.children = []
                  if (Array.isArray(CITIESLIST[i].subAreas[j].subAreas) && CITIESLIST[i].subAreas[j].subAreas.length) {
                    for (let k = 0; k < CITIESLIST[i].subAreas[j].subAreas.length; k++) {
                      if (CITIESLIST[i].subAreas[j].subAreas[k].nameEn) {
                        let ___obj = {}
                        ___obj.value = CITIESLIST[i].subAreas[j].subAreas[k].code
                        ___obj.label = CITIESLIST[i].subAreas[j].subAreas[k].nameEn
                        __obj.children.push(___obj)
                      }
                    }
                  }
                }
                if (__obj.children && __obj.children.length === 0) {
                  delete __obj.children
                }
                _obj.children.push(__obj)
              }
            }
          }
          if (_obj.children && _obj.children.length === 0) {
            delete _obj.children
          }
          retObj.push(_obj)
        }
      }
    }
    return retObj
  })
}

// {"addressDetail":"光熙门","province":"140000","city":"140300","county":"140311"} 光熙门
function getCityName1 (addressString, split) {
  try {
    let returnString = ''
    let addrObj = JSON.parse(addressString)
    return listOnce().then(res => {
      let CITIESLIST = res
      split = split || ' '
      for (var i = 0; i < CITIESLIST.length; i++) {
        if (addrObj.province && CITIESLIST[i].code.trim() === addrObj.province.trim()) {
          returnString += CITIESLIST[i].name
          for (var j = 0; j < CITIESLIST[i].subAreas.length; j++) {
            if (addrObj.city && CITIESLIST[i].subAreas[j].code === addrObj.city) {
              returnString += (split + CITIESLIST[i].subAreas[j].name)
            }
            if (Array.isArray(CITIESLIST[i].subAreas[j].subAreas)) {
              for (var k = 0; k < CITIESLIST[i].subAreas[j].subAreas.length; k++) {
                if (addrObj.county && CITIESLIST[i].subAreas[j].subAreas[k].code === addrObj.county) {
                  returnString += (split + CITIESLIST[i].subAreas[j].subAreas[k].name)
                }
              }
            }
          }
        }
      }
      if (addrObj.addressDetail) {
        returnString += (split + addrObj.addressDetail)
      }
      return returnString
    })
  } catch (_) {
    return ''
  }
}
/**
 *  通过code 获取城市code + name对象
 *
 * @param {Array} list  城市{addressDetail: "天竺区红安县112号", province: "510000", city: "510100", county: "510104"}列表
 * @returns             城市code对象 （[{ code: "110000"
                                        name: "北京市"
                                        nameEn: "Beijing"}]）
 */
function getSingleCityName (list) {
  console.error('地址相关方法废弃，请删除相关调用')
  return []
  // const cityList = await getData()
  // let citys = []
  // function cityName (data, item, name = 'province') {
  //   let code = item[name]
  //   const index = data.findIndex(city => {
  //     return city.code === code
  //   })
  //   if (name !== 'city' && index > -1) {
  //     const key = 'city'
  //     cityName(data[index].subAreas, item, key)
  //   } else if (name === 'city' && index > -1) {
  //     const city = Object.assign({}, data[index]) // 获取当前城市数据
  //     city.code = city.code.substr(0, 4) // 后端获取城市code 只需要前4位
  //     citys.push(city)
  //   }
  // }
  // list.map(item => {
  //   cityName(cityList, item)
  // })
  // return citys
}

export default {
  getAddressList,
  getData,
  getCityName1,
  getSingleCityName,
  getCityData,
  listOnce
}
