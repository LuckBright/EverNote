// import { chronicBig } from '@/rcm/store/otmdiscomponent/jljh-api.js'
export default {
  methods: {
    // 慢病确定之后，触发预分解
    jljhybSpecialDisSure (val) {
      // 有慢病的话，将医疗类别带过来
      this.medicalType = val
      this.obj.personInfo.medicalType = this.medicalType
      this.handleSettleClick(false)
    },
    // 吉林蛟河获取慢病
    getJljhSpecialDisList () {
      // let params = {
      //   insuranceOrgId: this.insuranceOrgId,
      //   macId: this.macId,
      //   personno: this.obj.personInfo.personno
      // }
      // chronicBig(params).then(res => {
      //   // 如果有慢病提示，就显示慢病提示
      //   let result = res.data && res.data.infos
      //   if (result && result.length > 0) {
      //     this.specialDisList = result
      //     this.specialDis = true
      //   } else {
      // 没有慢病就直接预结算
      this.handleSettleClick(false)
      //   }
      // }).catch((err) => {
      //   console.log('err', err)
      // })
    }
  }
}
