export default {
  data () {
    return {
      druglabelZn: [] // 药签中文数据
    }
  },
  methods: {
    zzPrint () {
      const DOMS = [
        {
          parentId: '#drugLabel100_40',
          settingsId: '卓正药签'
        },
        {
          parentId: '#drugLabel50_30',
          stttingsId: '卓正客户标签'
        },
        {
          parentId: '#zzDrugLabel_Zn100_40',
          stttingsId: '药签中文'
        },
        {
          parentId: '#zzDrugLabel_Cn100_40',
          stttingsId: '药签英文'
        }
      ]
      this.$refs.jcpPrint.zzPrint(DOMS)
    }
  }
}
