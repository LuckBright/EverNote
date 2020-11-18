import { floatTool } from '@/util/common'
import { hljmedicalSettle, warningPreSettle } from '@/rcm/store/otmdiscomponent/hlj-api.js'
export default {
  methods: {
    // 慢病确定之后，触发预分解
    hljybSpecialDisSure (val) {
      // 有慢病的话，将医疗类别带过来
      this.medicalType = val
      this.obj.personInfo.hljMedicalType = this.medicalType
      this.handleSettleClick(true).then(data => {
        this.handleHljNext(data)
      }, err => {
        console.log('err', err)
        this.afterReadCard = false
      })
    },
    // 黑龙江获取慢病
    getHljSpecialDisList () {
      // let params = {
      //   personalNo: this.obj.personInfo.personalNo,
      //   // 医疗类别（121-门诊慢性病 122-门诊特殊疾病(省直时没有122)）
      //   medicalCareType: '121',
      //   insuranceOrgId: this.insuranceOrgId,
      //   macId: this.macId
      // }
      // specialDisQuery(params).then(res => {
      //   // 如果有慢病提示，就显示慢病提示
      //   let result = res.data
      //   if (result && result.length > 0) {
      //     this.specialDisList = result
      //     this.specialDis = true
      //   } else {
      // 没有慢病就直接预结算
      this.handleSettleClick(true).then(data => {
        this.handleHljNext(data)
      }, err => {
        console.log('err', err)
        this.afterReadCard = false
      })
      // }
      // }, err => { console.log('err', err) })
    },
    // 黑龙江医保分解
    hljybMedicalSettle () {
      let params = {
        macId: this.macId,
        insuranceOrgId: this.insuranceOrgId,
        icCardPassword: this.obj.personInfo.password,
        icCard: this.obj.personInfo.icCard,
        settlementId: this.obj.id,
        personalNo: this.obj.personInfo.personalNo,
        hljMedicalType: this.medicalType, // 医疗类别
        personInfo: this.obj.personInfo // 整个读卡对象
      }
      hljmedicalSettle(params).then(res => {
        this.$router.push({
          path: '/rcm/reconstruct/settled',
          query: {
            settlementid: this.obj.id,
            showDetail: 0,
            visitNumber: this.obj.rootorderid,
            dptId: this.obj.orderDept,
            patientId: this.obj.patientid,
            time: Date.now()
          }
        })
      }, err => {
        console.log('err', err)
      })
    },
    // 预分解之后黑龙江医保的跳转
    handleHljNext (data) {
      // 新增黑龙江医保的逻辑，没超出预警留在本页
      if (data.settlement.warningStatus === -1) {
        this.afterReadCard = true
        // 计算应付金额
        this.obj.unFee = floatTool.subtract(
          this.obj.totalFee,
          floatTool.add(
            this.obj.medInsurPubPayFee || 0, // 减去医保报销费用
            this.obj.medInsurOwnPayFee || 0 // 减去医保个人付费
          )
        )
      } else {
        // 否则跳转到已结算
        this.$router.push({
          path: '/rcm/reconstruct/settled',
          query: {
            settlementid: data.settlement.id,
            showDetail: 0,
            visitNumber: data.settlement.rootorderid,
            dptId: data.settlement.orderDept,
            patientId: data.settlement.patientid,
            time: Date.now()
          }
        })
      }
    },
    // 黑龙江医保的预警预分解
    hljPreWarningSettle () {
      console.log('this.obj.id', this.obj.id)
      let params = {
        settlementId: this.$route.query.settlementid || this.obj.id,
        macId: this.macId
      }
      warningPreSettle(params).then(res => {
        console.log('预分解')
        this.afterReadCard = true
      }, err => {
        console.log('err', err)
      })
    }
  },
}
