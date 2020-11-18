import axios from '@/util/http'
import {isNull} from '@/util/common'
import {diction} from '@/store/common'

// let headers = {
//   'x-access-token': 'Vpmo6StxBJ7JIqXpBD4KNQBEOJMfdg/TQxT8upGmk+zXanea4c19jXMnE1c4SI2+iVN1fTIPStAb1e2uZKyMi9tHoC33CrzYDo5t/wguzPp4RpgpQxM7BIMIXYmXv4pzvKIWFLtcvTU8itU+FS3BwXXCHajbVgrjr7f8OYgkiNE=,P0spa2jfrsn1g0inMwtF+TQltEFseyu6zkt3O8sb9AAKWT+66uAALeg/yDsnOaBVrJXThQu19dXIjny5aUpQ59eZxk5tWrzKlnIhSlUHdcnAo54VoxZqxkDHJVJGhui1TvmgaTui31KLSImBZVREB5kHvSmcSZOL/h+99kmweGE=,XSX4EcXFAepqubQwqIhDOIAql7A0q+2GZTJbgMHdLRu8ADOCP/+vD8ikYh5CKIHGdb5iC+LQtvedoOygGTspmnyud5UtFFnhxXZQYRHSpwMwQnVZgaaSb89+OgCBuDvadKHEYdl15teEUrVQHpWNxNROjhh+KH6RwCAptvhD7f8=,cyfGWj9hJ09Bi3rmSPHHLo7dhQaqLacp90SYE8Tzth0ukTRKXWfoyJ5/hrmQ3+T9rGYtLEEDb35IZVl3C1e5x9ZNe7+VFsR8q2rtGoDQy4+Ew0DLNCa8lSU9fCotl/Qsa2VtOtjTadVezH7NPDUvKCb56tp7AEvEmaoZlTFWygY='
// }

const inpatientUrl = diction.api
let inpatient = axios.create({
  baseURL: inpatientUrl,
  withCredentials: true
  // headers
})

inpatient.interceptors.request.use(config => {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

inpatient.interceptors.response.use(function (response) {
  if (response) {
    if ((response.data && response.data.totalCount) || (response.data && response.data.data && typeof response.data.data.totalCount === 'number')) {
      return {
        totalCount: response.data.totalCount || response.data.data.totalCount,
        list: response.data.data.resultList || response.data.data
      }
    }
    if (response.data.head.errCode === 0) {
      let data
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          if (response.data.data.length) {
            data = response.data.data.resultList || response.data.data
            data = !isNull(data) ? data : true
          } else {
            data = null
          }
        } else {
          data = response.data.data.resultList || response.data.data
          data = !isNull(data) ? data : true
        }
      } else {
        data = true
      }
      return data
    } else {
      return null
    }
  }
})

inpatient.CancelToken = axios.CancelToken

export {inpatient}
