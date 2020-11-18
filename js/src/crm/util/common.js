import api from '@/crm/store/memberapi'

const isRepeat = function (val, tempObj) {
  if (!compareObj(val, tempObj) && compareObj(val, tempObj) !== undefined) {
    return false
  }
  let queryObj = {
    id: val.id || '',
    name: val.name || '',
    mobile: val.mobile || '',
    socialSecurityNo: val.socialSecurityNo || '',
    idNo: val.idNo || ''
  }
  return api.getRepeat(queryObj).then(rs => {
    return Promise.resolve(rs.data)
  })
}
const compareObj = function (val, newVal) {
  if ((val.name && val.name === newVal.name) || (val.mobile && val.mobile === newVal.mobile) || (val.socialSecurityNo && val.socialSecurityNo === newVal.socialSecurityNo) || (val.idNo && val.idNo === newVal.idNo)) {
    return false
  }
}
const validateMobile = function (val) {
  val = val.replace(/[^\d]/g, '').substr(0, 11)
  if (val.length <= 3) {
    return val
  } else if (val.length <= 7) {
    val = val.replace(/(\d{3})(\d{0,4})/, '$1-$2')
  } else {
    val = val.replace(/(\d{3})(\d{0,4})(\d{0,4})/, '$1-$2-$3')
  }
  return val
}
const STAFF_TYPE = [
  { id: 'DOCTOR', name: '医生' }
]

// pageType操作来源 1 会员管理，2 门诊预约 ，3 住院申请，4 住院办理，5 互联网医院，6 临时档 // 必传
const FILE_PAGE_TYPE = [
  { id: '1', name: '会员管理' },
  { id: '2', name: '门诊预约' },
  { id: '3', name: '住院申请' },
  { id: '4', name: '住院办理' },
  { id: '5', name: '互联网医院' },
  { id: '6', name: '临时档' }
]
export {
  isRepeat,
  compareObj,
  validateMobile,
  STAFF_TYPE,
  FILE_PAGE_TYPE
}
