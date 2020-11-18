/**
 * 引入表单病历分为定向向表单引入和聚焦向文档引入
*/
export default class QuoteForm {
  constructor () {
    this.specialFields = ['ZD_MEN_ZHEN_ZHEN_DUAN', 'QT_FEI_YAO_WU_GUO_MIN', 'QT_YAO_WU_GUO_MIN']
  }
  filterHTMLTag (msg) {
    msg = msg.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
    msg = msg.replace(/[|]*\n/, '') // 去除行尾空格
    msg = msg.replace(/&npsp;/ig, '') // 去掉npsp
    return msg
  }
  directedQuote (quoteInfo) { // 表单=>表单引入
    let obj = {}
    obj[quoteInfo.row.name] = quoteInfo.metadata[quoteInfo.row.name]
    return obj
  }
  focusQuote (quoteInfo) { // 表单>文档
    let obj = {}
    if (this.specialFields.includes(quoteInfo.row.name)) { // 过敏和诊断需要结构化数据
      obj[quoteInfo.row.name] = quoteInfo.metadata[quoteInfo.row.name]
      return obj
    } else {
      return quoteInfo.metadata[quoteInfo.row.name]
    }
  }
}
