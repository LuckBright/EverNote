import rcm from '../api'
import axiost from '@/insurance/store/api'

function printByTemplate (params) { // 查看即将要打印的票据号
  return rcm.post('/bill/userOutRecord/printByTemplate', params)
}
function getCodeInfo (params) { // 查看即将要打印的票据号
  return axiost.get('/platform-extend/base/print/vt/listPage?pagesize=20&code=' + params.code)
}
export default {
  getCodeInfo,
  printByTemplate
}
