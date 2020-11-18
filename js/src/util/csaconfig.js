// import api from '@/inpatient/store/resident'
// import {frPrint} from '@/util/print'

/**
 * 判断是否为空
 * @param str
 * @returns {string}
 */
export const hospitalPatientStatus = {
  1: '商业保险应收单',
  2: '医疗保险应收单'
}

/**
 * 判断是否为空
 * @param http://doc.everjiankang.com/pages/viewpage.action?pageId=24579636
 * @returns {string}
 */
// export const WAN_DAI_DA_YIN = async (obj, code) => {
//   let res = await api.wristbandManage(obj)
//   console.log(res)
//   if (res) {
//     frPrint(// 腕带打印
//       code, {
//         id: res.data.id
//       }
//     )
//   }
// }
