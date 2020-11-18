import receiptPrintApi from '@/rcm/store/outpatient/common.receipt.printing.api'
import { everprint } from '@/util/print.js'
var receiptPrint = {
  data () {
    return {
      receiptPrintApi,
      info: {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: null, // 打印成功的回调
        billPrintCall: null, // 没有关联模版走老票据打印的回调
        code: '', // 模版code
        everPrintParams: null, // everprint打印方法传参
        settlementId: '', // settlementid
        printType: '', // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: '' // 按钮类型 1打印 2重打 3补打
      },
      receiptPrintParams: {},
      ver: ''
    }
  },
  methods: {
    async receiptPrint (info) {
      Object.assign(this.info, info)
      let codeValInfo = {}
      let codeInfo = await receiptPrintApi.getCodeInfo({ code: this.info.code }) // 获取code对应模版当前启用的版本号
      if (codeInfo && codeInfo.viewTemplates.length > 0) {
        codeValInfo = (codeInfo.viewTemplates).find(item => { return item.code === this.info.code })
      }
      this.ver = codeValInfo.ver
      this.receiptPrintParams = {
        settlementId: this.info.settlementId,
        code: this.info.code,
        requestType: this.info.btnType,
        onlyShow: true,
        ver: codeValInfo.ver,
        type: this.info.printType
      }
      if (!this.info.everPrintParams) { // 假如没传该参数，默认使用调发票数据详情的参数
        this.info.everPrintParams = this.receiptPrintParams
      }
      if (this.info.getParams && typeof this.info.getParams === 'function') {
        this.info.getParams(this.info.everPrintParams)
      }
      this.receiptPrintBtn()
    },
    receiptPrintBtn () {
      let val = ''
      if (this.info.btnType === 1) {
        this.getCorrelation()
        return
      } else if (this.info.btnType === 2) {
        val = '当前票号和票据需一致，是否打印？'
      } else {
        val = '补打需作废原票，是否打印？'
      }
      this.$confirm(val, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getCorrelation()
      })
    },
    getCorrelation () { // 查询是否关联此code模版,没关联调老收据打印，关联则提示本次要打票据号
      receiptPrintApi.printByTemplate(this.receiptPrintParams).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data.length === 1 && rs.data[0]['requestType'] === -1) { // 未关联走老收据打印
            if (typeof this.info.billPrintCall === 'function') {
              this.info.billPrintCall()
            }
          } else { // 已经关联
            this.receiptPrintBill(rs)
          }
        }
      })
    },
    receiptPrintBill (rs) {
      let billCodes = rs.data.map(item => { return item.billCode })
      let val = `请插入号码是[${billCodes.join(',')}]的发票`
      this.$alert(val, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'cancel') return
          everprint(this.info.code, this.info.everPrintParams, {
            preview: true,
            cb: () => {
              if (this.info.isPrintSuccess) {
                this.printSuccess()
              } else {
                if (typeof this.info.printSuccessCall === 'function') {
                  this.info.printSuccessCall()
                }
              }
            }
          })
        }
      })
    },
    printSuccess () { // 默认的打印回调，修改发票号状态，改为已经打印
      let params = {
        settlementId: this.info.settlementId,
        code: this.info.code,
        requestType: this.info.btnType,
        onlyShow: false,
        type: this.info.printType
      }
      receiptPrintApi.printByTemplate(params).then(rs => {
        if (rs.head.errCode === 0) {
          if (typeof this.info.printSuccessCall === 'function') {
            this.info.printSuccessCall()
          }
        }
      })
    }
  },
  async created () {
  }
}

export default receiptPrint
