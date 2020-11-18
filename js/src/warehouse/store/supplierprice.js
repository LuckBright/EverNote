import { warehouse as axios } from './api'
const url = 'localSetting/'

async function list (params) {
  return await axios.post(url + 'getLocalSettingBySearch/', params)
}

function naturelist (params) {
  return axios.post(url + 'getLocalSettingByNature/', params).then(result => {
    return result
  })
}

export default {
  list,
  naturelist
}
