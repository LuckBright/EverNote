/**
 * 引入文档病历分为定向向表单引入和聚焦向文档引入
*/
export default class QuoteDoc {
  constructor () {
    this.specialFields = ['ZD_MEN_ZHEN_ZHEN_DUAN', 'QT_FEI_YAO_WU_GUO_MIN', 'QT_YAO_WU_GUO_MIN']
  }
  filterHTMLTag (msg) {
    msg = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
    msg = msg.replace(/[|]*\n/, '') // 去除行尾空格
    msg = msg.replace(/&npsp;/ig, '') // 去掉npsp
    msg = msg.replace(/\[|\]/g, '') // 去掉[]
    return msg
  }
  directedQuote (quoteInfo) { // 文档=>表单引入
    let obj = {}
      // 诊断和过敏需要特殊处理
    if (this.specialFields.includes(quoteInfo.key)) { // 过敏和诊断需要结构化数据
      obj[quoteInfo.key] = quoteInfo.html
    } else { // 去掉html标签，制引入文本
      obj[quoteInfo.key] = this.filterHTMLTag(quoteInfo.html)
    }
    return obj
  }
  focusQuote (quoteInfo) { // 文档=>文档
    let obj = {}
    if (this.specialFields.includes(quoteInfo.key)) { // 过敏和诊断需要结构化数据
      obj[quoteInfo.key] = quoteInfo.html
      return obj
    } else { // 带标签一起引入
      return quoteInfo.html
    }
  }
}
