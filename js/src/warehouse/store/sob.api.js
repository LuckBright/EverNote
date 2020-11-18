import { sob as axios } from '@/sob/store/api'

function getFrequency (frequencyCode) {
  return axios.post('frequency/getFrequencyByFrequencyCode/', { frequencyCode })
}

export default {
  getFrequency
}
