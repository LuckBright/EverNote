const keyValueText = {
  methods: {
    statusText (key) {
      const textObj = {
        0: '待执行',
        1: '进行中',
        2: '已完成',
        3: '已终止',
        5: '已过期',
        6: '已取消',
        7: '未分配'
      }
      return textObj[key]
    },
    feedbackStatusText (key) {
      const textObj = {
        0: '待发送',
        1: '已发送',
        2: '已反馈',
        3: '未绑定',
        4: '发送失败'
      }
      return textObj[key]
    },
    subsequentVisitText (key) {
      const unknown = -1
      const textObj = {
        [unknown]: '未知',
        0: '初诊',
        1: '复诊',
        2: '转诊',
        3: '急诊',
        4: '体检',
        5: '简易',
        6: '疫苗',
        7: '团队体验'
      }
      if (textObj[key]) {
        return textObj[key]
      } else {
        return ''
      }
    },
    sampleStatus (key) {
      const textObj = {
        '20': '已打印',
        '30': '已采集',
        '35': '已配送',
        '45': '已签收',
        '50': '检验中',
        '60': '已完成'
      }
      return textObj[key]
    }
  }
}

export default keyValueText
