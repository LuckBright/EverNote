/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-29 18:45:28
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-29 18:47:16
 */
import { MedicalInsuranceCenter } from '@/healthinsurance/util/enum.js'
import { createNamespacedHelpers } from 'vuex'
const mapHelpers = createNamespacedHelpers(MedicalInsuranceCenter)
// 只为了在使用时可以通过一个个方法导入
export const mapActions = mapHelpers.mapActions
export const mapState = mapHelpers.mapState
export const mapMutations = mapHelpers.mapMutations
export const mapGetters = mapHelpers.mapGetters
