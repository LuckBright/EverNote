import { request } from '@/util/req'

const getDirectory = params => {
  try {
    return request('/platform-extend/classification/getDirectory', params)
  } catch (err) {
    return false
  }
}

export default {
  getDirectory
}
