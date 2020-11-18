<template>
  <div>
    <ever-bread-crumb name="富文本编辑器demo"
                      path="/demo/layout/editor"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <p>上传图片需要传editorBaseOpts对象进去</p>
        <code>{{htmlCodes}}</code>
        <hr/>
        <div>全部工具(toolbars传值，根据需要传)：[ 'Undo', 'Redo', 'Table', 'Image', 'Link', 'Pagebreak', 'Special Character', 'Bold', 'Italic', 'Strike', 'Underline', 'Superscript', 'Subscript', 'heading', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'LineSpacing', 'Align Left', 'Align Center', 'Align Right', 'Align Justify', 'Label', 'Input', 'Checkbox', 'Radio', 'InputArea', 'Checkbox List', 'Bullet List', 'Ordered List', 'Paragraph Before Margin', 'Paragraph After Margin', 'Increase Indent', 'Decrease Indent', 'Format Clear', 'Fullsrceen']</div>
        <el-row>
          <el-col>
            <h2>文本编辑器</h2>
            <evereditor menu="base"
                        :html="html"
                        :options="editorOpts"
                        ref="htmlEditor"
                        :editable.sync="editoreditable"
                        :is-updated.sync="editorIsUpdated"></evereditor>
            <h2>文本编辑器（按需配置工具栏）</h2>
            <evereditor menu="base"
                        :toolbars="toolbars"
                        :contextmenu="contextmenu"
                        :html="html"
                        :options="editorOpts"
                        ref="htmlEditor"
                        :editable.sync="editoreditable"
                        :is-updated.sync="editorIsUpdated"></evereditor>
            <h2>文本编辑器（按需配置工具栏 & 实时更新内容）{{textSize}}</h2>
            <evereditor v-model="html"
                        menu="base"
                        :toolbars="toolbars"
                        :contextmenu="contextmenu"
                        :options="simpleOpts"
                        ref="htmlEditor"
                        :editable.sync="editoreditable"
                        :is-updated.sync="editorIsUpdated"></evereditor>
            <h2>文本编辑器（自定义工具栏插槽）</h2>
            <evereditor menu=""
                        :contextmenu="contextmenu"
                        :html="html"
                        ref="simpleEditor"
                        :editable.sync="editoreditable"
                        :is-updated.sync="editorIsUpdated">
              <template slot="menubar"
                        slot-scope="editor">
                <custom-toolbar :editor="editor"></custom-toolbar>
              </template>
            </evereditor>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <h2>病历编辑器</h2>
            <evereditor :html="html"
                        :page-settings.sync="pageSettings"
                        :options="editorOpts"
                        ref="medicalEditor"
                        :editable.sync="editoreditable"
                        mode="design"
                        @selectionHtml="selectionHtml"
                        :is-updated.sync="editorIsUpdated"></evereditor>
            <p>选中内容：
              <pre><code>{{selHtml}}</code></pre>
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import evereditor from 'evereditor'
import customToolbar from './custom.toolbar'
import { editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
export default {
  data () {
    return {
      // 编辑器传入的html内容（获取通过方法实现 getEditorHtml）
      htmlCodes: '<evereditor menu="base" :toolbars="toolbars" :contextmenu="contextmenu" :html="html" :options="editorOpts" ref="htmlEditor" :editable.sync="editoreditable" :is-updated.sync="editorIsUpdated"></evereditor>',
      html: '<p>编辑器内容</p>',
      // 编辑器页面设置  pagePadding数组：[上, 右, 下, 左]
      pageSettings: {
        paperName: 'A4',
        paperWidth: 210,
        paperHeight: 297,
        portrait: true,
        pagePadding: [10, 10, 10, 10],
      },
      pagePadding1: [],
      // 编辑器是否可编辑
      editoreditable: true,
      // 编辑器右键菜单
      contextmenu: false,
      // 编辑器内容是否更新
      editorIsUpdated: false,
      // 编辑器工具栏自定义显示
      // 全部工具：[ 'Undo', 'Redo', 'Table', 'Image', 'Link', 'Pagebreak', 'Special Character', 'Bold', 'Italic', 'Strike', 'Underline', 'Superscript', 'Subscript', 'heading', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'LineSpacing', 'Align Left', 'Align Center', 'Align Right', 'Align Justify', 'Label', 'Input', 'Checkbox', 'Radio', 'InputArea', 'Checkbox List', 'Bullet List', 'Ordered List', 'Paragraph Before Margin', 'Paragraph After Margin', 'Increase Indent', 'Decrease Indent', 'Format Clear', 'Fullsrceen']
      toolbars: ['Undo', 'Redo', 'Table', 'Image', 'Link', 'Bold', 'Italic', 'Strike', 'Underline', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'Align Left', 'Align Center', 'Align Right', 'Align Justify'],
      // 编辑器配置选项
      simpleOpts: {
        // 编辑器内容实时更新
        htmlSync: true,
        // 图片上传配置
        ...editorBaseOpts
      },
      // 编辑器配置选项
      editorOpts: {
        suggestItems: [],
        templateItems: [],
        // #快捷录入模板数据
        templateApi: {
          url: `${this.$ever.api}/medical-record/doctor/templateScope/getSmallTemplate`,
          params: {
            dptId: this.dptId
          }
        },
        // 图片上传配置
        ...editorBaseOpts,
        // 传入接口配置
        ...MEDICAL_EDITOR_OPTIONS
      },
      selHtml: '',
      textSize: 0,
      newHtmlDom: document.createElement('div')
    }
  },
  components: {
    evereditor,
    customToolbar
  },
  methods: {
    selectionHtml (val) {
      this.selHtml = val
    },
    getEditorHtml () {
      // ref 替换为对应的
      return this.$refs.medicalEditor.getHtml()
    }
  },
  watch: {
    html (val) {
      this.newHtmlDom.innerHTML = val
      this.textSize = this.newHtmlDom.textContent.length
    }
  }
}
</script>
<style scoped>
.el-row .el-col {
  padding: 10px 0 20px;
  border-bottom: 1px solid #eee;
}
</style>
