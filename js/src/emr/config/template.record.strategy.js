import {DocRecordTemplate, FormRecordTemplate} from '@/emr/config/template.record.operation.js'
export class RecordStrategy {
  constructor (vueInstance) {
    // 每次都需要初始化，还是刚开始就初始化了？
    this.doc = new DocRecordTemplate(vueInstance)
    this.form = new FormRecordTemplate(vueInstance)
  }
  initDesignerId (id) {
    if (Number(id) === 1) { // 根据designerId返回不同的实例
      return this.form
    } else {
      return this.doc
    }
  }
}
