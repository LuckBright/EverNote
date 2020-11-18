/* eslint-disable */
import api from '../store/dispensingcommonapi'
import hospitalApi from '../store/hospitalapi'
export default {
  data () {
    return {
      testResult: [],
      outTest: true
    }
  },
  methods: {
    initData () { // 初始化数据
      this.testResult = []
      this.outTest = true
    },
    getOutPatientSkinTest (id) {
      this.initData()
      if (!id) return // 金祥说备药管理处方发药切换院内发药会出现visitSn 传空的情况
      api.getOutPatientSkinTest({ visitSn: id }).then(res => {
        if (res && res.length) {
          this.testResult = res
          this.outTest = true
        } else {
          this.outTest = false
          this.testResult = []
        }
      })
    },
    getUddSkinTest (id) {
      this.initData()
      hospitalApi.getUddSkinTest({hospitalizedNumber: id}).then(res => {
        if (res && res.length) {
          this.testResult = res
          this.outTest = true
        } else {
          this.outTest = false
          this.testResult = []
        }
      })
    }
  }
}
