<template>
  <div :class="{proof: proof}"
       class="tpldoc" id="tpldoc">
    <evereditor v-if="isCreate"
                :html="html"
                :page-settings.sync="schemaObj.pageSettings"
                :header.sync="editorHeader"
                :footer.sync="editorFooter"
                :options="editorOpts"
                ref="editor"
                :editable.sync="editoreditable"
                mode="editor"
                :doctype="isSummary ? String(doctype) : ''"
                @contentUpdate="contentUpdate"
                @selectionHtml="selectionHtml"
                @docRendered="docRendered"
                :data-loader="editable?dataLoader:null"
                :is-updated.sync="editorIsUpdated"></evereditor>
    <!-- <div style="display:none">
      <div id="page1" class="breakable editor__main print" ref="page1">
      </div>
    </div> -->
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import evereditor from 'evereditor'
import storage from '@/util/storage'
import { editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
// import { editorBaseOpts, MEDICAL_EDITOR_OPTIONS, isJsonString } from '@/util/common'
import { MEDICAL_FONT_INFO } from '@/form/util/anamnesistype'
export default {
  name: 'Tpldoc',
  props: ['visitId', 'patientId', 'dptId', 'schemaId', 'dataId', 'editable', 'proof', 'doctype', 'isUpdated', 'code', 'patient'],
  components: {
    evereditor
  },
  data () {
    let summaryOptions = {}
    if (this.doctype === 3) {
      summaryOptions = {
        summaryDataPost: (date, summary) => {
          request(urlMap.medicalRecord.addSummary, {
            summaryDate: date,
            visitId: this.visitId,
            totalInput: summary.input,
            totalOutput: summary.output
          })
        },
        summaryTimeLimit: {
          all: {
            start: '07:00',
            end: '07:00',
          },
          daytime: {
            start: '07:00',
            end: '17:00',
          },
        }
      }
    }
    let curUser = {
      userId: storage.getLocalStorage('USERID'),
      userName: storage.getLocalStorage('DISPLAYNAME')
    }
    return {
      opStatus: 0, // 0未归档，1已归档
      html: '',
      schemaObj: {},
      isCreate: false,
      editorHeader: '',
      editorFooter: '',
      editorOpts: {
        medicalInfo: {
          patientId: this.patientId,
          visitId: this.visitId,
          code: this.code
        },
        trackMode: false, // 痕迹模式 清洁模式切换
        track: this.$ever.getClinicConfig().MEDITOR_IS_TRACK === '1' ? !0 : !1, // 留痕开启关闭
        // 痕迹操作人信息
        operator: {
          ...curUser
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
        ...MEDICAL_EDITOR_OPTIONS,
        ...summaryOptions,
        videoPathName: '电子病历'
      },
      visitType: '3',
      editorIsUpdated: false,
      isSummary: false,
      lastUpdateTime: null
    }
  },
  created () {
    this.visitType = this.$route.matched[0] && this.$route.matched[0].meta.type || '3'
    this.editorOpts.operator.medicalId = this.dataId || uuidv4()
  },
  mounted () {
    if (this.dataId) {
      this.getInstance()
    } else {
      this.getDocTpl()
    }
    this.editorOpts.medicalInfo = {
      ...this.editorOpts.medicalInfo,
      ...this.patient
    }
  },
  methods: {
    // 编辑器设置global环境字体信息
    docRendered () {
      this.$emit('docRendered')
    },
    async globalFontSettings (schema) {
      // let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
      let params = {
        scope: 1,   // 0  集团  1  机构
        type: 5
      }
      let res = await Promise.all([
        request(urlMap.getConfig.getAll, {scope: 1, type: 4}, 'post'),
        request(urlMap.getConfig.getAll, params, 'post')
      ])
      if (res && res.length) {
        if (this.doctype === 3) {
          let summary = res[0] && res[0].data || []
          summary.forEach(item => {
            switch (item.code) {
              case 'SUMMARY_SETTING':
                this.isSummary = item.value === '1' ? !0 : !1
                break
              case 'ALL_DAY_SUMMARY_SETTING_START':
                this.editorOpts.summaryTimeLimit.all.start = item.value
                break
              case 'ALL_DAY_SUMMARY_SETTING_END':
                this.editorOpts.summaryTimeLimit.all.end = item.value
                break
              case 'DAY_SUMMARY_SETTING_START':
                this.editorOpts.summaryTimeLimit.daytime.start = item.value
                break
              case 'DAY_SUMMARY_SETTING_END':
                this.editorOpts.summaryTimeLimit.daytime.end = item.value
                break
            }
          })
        }
        let fontInfo = res[1] && res[1].data || []
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
          if (schema && !schema.pageSettings[item] && obj[item]) {
            schema.pageSettings[item] = obj[item]
          }
        })
      }
      return schema
    },
    getInstance () {
      request(urlMap.medicalRecord.getInstance, {
        id: this.dataId
      }, 'get').then(async res => {
        if (res.data) {
          let data = res.data.data
          this.html = data.text
          this.editorHeader = data.header || ''
          this.editorFooter = data.footer || ''
          // if (!this.editorOpts.paginate) {
          //   this.html = `${this.editorHeader}${data.text}${this.editorFooter}`
          // }
          if (res.data.template) {
            await this.globalFontSettings(res.data.template.schema)
            this.schemaObj = res.data.template.schema
          } else {
            this.$messageTips(this, 'error', '请检查template是否配置')
          }

          this.opStatus = res.data.opStatus
          this.isCreate = true
        } else {
          this.$messageTips(this, 'error', '返回结果为' + res.data)
        }
      })
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
    getDocTpl () {
      request(urlMap.medicalRecord.getDocTpl, {
        id: this.schemaId
      }).then(async res => {
        await this.globalFontSettings(res.data.schema)
        this.html = res.data.schema.element
        this.schemaObj = res.data.schema
        this.isCreate = true
      })
    },
    selectionHtml (val) {
      // this.$emit('selectionHtml', val)
      return this.$refs.editor.selectionHtml
    },
    contentUpdate () {
      // 读租户全局配置 是否自动保存
      let autoSaveGonfig = this.$ever.getClinicConfig().AUTO_SAVE_MEDICAL_RECORD
      let isAuto = autoSaveGonfig && autoSaveGonfig !== '0' && !isNaN(+autoSaveGonfig)
      if (this.editorIsUpdated && isAuto) {
        this.$bus.$emit('medicalAutoSave', true)
        this.$emit('contentUpdate', true)
      }
    },
    resetSelectionHtml () {
      this.$refs.editor.selectionHtml = ''
    },
    dataLoader (columns) {
      // 获取回显数据
      return request(urlMap.medicalRecord.getDocEchoDisplay, {
        items: columns,
        params: {
          visitId: this.visitId,
          patientId: this.patientId,
          visitType: this.visitType
        }
      }).then(res => {
        return res.data
      })
      // return api.getMetaData(columns, this.patientId, this.visitId)
    }
  },
  computed: {
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
    'editorIsUpdated' (val) {
      if (val) this.lastUpdateTime = Date.now()
      this.$emit('update:isUpdated', val)
    },
    isUpdated (val) {
      this.editorIsUpdated = val
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/ .ever__editor.medical {
  border: none;
  box-shadow: none;
  /deep/.medical_menu_list {
    .medical_menu_col {
      .menu_inner {
        min-width: 60px;
      }
    }
  }
  /deep/.editor_content_wrap {
    max-height: inherit;
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
