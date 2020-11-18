
import { sob as axios } from '@/sob/store/api'
import {objFind} from '@/util/common'
import {merge} from 'lodash'

async function getSchemaList (params) {
  return axios.post('healthServiceTemplate/search', params).then(res => {
    if (res.data && res.data.resultList.length) {
      return res.data.resultList
    }
    return false
  }).catch(err => {
    console.error('healthServiceTemplate/update/', err)
  })
}
async function changeSchema (params) {
  return axios.post('healthServiceTemplate/update/', params).then(res => {
    return true
  }).catch(() => {
    return false
  })
}
async function changeList () {
  let schemaList = []
  await getSchemaList({
    offset: 0,
    page: 1,
    pagesize: 50,
    u: true
  }).then(res => {
    if (res) {
      schemaList = res
    }
  })
  schemaList.forEach(item => {
    window.setTimeout(() => {
      let schemaValue = JSON.parse(item.schemaValue)
      let changeArr = [
        {from: 'totalUseDay', to: 'useDay'},
        {from: 'decoct', to: 'decoctFlag'},
        {from: 'isEmergency', to: 'emergencyFlag'},
        {from: 'freeSheet', to: 'freeSheetFlag'},
        {from: 'useBloodNum', to: 'applyBloodNum'},
        {from: 'aboxueXingDaiMa', to: 'aboSerum'},
        {from: 'rhxueXingDaiMa', to: 'rhSerum'},
        {from: 'ifCollectSpecimens', to: 'collectSpecimensFlag'},
        {from: 'ifMatchingBlood', to: 'matchingBloodFlag'},
        {from: 'anaesthesiaId', to: 'anaesthesia'},
        {from: 'appointAnesthesiologist', to: 'appointAnesthesiologistFlag'},
        {from: 'appointDate', to: 'appointDateFlag'},
        {from: 'excuteProvider', to: 'executeProvider'}
      ]
      changeArr.forEach(v => {
        let {from, to} = v
        let code = objFind(schemaValue, {propertyObject: {code: from}})
        if (code) {
          console.log(from, '---', to)
          console.log(item.name)
          code.propertyObject.code = to
        }
      })
      item.schemaValue = JSON.stringify(schemaValue)
      changeSchema(item).then(res => {
        if (res) {
          // console.log(item.name)
        }
      })
    }, 200)
  })
}

async function changeOther (from, to, ids) {
  /**
   * [{from: '', to: ''}]
   */
  let schemaList = []
  await getSchemaList({
    offset: 0,
    page: 1,
    pagesize: 50,
    u: true
  }).then(res => {
    if (res) {
      schemaList = res
    }
  })
  schemaList.forEach(item => {
    window.setTimeout(() => {
      let schemaValue = JSON.parse(item.schemaValue)
      let schema = objFind(schemaValue, from)
      if (schema) {
        if (ids) {
          if (ids.includes(item.id)) {
            merge(schema, to)
            console.log(from, '---', to)
            console.log(item.name, '---', item.id)
          }
        } else {
          merge(schema, to)
          console.log(from, '---', to)
          console.log(item.name, '---', item.id)
        }
      }
      item.schemaValue = JSON.stringify(schemaValue)
      changeSchema(item).then(res => {
        if (res) {
          // console.log(item.name)
        }
      })
    }, 200)
  })
}

export {
  getSchemaList,
  changeSchema,
  changeList,
  changeOther
}
