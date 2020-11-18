<template>
  <div :class="{proof: proof}">
    <evereditor :class="{disabled: $route.meta.handleType === 1}"
                v-if="isCreate"
                :html="html"
                :data-loader="editable?dataLoader:null"
                :page-settings.sync="pageSettings"
                :header.sync="editorHeader"
                :footer.sync="editorFooter"
                :options="editorOpts"
                ref="editor"
                :editable.sync="editoreditable"
                mode="editor"
                @selectionHtml="selectionHtml"
                @contentUpdate="contentUpdate"
                :key="patientId"
                :is-updated.sync="editorIsUpdated"></evereditor>
  </div>
</template>
<script>
import evereditor from 'evereditor'
import api from '@/form/store/api'
import phrapi from '@/form/store/phrapi'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import { jcpPrintEditor, editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
import { MEDICAL_FONT_INFO } from '@/form/util/anamnesistype'
import jcp from 'jcpjs'
// import Vue from 'vue'
export default {
  props: ['visitId', 'patientId', 'dptId', 'schemaId', 'dataId', 'editable', 'schemaObj', 'source', 'proof', 'docUpdate', 'code'],
  components: {
    evereditor
  },
  data () {
    let pageSettings = {
      paperName: 'A4',
      paperWidth: 210,
      paperHeight: 297,
      portrait: true,
      visitType: '1',
      pagePadding: [10, 10, 10, 10]
    }
    return {
      html: '',
      docInfo: '', // 加载完成返回编辑器信息
      isCreate: false,
      editorHeader: '',
      editorFooter: '',
      editorOpts: {
        medicalInfo: {
          patientId: this.patientId,
          visitId: this.visitId,
          code: this.code
        },
        paginate: this.$ever.getClinicConfig().MEDITOR_IS_PAGINATE === '1' ? !0 : !1,
        suggestItems: [],
        suggestApi: {
          url: `${this.$ever.api}/form-engine/metaElementRichtext/getAllEchoNameWithValue`,
          params: {
            params: {
              patientId: this.patientId,
              visitId: this.visitId
            }
          }
        },
        templateItems: [],
        templateApi: {
          url: `${this.$ever.api}/medical-record/doctor/templateScope/getSmallTemplate`,
          params: {
            dptId: this.dptId
          }
        },
        copySettings: [],
        ...editorBaseOpts,
        ...MEDICAL_EDITOR_OPTIONS
      },
      pageSettings: (this.schemaObj && this.schemaObj.pageSettings) || JSON.parse(JSON.stringify(pageSettings)),
      editorIsUpdated: false
    }
  },
  created () {
    if (this.dataId && Number(this.dataId) !== -1) {
      this.getInstance()
    } else {
      this.getTpl()
    }
    this.visitType = this.$route.matched[0] && this.$route.matched[0].meta.type || '1'
    this.$bus.$on('saveEntry:obj', val => {
      if (this.$refs.editor) this.$refs.editor.insert(val, true)
    })
  },
  methods: {
    // 编辑器设置global环境字体信息
    async globalFontSettings (schema) {
      let params = {
        scope: 1,   // 0  集团  1  机构
        type: 5
      }
      let res = await request(urlMap.getConfig.getAll, params, 'post')
      if (res && res.data && res.data.length) {
        let fontInfo = res.data
        let obj = {}
        fontInfo.forEach(item => {
          switch (item.code) {
            case 'FONTSIZE':
              obj['font-size'] = Number(item.value)
              break
            case 'TYPEFACE':
              obj['font-family'] = item.value
              break
            case 'COPY_AND_PASTE':
              this.editorOpts.copySettings = JSON.parse(item.value).map(v => {
                v = String(v)
                return v
              })
              break
          }
        })
        MEDICAL_FONT_INFO.forEach(item => {
          if (!schema.pageSettings[item] && obj[item]) {
            schema.pageSettings[item] = obj[item]
          }
        })
      }
      return schema
    },
    getHtml () {
      return this.$refs.editor.getHtml()
    },
    getResetHtml () {
      return this.$refs.editor.getResetHtml()
    },
    getInputFlatData () {
      return this.$refs.editor.getAllFlatData()
    },
    contentUpdate () {
      // 读租户全局配置 是否自动保存
      let autoSaveGonfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
      let isAuto = autoSaveGonfig && autoSaveGonfig !== '0' && !isNaN(+autoSaveGonfig)
      if (this.editorIsUpdated && isAuto) {
        this.$bus.$emit('medicalAutoSave', true)
        this.$emit('contentUpdate', 'doc')
      }
    },
    async getInstance () {
      let result = await phrapi.getByRecordId4FormData(this.dataId)
      this.docInfo = result
      let data = result.data
      this.editorHeader = data.header || ''
      this.editorFooter = data.footer || ''
      if (!this.editorOpts.paginate) {
        this.html = `${this.editorHeader}${data.text}${this.editorFooter}`
      } else {
        this.html = data.text
      }
      await this.globalFontSettings(result.template.schema)
      this.pageSettings = result.template.schema.pageSettings
      // await this.getSuggestItems()
      this.isCreate = true
      setTimeout(_ => {
        this.$emit('finished', this.docInfo)
      }, 800)
    },
    async getTpl () {
      if (!this.schemaId) return
      let result = await api.getTpl(this.schemaId)
      if (result) {
        this.docInfo = result
        this.html = result.element
        await this.globalFontSettings(result)
        if (result.pageSettings) this.pageSettings = result.pageSettings
      }
      // await this.getSuggestItems()
      this.isCreate = true
      setTimeout(_ => {
        this.$emit('finished', this.docInfo)
      }, 800)
    },
    selectionHtml (val) {
      // this.$emit('selectionHtml', val)
      return this.$refs.editor.selectionHtml
    },
    dataLoader (columns) {
      return api.getMetaData(columns, this.patientId, this.visitId, this.visitType)
    },
    print (callback) {
      let printConfig = {}
      let html = this.getHtml()
      let doc = {
        dom: html,
        header: this.$refs.editor.editorHeader,
        footer: this.$refs.editor.editorFooter
      }
      jcpPrintEditor(this, printConfig, this.pageSettings, [doc], callback)
    },
    print1 () {
      var settings = {
        paperName: 'A4'
      }
      var myDoc = {
        documents: {
          pages: '<div id="page1" class="breakable">' + this.html + '</div>'
        },
        settings: settings,
        copyrights: '杰创软件拥有版权 www.jatools.com' //
      }
      jcp.getJCP().print(myDoc)
    },
    async getSuggestItems () {
      if (!this.patientId || !this.visitId) return
      let params = {
        patientId: this.patientId,
        visitId: this.visitId
      }
      try {
        let [suggestItems, templateItems] = await Promise.all([
          api.getAllEchoNameWithValue(params),
          phrapi.getSmallTemplate({ dptId: this.dptId })
        ])
        if (suggestItems && suggestItems.length) {
          this.editorOpts.suggestItems = suggestItems
        } else {
          this.editorOpts.suggestItems = []
        }
        if (templateItems && templateItems.length) {
          this.editorOpts.templateItems = templateItems
        } else {
          this.editorOpts.templateItems = []
        }
      } catch (err) {
        this.editorOpts.suggestItems = []
        this.editorOpts.templateItems = []
      }
      this.isCreate = true
    }
  },
  computed: {
    // html: {
    //   set (val) {
    //     this.$emit('update:content', val)
    //   },
    //   get () {
    //     return this.content
    //   }
    // },
    editoreditable: {
      set (val) {
        this.$emit('update:editable', val)
      },
      get () {
        return this.editable
      }
    }
  },
  watch: {
    editorIsUpdated (val) {
      this.$emit('update:docUpdate', val)
      // 通知病历更新状态
      this.$bus.$emit('medicalUpdateStatus', val)
    },
    docUpdate (val) {
      this.editorIsUpdated = val
    }
  }
}
</script>
<style lang="scss" scoped>
.ever__editor.medical {
  border: none;
  box-shadow: none;
  /deep/.medical_menu_list {
    .medical_menu_col {
      .menu_inner {
        min-width: 60px;
      }
    }
  }
}
.proof {
  /deep/ .ever__editor.medical .editor_content_wrap {
    max-height: 400px;
  }
  /deep/
    .ever__editor.medical
    .editor_content_wrap
    .editor__content
    .ProseMirror {
    min-height: 280px;
  }
}
</style>
