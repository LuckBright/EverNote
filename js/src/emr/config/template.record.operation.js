import { request } from '@/util/req'
class TemplateRecord {
  constructor (vueInstance) {
    this.vm = vueInstance
  }
  async add (url, params, callback) {
    let addRes = await request(url, params)
    if (addRes.head && addRes.head.errCode === 0) {
      this.vm.$messageTips(this.vm, 'success', '新建成功', '提示')

      callback(addRes.data)
    }
  }
  async edit (url, params, callback) {
    // this._checkDocData(true)
    let editRes = await request(url, params)
    if (editRes.head && editRes.head.errCode === 0) {
      this.vm.$messageTips(this.vm, 'success', '更新成功', '提示')
      callback(editRes.data)
    }
  }
  delete (url, id, callback) {
    this.vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      request(url, {
        id: id
      }).then(res => {
        if (res.head.errCode === 0) {
          // this.vm.$emit('deleteSuccess', this.recordData.id)
          this.vm.$messageTips(this.vm, 'success', '删除成功', '提示')
          callback(res.data)
        }
      })
    })
  }
  get () {

  }
}
class DocRecordTemplate extends TemplateRecord {
  constructor (vueInstance) {
    super(vueInstance)
    this.params = null
  }
  requestParams (params) {
    this.params = JSON.parse(JSON.stringify(params))
    // console.log('html', this.vm.getHtml())
    // console.log('schema', this.vm.getSchema())
    this.params.formTemplateReq = {
      designerId: params.designerId,
      templateId: params.formTemplateId,
      schema: {
        templateName: params.name,
        element: this.vm.getHtml(),
        editable: true,
        formTemplateId: params.formTemplateId,
        pageSettings: this.vm.getSchema().pageSettings
      }
    }
    // delete this.params.formDataId // 文档保存不需要formDataId
     // if (params.formTemplateReq.schema.pageSettings) {//字体相关的逻辑
      //   for (const key in this.isGlobal) {
      //     if (this.isGlobal.hasOwnProperty(key) && this.isGlobal[key]) {
      //       delete params.formTemplateReq.schema.pageSettings[key]
      //     }
      //   }
      // }

    return this
  }
  save (command, url, callback) {
    if (command === 'create') {
      // console.log('文档新建参数', this.params)
      this.params.formTemplateId = null
      this.params.formTemplateReq.templateId = null
      this.params.formTemplateReq.schema.formTemplateId = null

      return this.add(url, this.params, callback)
    } else {
      // console.log('文档保存参数', this.params)
      return this.edit(url, this.params, callback)
    }
  }
}
class FormRecordTemplate extends TemplateRecord {
  constructor (vueInstance) {
    super(vueInstance)
    this.params = null
  }
  requestParams (params) {
    this.params = JSON.parse(JSON.stringify(params))
    this.fromInfo = this.vm.getFormInfo()
    this.fromInfo.formTpl.schema.templateName = params.name
    this.params.formTemplateReq = this.fromInfo.formTpl
    if (this.vm.$refs.template_form) {
      this.params.formDataReq = {
        data: this.fromInfo.formData,
        formTemplateId: this.params.formTemplateId,
      }

      if (this.params.formDataId) this.params.formDataReq.id = this.params.formDataId
      if (this.params.formDataReq.data && this.params.formDataReq.data.hasOwnProperty('undefined')) {
        delete this.params.formDataReq.data['undefined']
      }
    }
    return this
  }
  save (command, url, callback) {
    if (command === 'create') {
      // console.log('表单新建参数', this.params)
      this.params.formTemplateId = null
      this.params.formTemplateReq.templateId = null
      this.params.formTemplateReq.schema.formTemplateId = null
      return this.add(url, this.params, callback)
    } else {
      // console.log('表单保存参数', this.params)
      return this.edit(url, this.params, callback)
    }
  }
}

export {
  DocRecordTemplate,
  FormRecordTemplate
}
