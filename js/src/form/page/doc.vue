<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb v-if="!breadHidden" name="列表" :path="`${rootPath}docs`"></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner">
      <el-form class="flex_column_1_hidden" label-position="top" :disabled="disabled">
        <el-form-item label="模版名称">
          <el-input v-model="tpl.templateName"></el-input>
        </el-form-item>
        <el-form-item class="flex_column_1_hidden" label="内容">
          <evereditor
            class="flex_column_full_hidden"
            :html="tpl.element"
            :editable.sync="disabled ? false : tpl.editable"
            :page-settings.sync="tpl.pageSettings"
            :options="editorOpts"
            ref="phrdoc"
          ></evereditor>
        </el-form-item>
        <div class="bom_btn">
          <el-button :disabled="disabled" type="primary" @click="save">保存</el-button>
          <el-button :disabled="disabled" @click="print">打印</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import evereditor from 'evereditor'
import api from '../store/api'
import jcp from 'jcpjs'
// import Vue from 'vue'
import { jcpPrintEditor, editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
let prefix = 'editorcontent-'
window.jcp = jcp
export default {
  /**
   * props                        字段含义
   * @param templateId            文档模版id
   */
  props: ['templateId', 'customName', 'breadHidden', 'disabled'],
  data () {
    return {
      editorOpts: {
        ...editorBaseOpts,
        ...MEDICAL_EDITOR_OPTIONS
      },
      tpl: {
        designerId: '2',
        templateName: '',
        element: localStorage.getItem(prefix + this.$route.params.id) || '',
        editable: true,
        objId: this.$route.params.id || this.templateId,
        pageSettings: {
          paperName: 'A4',
          paperWidth: 210,
          paperHeight: 297,
          portrait: true,
          pagePadding: []
        }
      }
    }
  },
  computed: {
    rootPath () {
      return `${this.$route.matched[0].path}/`
    }
  },
  components: {
    evereditor
  },
  created () {
    if (this.customName) this.tpl.templateName = JSON.parse(JSON.stringify(this.customName))
    if (this.tpl.objId && this.tpl.objId !== '-1') {
      api.getTpl(this.tpl.objId).then(result => {
        this.tpl = result
        this.tpl.pagePadding = this.tpl.pagePadding || []
      })
    } else {
      this.tpl.element = ''
    }
  },
  methods: {
    save () {
      let obj = Object.assign({}, this.tpl)
      obj.element = this.$refs.phrdoc.getHtml()
      api.saveTpl(obj).then(_ => {
        // 判断是否返回病历类型管理
        if (this.templateId || this.customName) {
          this.$emit('saveTemplate', { data: _, isTemplateId: this.templateId })
        } else {
          this.$router.push(`${this.rootPath}docs`)
        }
        for (var i = localStorage.length - 1; i > 0; i--) {
          let key = localStorage.key(i)
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key)
          }
        }
      })
    },
    load () {

    },
    dataLoader (columns) {
      return api.getMetaData(columns, '80000039', '1quCyBg20181018144203')
    },
    print () {
      let printConfig = {}
      jcpPrintEditor(this, printConfig, this.tpl.pageSettings, [{ dom: this.tpl.element }])
    }
  },
  watch: {
    'tpl.element': {
      handler (val) {
        if (val) {
          // localStorage.setItem(prefix + this.$route.params.id, val)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  /deep/.el-form-item__label {
    justify-content: flex-start;
  }
  .flex_column_1_hidden {
    /deep/.el-form-item__content {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
