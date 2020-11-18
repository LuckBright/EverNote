import axios from '@/rcm/store/api'
const url = 'ar/summary'

function createOrUpdate (obj) {
  delete obj.name
  delete obj.organizationCode
  return axios.post(url + '/summaryData', obj).then((data) => {
    if (data.head && data.head.errMsg && data.head.errMsg === 'Success') {
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
  })
}

export default {
  createOrUpdate
}
