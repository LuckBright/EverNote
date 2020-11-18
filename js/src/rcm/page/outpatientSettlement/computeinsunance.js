import { getPatientList, getPrint, computeBenefit, getRefundFee, getParamsMap, getPatientIdentity } from '@/rcm/store/outpatient/outpatient'
import { computedInsurance, multiConfig } from './settleconfig'
import { floatTool, debounce, objGet } from '@/util/common'
const insurancePrice = {
  data () {
    return {}
  },
  methods: {
    // 获取账单详情,参数配置，结算头部信息
    async getDetail (status) {
      let params = {
        patientID: this.$route.query.patientId,
        rootorderid: this.$route.query.visitNumber,
        // 正单传0负单传1
        returnFlag: this.$route.meta.status
      }
      this.obj.mergedReceiptData = []
      try {
        let paramsData = await getParamsMap()
        let [billData, billHead] = await Promise.all([getPatientList(params), getPatientIdentity(params)])
        if (params.returnFlag !== this.$route.meta.status) return // 拿到数据时判断获取的数据是不是应该时该页签的数据，解决待结算和待退费快速点击数据展示错误
        this.obj.parameters = paramsData.data
        this.obj.patientIdentity = billHead.data
        if (billData.master && !billData.master.returnFlag) {
          this.obj.settleStatus = this.obj.patientIdentity[0].sort
        }
        // 原实现代码 （用一个患者切换时，不会触发computed计算）
        // Object.assign(this.obj, { comInsuranceBenefit: false }, billData, billData.master)
        this.obj = Object.assign({}, this.obj, { comInsuranceBenefit: false }, billData, billData.master)
        // 账单也有一个id会和结算单id字段重复
        this.obj.id = ''
        if (status || (status === 0)) {
          this.obj.settleStatus = status
        }
        if (this.obj.settleStatus === 0 || this.obj.settleStatus === 5) {
          this.obj.mergedReceiptData.map(item => {
            item.recipeDetails.map(v => {
              v.discount = floatTool.multiply(v.discount, 100)
            })
          })
        }
        this
          .$bus
          .$emit('bill:obj', this.obj || {})
        setTimeout(v => {
          this.obj.multipleSelection = []
          // 是否默认选中所有账单受设置参数控制，0不选，1选中允许用户修改，2选中且不允许用户修改
          if (this.obj.parameters.recipe_checked === '1' || this.obj.parameters.recipe_checked === '2') {
            this.checked(this.obj.mergedReceiptData)
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 结算单
    async getPrintDetail (status) {
      this.obj.mergedReceiptData = []
      try {
        let params = {
          id: this.$route.query.settlementid || this.obj.id,
          forPrint: true
        }
        let paramsData = await getParamsMap()
        let [printData, printHead] = await Promise.all([getPrint(params), getPatientIdentity(params)])
        this.obj.parameters = paramsData.data
        this.obj.patientIdentity = printHead.data
        Object.assign(this.obj, printData.data)
        // 跳过则需要重新加载状态
        if (status || (status === 0)) {
          this.obj.settleStatus = status
        }
        this.$bus.$emit('bill:obj', this.obj || {})
        // 将自费折扣字段换算成100进制的
        if (multiConfig.includes(this.obj.settleStatus)) {
          this.obj.mergedReceiptData.map(item => {
            item.recipeDetails.map(v => {
              v.discount = floatTool.multiply(v.discount, 100)
            })
          })
        }
        this.$nextTick(v => {
          this.checked(this.obj.mergedReceiptData)
        })
      } catch (err) {

      }
    },
    checked (arr) {
      arr.map(v => {
        // 非补费
        if (!v.bufei || this.obj.settleStatus !== 1) {
          v.selected = true
          const table = objGet(this.$refs, 'outSettleTable.$refs.everTable.$refs.everTable', '')
          table && table.toggleRowSelection(v, true)
          // this.$refs && this.$refs.outSettleTable &&
          //   this.$refs.outSettleTable.$refs && this.$refs.outSettleTable.$refs.everTable && this.$refs.outSettleTable.$refs.everTable.$refs && this.$refs.outSettleTable.$refs.everTable.$refs.everTable && this.$refs.outSettleTable.$refs.everTable.$refs.everTable.toggleRowSelection(v)
        }
      })
    },
    getinsPrice () {
      // 当前商保则需要取商保价格
      if (!this.hasStatus(1) && this.obj.settleStatus === 2) {
        this
          .obj
          .mergedReceiptData
          .map(v => {
            v
              .recipeDetails
              .map(x => {
                if (x.freeSheet === 1) {
                  // 免单
                } else {
                  if (!this.obj.recollect) {
                    this.$set(x, 'useInsurance', true)
                  }
                }
              })
          })
        this.getInsurPrice()
      }
    },
    // 商保价格
    async getInsurPrice () {
      // 不再取价，直接计算就行
      // if (this.obj.recollect) {
      computedInsurance(this.obj.multipleSelection, this.obj)
      // } else {
      //   try {
      //     let priceObj = {
      //       orgId: localStorage.getItem('CLINICID'),
      //       itemList: [],
      //       scene: [(this.obj.settlementComInsurDetID && this.obj.settlementComInsurDetID.insurerId) || '']
      //     }
      //     this
      //       .obj
      //       .mergedReceiptData.forEach(v => {
      //         v.recipeDetails.forEach(k => {
      //           this.obj.getPriceJSON && this.obj.getPriceJSON.data && this.obj.getPriceJSON.data.forEach(x => {
      //             if (k.packageid === x.setId) {
      //               k.itemArray = x.itemArray
      //             }
      //           })
      //         })
      //       })
      //     this
      //       .obj
      //       .mergedReceiptData
      //       .map(v => {
      //         v
      //           .recipeDetails
      //           .map(x => {
      //             if (x.packageid) {
      //               priceObj
      //                 .itemList
      //                 .push({ setId: x.packageid, serviceType: 'set', itemArray: x.itemArray })
      //             } else {
      //               priceObj
      //                 .itemList
      //                 .push({ itemId: x.itemId })
      //             }
      //           })
      //       })
      //     if (priceObj.itemList.length <= 0) {
      //       return false // 收费项为空时，接口会报错
      //     }
      //     let data = await getPrice(priceObj)
      //     if (data && data.data) {
      //       this
      //         .obj
      //         .mergedReceiptData
      //         .map(v => {
      //           v.recipeDetails
      //             .map(x => {
      //               // 加急费不取价
      //               if (x.itemcode === 'jiajifei') {

      //               } else {
      //                 if (x.useInsurance) {
      //                   // 商保需要取商保价自费则取基准价
      //                   data.data.itemPriceList
      //                     .map(p => {
      //                       if (x.packageid) {
      //                         if (x.packageid === p.setId) {
      //                           x.prePrice = p.price
      //                           x.preFee = floatTool.multiply(x.prePrice, x.quantity)
      //                         }
      //                       } else {
      //                         if (x.itemId === p.itemId) {
      //                           x.prePrice = p.price
      //                           x.preFee = floatTool.multiply(x.prePrice, x.quantity)
      //                         }
      //                       }
      //                     })
      //                 } else {
      //                   x.prePrice = x.originalPrice
      //                   x.preFee = floatTool.multiply(x.prePrice, x.quantity)
      //                 }
      //               }
      //             })
      //         })
      //       computedInsurance(this.obj.multipleSelection, this.obj)
      //     }
      //   } catch (err) {
      //     console.log(err)
      //   }
      // }
    },
    // 自费阶段计算优惠金额
    computeBenefit (fn) {
      if (this.obj.recollect || this.obj.writeOff) {
        return
      }
      let useMedInsurance = ''
      let multipleSelection = JSON.parse(JSON.stringify(this.obj.multipleSelection))
      multipleSelection.map(item => {
        item.recipeDetails.map(v => {
          v.discount = floatTool.divide(v.discount, 100)
          useMedInsurance = v.useMedInsurance
        })
      })
      let params = {
        mergedReceiptData: multipleSelection,
        benefitInfo: Object.assign(this.obj.benefitInfo, {
          // 医保信息
          medInsurOwnPayFee: this.obj.medInsurOwnPayFee, // 医保自费金额
          medInsurPubPayFee: this.obj.medInsurPubPayFee, // 医保报销金额
          settlementId: this.obj.id,
          useMedInsurance: useMedInsurance, // 选一个就行了
          comInsuranceDirectFee: this.obj.comInsuranceDirectFee,
          comInsuranceBenefitFee: this.obj.comInsuranceBenefit ? this.obj.comInsuranceBenefitFee : 0,
          majorAccountFee: this.obj.majorAccountFee,
          // 以下三个参数原来是从$route.query中取的，原名是patientId,visitNumber,dptId
          // 由于页面加载时间较长，快速切换菜单导致从url拿数据拿不到
          patientId: this.obj.patientid,
          visitNumber: this.obj.rootorderid,
          deptId: this.obj.orderDept,
        }),
      }
      computeBenefit(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.obj.multipleSelection.map((item, index) => {
            item = Object.assign(item, res.data['mergedReceiptData'][index])
            item.recipeDetails.map(v => {
              v.discount = floatTool.multiply(v.discount, 100)
            })
          }) // 替换表格中内容，因为反算了各个明细中的折扣,直接大数组替换的话，选择状态会丢
          // 各种活动的优惠的反算
          Object.keys(this.obj.benefitInfo).map(key => {
            if (res.data.hasOwnProperty(key)) {
              this.obj.benefitInfo[key] = res.data[key]
            }
          })
          // 结算条上的各种金额
          // 计算规则
          // 报销金额=商报报销+医保报销+大客户报销
          // 优惠金额=折扣+营销工具
          // 总金额=报销金额+优惠金额+应付金额
          this.obj.totalFee = res.data.totalFee // 账单总金额
          // 大客户报销金额
          this.obj.totalBenefit = res.data.totalBenefit // 优惠金额
          this.obj.unFee = res.data.unFee // 应付
          this.obj.discounts = []
          this.obj.discounts = res.data.discounts
          this.obj.medSetFee = res.data.medSetFee
          if (fn && typeof fn === 'function') {
            this.$nextTick(_ => {
              fn()
            })
          }
        }
      }).catch(v => {
      })
    },
    computeRefundFee: debounce(async function () {
      try {
        let multipleSelection = JSON.parse(
          JSON.stringify(this.obj.multipleSelection)
        )
        multipleSelection.map(item => {
          item.recipeDetails.map(v => {
            v.discount = floatTool.multiply(v.discount, 100)
          })
        })
        let params = {
          mergedReceiptData: multipleSelection
        }
        let data = await getRefundFee(params)
        this.obj.totalFee = data.data.totalFee // 账单总金额
        // 大客户报销金额
        this.obj.totalBenefit = data.data.totalBenefit // 优惠金额
        this.obj.unFee = data.data.unFee // 应付
      } catch (err) {
        console.log(err)
      }
    }, 300),
    // 是否包含某项结算在内
    hasStatus (status) {
      return this.obj.patientIdentity.filter(v => v.sort === status && v.status === 1).length > 0
    }
  }
}
export default insurancePrice
