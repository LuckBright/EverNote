import moment from 'moment'

export default {
  formatDate (row, column) {
    var date = row[column.property]
    if (date === undefined) {
      return ''
    }
    return moment(date).format('YYYY-MM-DD')
  },
  formatBoolean (row, column) {
    var val = row[column.property]
    if (val === undefined) {
      return ''
    } else {
      return val ? '是' : '否'
    }
  },
  formatYesno (val) {
    if (val) {
      return '是'
    } else {
      return '否'
    }
  },
  formatMoney (row, column, n) {
    var money = row[column.property] || 0
    if (!n) {
      n = 2
    }
    n = n > 0 && n <= 20 ? n : 2
    money = parseFloat((money + '').replace(/[^\d.]/g, '')).toFixed(n) + ''
    var l = money.split('.')[0].split('').reverse()
    var r = money.split('.')[1]
    var t = ''
    for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
    }
    return t.split('').reverse().join('') + '.' + r
  },
  formatDiscount (row, column) {
    let data = row[column.property]
    if (data) {
      return (data / 10).toFixed(1) + ' 折'
    } else {
      return '--'
    }
  },
  formatPay (row, column) {
    let val = row[column.property]
    let key = {
      1: '现金',
      2: '刷卡',
      3: '支付宝',
      4: '微信'
    }
    return key[val]
  },
  formatTransaction (row, column) {
    let val = row[column.property]
    let key = {
      1: '充值',
      2: '消费',
      3: '提现',
      4: '转卡转入',
      5: '转卡转出',
      6: '退费',
      7: '提现手续费'
    }
    return key[val]
  },
  getDptText (id) {
    if (!window.sessionStorage.getItem('THC_CC_DPT')) {
      return '--'
    }
    let dptList = JSON.parse(window.sessionStorage.getItem('THC_CC_DPT'), true)
    let dpt = dptList.filter(rs => {
      return rs.id === id
    })
    return dpt.length > 0 ? dpt[0].name : '--'
  }
}
