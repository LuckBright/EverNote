import * as api from './api'

const doctors = {}
const cache = {id: null, content: null}
const source = {}

// 获取医生处方权
export async function getDoctorLimit (id) {
  // if (doctors[id]) {
  //   if (!doctors[id].isRecipe) {
  //     return doctors[id].isRecipe
  //   }
  //   return doctors[id].recipe
  // }
  // let params = {
  //   staffId: id
  // }
  let params = {
    idList: [id]
  }
  let relationIds = []
  let res = await api.getStaffSettingInfoByStaffId(params)
  if (res && res.length) {
    let data = res[0]
    let isRecipe = data.recipePermission === 'Y'
    doctors[id] = {}
    doctors[id].isRecipe = isRecipe
    if (isRecipe) {
      let basePermission01Code = data.basePermission01Code ? data.basePermission01Code.split(',') : [] // 毒麻精放
      let basePermission02Code = data.basePermission02Code ? data.basePermission02Code.split(',') : [] // 抗菌药物
      relationIds = [].concat(basePermission01Code, basePermission02Code)
    } else {
      return false
    }
  } else {
    return false
  }
  doctors[id].recipe = relationIds
  return relationIds
}

// 获取药的限制
export async function getMedicineLimit (ids) {
  if (cache.id === 'ids') {
    return cache.content
  }
  let limitIds = {}
  let params = {ids}
  let datas = await api.getSourceByLocalSettingListByIdsForService(params)
  if (datas) {
    datas.forEach(item => {
      let materialVoObject = item.materialVoObject
      if (!materialVoObject) {
        return
      }
      let name = materialVoObject.byName || ''
      let id = item.id
      let specialClassify = materialVoObject.specialClassify && materialVoObject.specialClassify.split(',')
      let antibioticType = materialVoObject.antibioticType && materialVoObject.antibioticType.split(',')
      // 抗菌类药物
      antibioticType && antibioticType.forEach(k => {
        if (limitIds[k]) {
          limitIds[k].push({name, id, type: k})
        } else {
          limitIds[k] = [{name, id, type: k}]
        }
      })
      // 毒麻精放类药物
      specialClassify && specialClassify.forEach(k => {
        if (limitIds[k]) {
          limitIds[k].push({name, id, type: k})
        } else {
          limitIds[k] = [{name, id, type: k}]
        }
      })
    })
  }
  limitIds.types = Object.keys(limitIds)
  cache.id = ids
  cache.content = limitIds
  return limitIds
}

// 获取物资
export async function getSource (ids) {
  if (source[ids]) {
    return source[ids]
  }
  let params = {ids}
  let datas = await api.getSourceByLocalSettingListByIdsForService(params)
  if (datas.length) {
    source[ids] = datas
    return datas
  } else {
    return false
  }
}

// 获取手术等级对应的医生
export async function getSurgeryDoctor (level) {
  if (!doctors.surgery) {
    doctors.surgery = {}
  }
  if (!level) {
    return []
  }
  if (doctors.surgery[level]) {
    return doctors.surgery[level]
  }
  if (level === 'all') {
    let res = await api.getStaffListDoctor({baseStaffPermission2CodeList: ['1', '2', '3', '4']})
    return res
  }
  let params = {}
  switch (level) {
    case '4':
      params.baseStaffPermission2CodeList = ['4']
      break
    case '3':
      params.baseStaffPermission2CodeList = ['3', '4']
      break
    case '2':
      params.baseStaffPermission2CodeList = ['2', '3', '4']
      break
    case '1':
      params.baseStaffPermission2CodeList = ['1', '2', '3', '4']
      break
  }
  let datas = await api.getStaffListDoctor(params)
  return datas
}

export function diffLimit (doctorLimit, medicineLimit) {
  let noLimits = []
  let types = medicineLimit.types
  types.forEach(item => {
    if (!doctorLimit.includes(item)) {
      noLimits.push(...medicineLimit[item])
    }
  })
  if (noLimits.length) {
    return noLimits
  }
  return false
}
export const specialClassify = {
  '01.03': { icon: 'icon-mayao', name: '麻醉药品' },  // 麻醉药品
  '01.01': { icon: 'icon-jing1', name: '一类精神药品' },  // 一类精神药品
  '01.05': { icon: 'icon-duxing', name: '医疗用毒性药品' },  // 医疗用毒性药品
  '01.06': { icon: 'icon-fangshe', name: '放射性药品' },  // 放射性药品
  '01.04': { icon: 'icon-jiedu', name: '戒毒药品' },  // 戒毒药品
  '01.02': { icon: 'icon-jing', name: '二类精神药品' },  // 二类精神药品
  '1': { icon: 'icon-gaowei', name: '高危药' },  // 高危药
  '02.02': { icon: 'icon-xianzhixing', name: '限制使用级抗菌药物' },  // 限制使用级抗菌药物
  '02.01': { icon: 'icon-teshu', name: '特殊使用级抗菌药物' },  // 特殊使用级抗菌药物
  '02.03': { icon: 'icon-feixianzhixing', name: '非限制使用级抗菌药物' }  // 非限制使用级抗菌药物
}
