
import QuoteDoc from './quotedoc.js'
import QuoteForm from './quoteform.js'
export default class Quote {
  constructor (vue) {
    this.$vue = vue
    this.quoteDoc = new QuoteDoc()
    this.quoteForm = new QuoteForm()
  }
  quoteFromForm ({designerId, quoteInfo}) {
    let obj = {}
    if (Number(designerId) === 1) { // 表单定向引入
      obj = this.quoteForm.directedQuote(quoteInfo)
      this.$vue.$bus.$emit('quote', obj)
    } else { // 文档聚焦引入
      obj = this.quoteForm.focusQuote(quoteInfo)
      this.$vue.$bus.$emit('ref:append', obj)
    }
  }
  quoteFromDoc ({designerId, quoteInfo}) {
    let obj = null
    if (Number(designerId) === 1) { // 表单定向引入
      obj = this.quoteDoc.directedQuote(quoteInfo)
      this.$vue.$bus.$emit('quote', obj)
    } else { // 文档聚焦引入
      obj = this.quoteDoc.focusQuote(quoteInfo)
      this.$vue.$bus.$emit('ref:append', obj)
    }
  }
}
