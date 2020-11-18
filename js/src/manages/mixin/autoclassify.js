import classifyapi from '@/warehouse/page/groupmaterial/store/classifyapi'
import * as enumConfig from '@/util/warehouseconfig'
export default {
  data () {
    return {
      classifyId: '',
      classifyList: [],
      loop: true
    }
  },
  created () {
    let params = {
      'parentId': '',
      'level': enumConfig.CLASSIFY_CLASS[0].id
    }
    if (this.$route.path !== '/manages/personinfo') {
      this.getClassifyList(params)
    }
  },
  watch: {
    loop (b) {
      if (!b) {
        this.classifyId = this.classifyList[0].id
      }
    }
  },
  methods: {
    getClassifyList (params) {
      if (!params) {
        return console.log('请检查是否传递parentId和level')
      }
      this.loop = true
      let index = 0
      index = index++
      params.systemType = this.systemTypeObject.id // 外部props进来的枚举对象
      classifyapi.list(params).then(result => {
        if (Array.isArray(result) && result.length) {
          this.classifyList = result
          this.getClassifyList({
            parentId: result[0].id,
            level: enumConfig.CLASSIFY_CLASS[index].id
          })
        } else {
          this.loop = false
        }
      })
    },
  }
}
