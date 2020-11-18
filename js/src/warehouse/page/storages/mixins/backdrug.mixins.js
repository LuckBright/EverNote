/**
 * 退药  common方法
*/
import { DISPENSING_STATUS } from '@/util/common'
export default {
  computed: {
    // 退药状态
    backStatusOptions () {
      let tempStatusData = DISPENSING_STATUS.filter(v => {
        return v.id > 7 || v.id < 2
      })
      return tempStatusData
    }
  }
}
