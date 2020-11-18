<template>
  <div class="template_doc">
    <evereditor
      class="flex_column_full_hidden"
      v-if="isCreate"
      :html="schema.element"
      :editable="editable"
      :page-settings.sync="schema.pageSettings"
      :options="getEditorOpts(workshop)"
      ref="editor"
      :is-updated.sync="editorIsUpdated">
      <template slot="toolbarPrevItem">
        <!-- 编辑器slot button -->
        <div
          v-for="item in eidtorCommands"
          :key="item.icom"
          class="col"
          @click="handleCommand(item)"
          :title="item.title">
          <label class="label">
            <span class="command_icon"><i class="iconfont" :class="item.icon"></i></span>
          </label>
        </div>
      </template>
    </evereditor>
    <!--词条模板引用-->
    <word-dialog
      :space="workshop"
      :visible.sync="wordVisible"
      :showRadio="true"
      @save="insertWord"
    ></word-dialog>
  </div>
</template>
<script>
import evereditor from 'evereditor'
import api from '@/form/store/api'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import eidtorCommands from '@/emr/config/editor.command'
import { jcpPrintEditor, editorParams } from '@/util/common'
// import { jcpPrintEditor, isJsonString, editorParams } from '@/util/common'
import {
  getEditorOpts,
  levelTwoNames,
  levelThreeNames
  } from '@/emr/config/template.config'
import { MEDICAL_FONT_INFO } from '@/form/util/anamnesistype'
import wordDialog from '@/inpatient/page/medicalrecord/word.dialog'
import update from '@/emr/mixins/update.js'// vuex存储数据
import {commandLog} from '@/phr/mixin/operationLog.js'
import confirm from '@/util/confirm'
export default {
  name: 'template_doc',
  components: {
    wordDialog,
    evereditor
  },
  mixins: [update],
  props: {
    workshop: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean
    },
    businessType: {
      type: Number
    },
    reviewAble: {
      type: Boolean
    }
  },
  data () {
    return {
      isCreate: false,
      editorIsUpdated: false,
      wordVisible: false,
      eidtorCommands,
      editorParams,
      schema: JSON.parse(JSON.stringify(editorParams))
    }
  },
  watch: {
    'editorIsUpdated' (val) {
      console.log('wendangshuju', val)
      this.setChange(val)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    getEditorOpts,
    setEidtorCommands () {
      let btns = []
      // 没有审核权限（科室模板），个人模板，auditStatus 无值，不显示 审核/撤销审核
      if (!this.reviewAble && String(this.businessType) === '3' || Number(this.businessType) === 2 || !this.editorObj.auditStatus) {
        btns = ['save', 'print', 'printR', 'quote']
      } else {
        // auditStatus 2  已审核  显示撤销审核；auditStatus 1 未审核 显示审核;
        if (Number(this.editorObj.auditStatus) === 2) {
          btns = ['save', 'reviewR', 'print', 'printR', 'quote']
        } else if (Number(this.editorObj.auditStatus) === 1) {
          btns = ['save', 'review', 'print', 'printR', 'quote']
        }
      }
      // 词条模板  不显示引用
      if (Number(this.editorObj.type) === 5) {
        btns.splice(btns.length - 1, 1)
      }
      this.eidtorCommands = eidtorCommands.filter((item, index) => {
        return btns.includes(item.id)
      })
    },
    async addTpl (obj) { // 添加模板需要触发
      if (obj.formTemplateId) { // 有formTemplatedId是复用模版所以需要加载出来被复用的模版
        this.getTpl(obj.formTemplateId)
      } else {
        this.schema.element = ''
        this.schema.templateId = ''
        // let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
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
            }
          })
          MEDICAL_FONT_INFO.forEach(item => {
            if (obj[item]) {
              this.schema.pageSettings[item] = obj[item]
            }
          })
          this.isCreate = true
        }
      }
    },
    async init () {
      await this.globalFontSettings(this.schema)
      this.addTpl(this.editorObj)

      this.setEidtorCommands()
    },
    handleCommand (item) { // 文档专用
      // savsTpl,print,quote
      if (item.type === 'print-preview') {
        this[item.handle](true)
      } else {
        this[item.handle]()
      }
    },
    saveTpl () {
      this.$parent.saveTpl()
    },
    print (preview) {
      console.log(preview)
      commandLog({// 需要加备注
        content: `打印模版`,
        opModuleOne: `病历模版管理-${levelTwoNames[this.editorObj.businessType]}-${levelThreeNames[this.editorObj.type]}-${this.editorObj.categoryName}`,
        opType: 'PRINT'
      })
      let content = this.getHtml()
      let pageSettings = this.getSchema().pageSettings
      let printConfig = {}
      if (preview) printConfig.preview = true
      jcpPrintEditor(this, printConfig, pageSettings, [{ dom: content }])
    },
    review () {
      if (this.editorIsUpdated) {
        confirm(this, {
          content: '文档有修改，请先保存再执行审核/撤销审核操作！',
          showCancelButton: true,
          confirmCallBack: () => {
            // this.saveTpl()
          },
          cancelCallBack: () => {
          }
        })
      } else {
        this.$parent.contextmenuReview(this.editorObj)
        this.setEidtorCommands()
      }
    },
    // 编辑器设置global环境字体信息
    async globalFontSettings (schema) { // 文档专用
      // let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
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
          }
        })
        MEDICAL_FONT_INFO.forEach(item => {
          if (!schema.pageSettings[item] && obj[item]) {
            // this.isGlobal[item] = true
            schema.pageSettings[item] = obj[item]
          }
        })
      }
      return schema
    },
    getHtml () {
      return this.$refs.editor.getHtml()
    },
    getSchema () {
      return this.schema
    },
    // 获取文档编辑器模版
    getTpl (formTemplateId) { // 文档专用
      api.getTpl(formTemplateId).then(async result => {
        this.schema = result

        await this.globalFontSettings(this.schema)
        this.schema.pageSettings = this.schema.pageSettings || JSON.parse(JSON.stringify(this.editorParams.pageSettings))
        this.isCreate = true
      })
    },
    // 引用页眉页脚弹窗
    quote () {
      this.wordVisible = true
    },
    // 保存词条模板
    insertWord (data) {
      this.$refs.editor.insert(data, true)
    }
  }
}
</script>
<style scoped>
.template_doc{
  height: 100%;
}
</style>
