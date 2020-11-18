import http from '@/util/http'
import { diction } from '@/store/common'
const transferAxios = http.create({baseURL: diction.api})
/* 将接口数据进行转化 使得新的接口返回的数据与老接口保持一致 2019-09-06 */
transferAxios.interceptors.response.use(function (response) {
  let result = response.data
  if (response.request.responseURL.includes('/thc-platform-core/tsOrganization/loadByStaffId')) {
    if (result.data && result.data.pageList) {
      result = {
        ...result,
        data: result.data.pageList.map(item => ({
          ...item,
          orgId: item.id,
        })),
      }
    }
  }
  return result
})
export default transferAxios
