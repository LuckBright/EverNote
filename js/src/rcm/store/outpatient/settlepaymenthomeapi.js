
import api from '../api'

function info (params) {
  return api.post('ar/settlement/getCurrentDaySettleInfo', params).then(results => {
    return results
  })
}

export default {
  info
}
