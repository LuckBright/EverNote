import { warehouse as axios } from './api'
import { convertCharToPinyin } from '@/components/pinyin.js'

import { diction } from '@/store/common'
const url1 = diction.api + '/thc-platform-core/'

const url = 'sysTypeInfo/'

function getById (id) {
  return axios.post(url + 'getSysTypeInfo/', {
    id
  }).then(result => {
    return result
  })
}

// 原来传值结构为 {code：xxxx} 接口调整为 {setCode：['xxx']}
// 这块不知道是修改调用的地方，还是原来数据结构不变，提交的时候做格式转换
// 这块存在两种情况 直接调 list 和调listonce
// sysvalue.list({ code: 'THC_WH_OBJECT_SUB_TYPE' })
// this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE') by lvjiangtao@everjianakng.com
// 不允许直接调用 .list 方法，统一切换到 listOnce 方法，
// 去掉 invalidDateShow 属性
// 获取当前code的值集数组
function list (params) {
  params.setCode = params.setCode[0]
  return axios.post(url1 + 'valueSetItem/getValueSetItems/', params).then(res => {
    addExtraData(res.list)
    return res.list
  })
}

// 获取父子结构值集
function tree (param) {
  //  param.setCode = param.setCode[0]
  return axios.post(url1 + 'valueSetItem/getValueSetItemByCode', param).then(res => {
    addExtraData(res)
    dataTrans(res)
    return res
  })
}

var resultObj = {}
var requestMap = {}
/**
 * 获取集对应的列表
 * @param {*} code  集的id
 * @param {*} filtercodes  从返回结构中过滤内容
 * @param {*} name  模糊查询值
 * @param {*} clear 是否重新查询结果
 */
function listOnce (code, filtercodes, name, clear) {
  if (!code) {
    return Promise.resolve([])
  }
  code = code.trim()
  if (filtercodes) {
    return getValueSetFilter(code, filtercodes)
  } else {
    // 有name为模糊查询 需要每次都重新查询；如果clear为true 强制重新查询
    if (!resultObj[code] || name || clear) {
      if (!requestMap[code]) {
        requestMap[code] = []
      }
      let promise = new Promise(function (resolve, reject) {
        requestMap[code].push(resolve)
      })
      if (requestMap[code].length < 2) {
        let params = {
          setCode: [code]
        }
        if (filtercodes) params.codes = filtercodes
        if (name) params.name = name
        list(params).then(result => {
          // 为了兼容tag的高亮，增加一个属性 4.11.1 by lvjiangtao@everjiankang.com
          result.forEach(item => {
            item.tagEffect = false
          })
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
}

// 把后端返回值添加两个字段，quanpin shoupin 给拼音检索用
// hack一下后端返回的parentId值
function addExtraData (arr) {
  if (arr && arr.length) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].quanpin = convertCharToPinyin(arr[i].name).quanpin
      arr[i].shoupin = convertCharToPinyin(arr[i].name).shoupin
      arr[i].id = arr[i].code // 把code复制到id内，前端要用
      let _tmp = arr[i].parentId
      if (arr[i].parentId && _tmp.lastIndexOf('.') > -1) {
        _tmp = _tmp.substring(_tmp.lastIndexOf('.') + 1)
      }
      arr[i].parentId = _tmp
      if (arr[i].valueSetItems && arr[i].valueSetItems.length) {
        addExtraData(arr[i].valueSetItems)
      }
    }
  } else {
    return []
  }
}

// 简化后端返回数据（从后端返回众多字段中选出有用的，并且做一下转换，兼容前端以前id使用方式）
function dataTrans (arr) {
  for (var i = 0; i < arr.length; i++) {
    let tmp = {
      id: arr[i].code,
      name: arr[i].name,
      code: arr[i].code,
      label: arr[i].name,
      value: arr[i].code,
      quanpin: arr[i].quanpin,
      shoupin: arr[i].shoupin,
    }
    if (arr[i].valueSetItems) {
      tmp.children = arr[i].valueSetItems
    }
    arr[i] = tmp
    if (arr[i].children && arr[i].children.length) {
      dataTrans(arr[i].children)
    }
  }
}

// 获取后端树状结构数据
var resultObj1 = {}
var requestMap1 = {}
function cascade (code, filtercodes) {
  let cacheCode = code
  if (filtercodes && filtercodes.length) cacheCode = `${code}_${filtercodes.join('')}`
  if (!code) {
    return Promise.resolve([])
  }
  if (!resultObj1[cacheCode]) {
    if (!requestMap1[cacheCode]) {
      requestMap1[cacheCode] = []
    }
    let promise = new Promise(function (resolve, reject) {
      requestMap1[cacheCode].push(resolve)
    })
    if (requestMap1[cacheCode].length < 2) {
      let params = {
        setCode: code
      }
      if (filtercodes && filtercodes.length) params.codes = filtercodes
      tree(params).then(result => {
        // dataTrans(result)
        resultObj1[cacheCode] = result
        requestMap1[cacheCode].forEach(p => {
          p(result)
        })
        requestMap1[cacheCode] = []
      })
    }
    return promise
  } else {
    return Promise.resolve(resultObj1[cacheCode])
  }
}

// 需要过滤一下数据结构
function getValueSetFilter (code, filtercodes) {
  let params = {
    setCode: code,
    codes: filtercodes
  }
  return tree(params).then(result => {
    return result
  })
}

// 根据父code 和 自己code 换对应的名字来显示，
function getValByCode (type, id, cbObj) {
  return listOnce(type).then(result => {
    var arr = result.filter(v => {
      return v.code === ('' + id)
    })
    return arr.length ? cbObj ? arr[0] : arr[0].name : ''
  })
}

export default {
  getById,
  list,
  tree,
  listOnce,
  cascade,
  getValByCode,
  convertCharToPinyin,
  dataTrans,
  getValueSetFilter
}
