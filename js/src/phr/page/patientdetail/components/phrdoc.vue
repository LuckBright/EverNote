<template>
  <evereditor
    v-if="html"
    mode="editor"
    :html="html"
    :header.sync="header"
    :footer.sync="footer"
    :editable="false"
    :options="options"
    :page-settings="schemaObj.pageSettings">
  </evereditor>
</template>
<script>
import evereditor from 'evereditor'
import {request} from '@/util/req'
export default {
  props: ['dataId', 'templateId'],
  data () {
    return {
      html: '',
      header: '',
      footer: '',
      schemaObj: {},
      options: {
        paginate: this.$ever.getClinicConfig().MEDITOR_IS_PAGINATE === '1' ? !0 : !1
      }
    }
  },
  created () {
    request('thc-phr/cpoe/phrForm/getPhrFormById', {
      medicalRecordContentId: this.dataId,
      medicalRecordTemplateId: this.templateId
    }).then(result => {
      try {
        let data = JSON.parse(result.data.formData.formData)
        this.header = data.header || ''
        this.footer = data.footer || ''
        if (this.options.paginate) {
          this.html = data.text
        } else {
          this.html = `${this.header}${data.text}${this.footer}`
        }
      } catch (e) {

      }
      // this.html = result.data.formData.formData
      let settings = {}
      try {
        settings = JSON.parse(result.data.formTemplate.frontendSrcValue).pageSettings
      } catch (e) {
      }
      this.schemaObj = {pageSettings: settings}
    })
    // 根据 dataId 获取 html schemaObj
  },
  components: {
    evereditor
  }
}
</script>
<style scoped>
  /deep/ .ever__editor.medical .editor_content_wrap {
    padding: 10px;
    max-height: inherit;
  }
  /deep/ .ever__editor.medical .editor_content_wrap .editor__content {
    margin: 0;
  }
</style>
