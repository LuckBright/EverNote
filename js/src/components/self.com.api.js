import { base as axios } from './baseapi'

async function getUseFreq (params) {
  let res = await axios.post('/thc-platform-core/frequency/getFrequencysForSob?isValid=1', params).catch(() => {
    return false
  })
  if (res && res.length) {
    let list = res.map(item => {
      let useFreq = {
        id: item.code,
        name: item.name,
        nameEn: item.nameEn,
        code: item.code,
        num: item.num,
        loopCycle: item.loopCycle
      }
      if (item.frequencyItems) {
        useFreq.children = item.frequencyItems.map(child => {
          return {
            id: child.time,
            name: child.time,
            nameEn: item.nameEn,
            code: item.code,
            loopCycle: item.loopCycle
          }
        })
      }
      return useFreq
    })
    return { list }
  }
  return false
}

async function getSurgeryDoctor (params) {
  params = Object.assign({}, params, {
    baseStaffPermission1CodeList: ['03']
  })
  let res = await axios.post('/thc-platform-core/out/staff/getStaffListByCondition/', params).then(val => {
    if (val || val.list.length) {
      return val.list
    }
    return []
  }).catch(() => [])
  return res
}

export default {
  '/thc-platform-core/frequency/getFrequencysForSob?isValid=1': getUseFreq,
  '/thc-platform-core/out/staff/getStaffListByCondition/': getSurgeryDoctor
}
