import { getMedicalOrgList } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import { GET_INSURANE_CENTER_LIST } from './types'

export default {
  async getMedicalOrgList ({ commit }) {
    let params = {
      corpType: '0', // 基本医疗保险
      offset: 0,
      page: 1,
      pagesize: 20
    }
    await getMedicalOrgList(params).then(res => {
      const data = res.data.map(item => ({ name: item.insuranceOrgCnName, id: item.id }))
      commit(GET_INSURANE_CENTER_LIST, data)
    })
  }
}
