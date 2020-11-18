import { warehouse as axios } from '@/warehouse/store/api'

const getClinicManageConfigForRecord = params => {
  try {
    return axios.post('/config/getClinicManageConfigForRecord/', params)
  } catch (err) {
    return false
  }
}

const getTreeNodesByClinicId = params => {
  try {
    return axios.post('/architecture/getTreeNodesByClinicId/', params)
  } catch (err) {
    return false
  }
}

const getLocalSectionVoListForService = params => {
  try {
    return axios.post('/localSectionRecord/getLocalSectionVoListForService/', params)
  } catch (err) {
    return false
  }
}

export default {
  getClinicManageConfigForRecord,
  getTreeNodesByClinicId,
  getLocalSectionVoListForService
}
