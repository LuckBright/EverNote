import storage from '@/util/storage'
import { DATA_SOURCE, DISPENSE_SETTING_ISFLAG } from '@/util/common'
import { _findIndex } from '@/util/formcustom'
import setName from '@/util/setstatusname'
export default {
  mixins: [setName],
  data () {
    return {
      // configData: [],
      searchName: '',
      dataSource: '',
      status: '',
      termType: '',
      configObj: {}
    }
  },
  created () {
    // 设置发药来源（门诊或者住院）
    let dataSource = ''
    if (this.$route.path.indexOf('/storages/dispensingclinic') > -1) dataSource = DATA_SOURCE[0].id
    if (this.$route.path.indexOf('/storages/dispensinghospital') > -1) dataSource = DATA_SOURCE[1].id
    this.dataSource = dataSource
    // 配置
    storage.setLocalStorage('DATA_SOURCE', dataSource)
  },
  methods: {
    handleSearch () {
      if (this.hospitalQuery === 3) storage.removeLocalStorage('HOSPITAL_QUERY')
      if (this.status || this.termType) {
        this.termType = this.status = ''
      } else {
        this.leftId = this.$route.query.id
        this.getUddList && this.getUddList()
        this.getSpaceList && this.getSpaceList()
        this.getDispenseCodesList && this.getDispenseCodesList()
      }
    }
  },
  // watch: {
  //   '$store.state.dispensing.storageConfig': {
  //     handler: function (data) {
  //       data.forEach(item => {
  //         this.configObj[item.type] = item.value
  //         this.configData.push({
  //           id: item.type,
  //           name: this.setName(DISPENSE_SETTING_ISFLAG, item.type),
  //           type: DISPENSE_SETTING_ISFLAG[_findIndex(DISPENSE_SETTING_ISFLAG, item.type)].type
  //         })
  //       })
  //     },
  //     deep: true
  //   }
  // }
  computed: {
    // 获取vuex发药配置数据
    configData () {
      let arr = []
      this.$store.state.dispensing.storageConfig.forEach(item => {
        this.configObj[item.type] = item.value
        arr.push({
          oldId: item.id,
          id: item.type,
          name: this.setName(DISPENSE_SETTING_ISFLAG, item.type),
          type: DISPENSE_SETTING_ISFLAG[_findIndex(DISPENSE_SETTING_ISFLAG, item.type)].type
        })
      })
      return arr
    }
  }
}
