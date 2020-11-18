import RegisterMoudle from '@/store/register.module.js'
import mutations from './mouations'
import actions from './actions'
import getters from './getters'
import { MedicalInsuranceCenter } from '@/healthinsurance/util/enum.js'

RegisterMoudle.install(MedicalInsuranceCenter, {
  state: {
    list: [] // 医保中心数据
  },
  actions,
  mutations,
  getters
})

