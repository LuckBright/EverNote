import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  data () {
    return {
      sexOption: []
    }
  },
  created () {
    sysvalue.listOnce('GBT.2261.1').then(res => {
      if (res) {
        this.sexOption = res
      }
    })
  },
  methods: {
    makeSex (value) {
      let sex = ''
      this.sexOption.forEach(item => {
        if (item.code === value) {
          sex = item.name
        }
      })
      return sex
    }
  }
}
