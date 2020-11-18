// 批次定价配置实时查询
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import { throttle } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  data () {
    return {
      isBatch: false // 默认关闭
    }
  },
  created () {
    this.updateBatch()
  },
  activated () {
    this.updateBatch()
  },
  methods: {
    updateBatch: throttle(function () {
      storageroomapi.selectSystemSettingByClinicId().then(res => {
        if (res) {
          this.isBatch = Boolean(res.pricingModel)
        }
      })
    }, 1000),
  },
  watch: {
    '$route' (val) {
      this.updateBatch()
    }
  },
}
