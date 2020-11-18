// 库房预警api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'inventoryWarning/'

// 库存预警导出
function exportExcel (params) {
  return axios.post(url + 'exportExcel/', params)
}

async function list (params) {
  return await axios.post(url + 'queryInventoryWarningList/', params)
    .then((response) => {
      if (!response.list) {
        return {
          warningType: response.type,
          list: []
        }
      } else {
        return {
          warningType: response.type,
          list: response.list,
          totalCount: response.totalCount
        }
      }
    })
}

export default {
  list,
  exportExcel
}
