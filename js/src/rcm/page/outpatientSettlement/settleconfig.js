/*
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-09-19 11:12:01
 */
import { floatTool, debounce } from '@/util/common'
function formatToFinacial (money, n) {
  if (!money && money !== 0) {
    return ''
  }
  money = parseFloat(money)
  let absicon = ''
  if (parseFloat(money) !== Math.abs(money) && money !== Math.abs(money) && money !== 0 && money !== '0.00') {
    absicon = '-'
  }
  if (n === 0) {
    money = parseFloat((money + '').replace(/[^\d.]/g, '')) + ''
  } else {
    if (!n) {
      n = 2
    }
    n = n > 0 && n <= 20 ? n : 2
    let arr = String(money).split('.')
    if (arr[1]) {
      if (arr[1].substring(n) && arr[1].substring(n) === '5') {
        money = money > 0 ? parseFloat(arr[0] + '.' + arr[1].substring(0, n)) + parseFloat(Math.pow(0.1, n).toFixed(n)) : parseFloat(arr[0] + '.' + arr[1].substring(0, n)) - parseFloat(Math.pow(0.1, n).toFixed(n))
      } else {
        money = money.toFixed(n)
      }
    } else {
      money = money.toFixed(n)
    }
    money = parseFloat((money + '').replace(/[^\d.]/g, '')).toFixed(n) + ''
  }
  var l = money.split('.')[0].split('').reverse()
  var r = money.split('.')[1] ? money.split('.')[1] : '00'
  var t = ''
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  let returnResult = t.split('').reverse().join('') + '.' + r
  if (returnResult === '0.00') {
    absicon = ''
  }
  return absicon + t.split('').reverse().join('') + '.' + r
}

// floatTool.add(a,b)相加 floatTool.subtract(a,b)相减 floatTool.multiply(a,b)相乘
// floatTool.divide(a,b)相除
export const tableconfig = [
  // {   slotName: 'codeCol',   index: [0, 3, 4, 5, 6, 1, 2, 7] }, {
  {
    slotName: 'itemname',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  },
  {
    prop: 'spec',
    label: '规格',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    slotName: 'quantity',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    prop: 'prePrice',
    label: '单价',
    align: 'right',
    formatter: ({ value }) => {
      return formatToFinacial(value, 2)
    },
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    prop: 'preFee',
    label: '金额',
    align: 'right',
    formatter: ({ value }) => {
      return formatToFinacial(value, 2)
    },
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    slotName: 'adviceStatus',
    // label: '执行状态',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    slotName: 'mealFlag',
    index: [0, 3, 4, 5, 6]
  }, {
    prop: 'chargeLevelStr',
    label: '医保',
    index: [1]
  }, {
    slotName: 'useInsurance',
    index: [2]
  }, {
    slotName: 'useInsuranceDiscount',
    index: [2]
  }, {
    slotName: 'majorAccount',
    index: [7]
  }, {
    slotName: 'majorAccountDiscount',
    index: [7]
  }, {
    slotName: 'discount',
    index: [0, 3, 4, 5, 6]
  }, {
    prop: 'feeAfterBenefit',
    label: '折后金额',
    align: 'right',
    formatter: ({ value }) => {
      return formatToFinacial(value, 2)
    },
    index: [0, 3, 4, 5, 6]
  }, {
    slotName: 'comInsuranceRemarks',
    // label: '备注',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    prop: 'freeReason',
    label: '免单原因',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }, {
    slotName: 'data',
    index: [0, 3, 4, 5, 6, 1, 2, 7]
  }
]
// 除了自费结算进行中的状态 0, '自费结算' 1, '医保结算' 2, '商保结算' 3, '待付款' 4, '已付款' 5, '待退费' 6, '已退费' 7, '大客户结算'
export const previousButton = [0, 2, 7]
export const singleConfig = [1, 2, 7]
export const multiConfig = [0, 3, 4, 5, 6]
// 计算商保报销比例金额 计算规则 报销金额=商报报销+医保报销+大客户报销 优惠金额=折扣+营销工具 总金额=报销金额+优惠金额+应付金额
export const computedInsurance = debounce((arr, obj) => {
  obj.freetmoney = 0
  if (obj.settleStatus === 1) {
    obj.exefee = 0
    obj.medInsurPubPayFee = 0
    obj.medInsurOwnPayFee = 0
  }
  // obj.comInsuranceBenefitFee = 0
  if (obj.settleStatus === 2) {
    // 商保报销金额
    obj.comInsuranceDirectFee = 0
    // 商保项目合计
    obj.insuranceTotalfee = 0
  }
  if (obj.settleStatus === 7) {
    // 大客户报销金额
    obj.majorAccountFee = 0
    // 大客户合计
    obj.majorTotalfee = 0
  }
  // 总额
  obj.totalFee = 0
  arr.reduce((total, cur) => {
    cur.recipeDetails.map(v => {
      // 计算商保逻辑
      if (v.useInsurance && obj.settleStatus === 2) {
        // 当前阶段是商保，但是是重收的
        if (obj.recollect) {
          v.useInsuranceDiscount = obj.recRate
        }
        // 免单不涉及商保医保金额计算
        if (v.freeSheet !== 1) {
          // 在加的过程中，就不在toFixed(2)了会导致不太准确，到加完了一并精确两位
          obj.comInsuranceDirectFee = floatTool.add(obj.comInsuranceDirectFee, floatTool.multiply(floatTool.multiply(v.prePrice, v.quantity), (v.useInsuranceDiscount
            ? floatTool.divide(v.useInsuranceDiscount, 100)
            : 0)))
          obj.insuranceTotalfee = floatTool.add(obj.insuranceTotalfee, floatTool.multiply(v.prePrice, v.quantity))
        }
      }
      // 计算大客户逻辑
      if (v.majorAccount && obj.settleStatus === 7) {
        // 免单不涉及商保医保金额计算
        if (v.freeSheet !== 1) {
          obj.majorAccountFee = floatTool.add(obj.majorAccountFee, floatTool.multiply(floatTool.multiply(v.prePrice, v.quantity), (v.majorAccountDiscount
            ? floatTool.divide(v.majorAccountDiscount, 100)
            : 0)))
          obj.majorTotalfee = floatTool.add(obj.majorTotalfee, floatTool.multiply(v.prePrice, v.quantity))
        }
      }
      if (v.freeSheet === 1) {
        // 免单金额
        obj.freetmoney = floatTool.add(obj.freetmoney, floatTool.multiply(v.prePrice, v.quantity))
      }
      obj.totalFee = floatTool.add(obj.totalFee, floatTool.multiply(v.prePrice, v.quantity))
    })
  }, 0)
  if (obj.settleStatus === 2) {
    // 这里算完比例之后，统一精确到两位
    obj.recRate = obj.insuranceTotalfee === 0
      ? ''
      : (floatTool.multiply(100, (floatTool.divide(Number(obj.comInsuranceDirectFee), Number(obj.insuranceTotalfee))))).toFixed(2)
    obj.comInsuranceDirectFee = obj.comInsuranceDirectFee.toFixed(2)
    obj.insuranceTotalfee = obj.insuranceTotalfee.toFixed(2)
  }
  if (obj.settleStatus === 7) {
    // 如果总额为0，0/0会报NAN
    obj.reimburseRate = obj.majorTotalfee === 0
      ? ''
      : (floatTool.multiply(100, (floatTool.divide(obj.majorAccountFee, obj.majorTotalfee)))).toFixed(2)
    obj.majorAccountFee = obj.majorAccountFee.toFixed(2)
    obj.majorTotalfee = obj.majorTotalfee.toFixed(2)
  }
  // obj.totalBenefit = 0 // 优惠金额只有自费阶段才有
  if (obj.recollect) {
  } else if (obj.settleStatus === 2 || obj.settleStatus === 7) {
    // if (obj.settleStatus === 2 || obj.settleStatus === 7) {
    if (obj.comInsuranceBenefit) {
      obj.totalBenefit = floatTool.add(obj.freetmoney, obj.comInsuranceBenefitFee)
    } else {
      obj.totalBenefit = obj.freetmoney
    }
  }
  obj.unFee = floatTool.subtract(obj.totalFee,
    floatTool.add(floatTool.add(floatTool.add(obj.comInsuranceDirectFee, obj.majorAccountFee), obj.totalBenefit), obj.exefee)
  )
}, 300)
export const getstatus = (activestatus) => {
  const actions = new Map([
    [0, ['开立']],
    [1, ['已提交']], // 其他地方叫待审核，门诊叫已提交
    [2, ['驳回']],
    [3, ['未发药']], // 其他地方叫待发药，门诊叫未发药
    [4, ['待执行']],
    [5, ['已执行']],
    [6, ['停止']],
    [7, ['撤回']],
    [8, ['有报告']],
    [9, ['报告未出']],
    [10, ['执行中']],
    [11, ['已作废']],
    [12, ['预停状态']],
    [20, ['已打印']],
    [30, ['已采集']],
    [40, ['已签收']],
    [50, ['检验中']],
    [60, ['已完成']],
    [70, ['发药异常']],
    [100, ['预约']],
    [110, ['登记']],
    [120, ['检查完成']],
    [130, ['初步报告']],
    [140, ['审核报告']],
    [150, ['退药申请中']],
    [160, ['已退药']],
    [170, ['部分退药中']],
    [180, ['退药驳回']],
    [190, ['已发药']],
    [200, ['部分退药']],
    [210, ['已取消']],
    ['default', ['无']]
  ])
  let action = (actions.get(activestatus) && actions.get(activestatus)[0]) || actions.get('default')[0]
  return action
}
export const mousewheelevent = (event) => {
  event = event || window.event
  event.preventDefault()
}
export const limitInputValue = (value, that) => {
  let reg = /^100$|^(\d|[1-9]\d)(\.\d{1,2})*$/
  if (value < 0) {
    value = ''
  }
  if (!value.match(reg)) {
    that.$message({ message: '输入0-100之间的数字', type: 'warning' })
    value = ''
  }
  return value
}
