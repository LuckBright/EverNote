<template>
  <div class="todoeditor" :style="{'width': editorwidth}">
    <!-- <el-button @click="goPrint">打印</el-button> -->
    <div>
      <div class="todo_title">
        <div>
          <el-switch v-model="isAll" :disabled="false"></el-switch>
          <el-popover
          popper-class="service_icon_popover"
          trigger="hover"
          placement="top-start"
          content="此开关可以显示或隐藏已完成的待办事项">
            <template slot="reference">
              <span class="xiangqing"><i class="icon iconfont icon-gantanhao"></i></span>
            </template>
          </el-popover>
        </div>
        <div class="fz14">{{listDate}}</div>
        <div v-if="isOpen">
          <i class="icon iconfont icon-tianjia" v-if="!boxshow" @click="boxshow = !boxshow"></i>
          <i class="icon iconfont icon-shouqi" v-if="boxshow" @click="boxshow = !boxshow"></i>
        </div>
        <div v-if="!isOpen">
          <i class="icon iconfont icon-tianjia" v-if="!boxshow" @click="boxshow = !boxshow"></i>
          <i class="icon iconfont icon-shouqi" v-if="boxshow" @click="boxshow = !boxshow"></i>
        </div>
      </div>
      <transition name="openEditor">
        <evereditor menu="" v-show="boxshow" :contextmenu="contextmenu" v-model="html" ref="todoEditor" :options="simpleOpts" :editable.sync="editoreditable">
          <template slot="menubar" slot-scope="editor">
            <custom-toolbar
            class="toolbar"
            :editor="editor"
            :clinic="clinic"
            :pageType="pageType"
            :editorFlag="editorFlag"
            :htmlParams="htmlParams"
            @saveHtml="saveHtml"
            @upDateFlag="upDateFlag"
            @reload="reload"
            ></custom-toolbar>
          </template>
          <template slot="extensionContent">
            <todo-list
            :is-all="isAll"
            :todoList="todoData"
            :editorFlag="editorFlag"
            :htmlParams="htmlParams"
            ></todo-list>
          </template>
        </evereditor>
      </transition>
    </div>
    <dialog-print-list ref="printList"></dialog-print-list>
  </div>
</template>
<script>
import evereditor from 'evereditor'
import customToolbar from './custom.toolbar'
import todoList from './todolist'
import api from '@/crm/store/todoeditorapi.js'
import { editorBaseOpts } from '@/util/common'
import dialogPrintList from '@/workspace/page/service.panel/common/dialog.print.list'
export default {
  props: {
    listDate: {
      type: String
    },
    clinic: {
      type: Object,
      default: () => {}
    },
    editorwidth: {
      type: [Number, String]
    },
    pageType: {
      type: Number // 区分预约还是服务看板使用
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      api,
      boxshow: this.isOpen,
      // boxshow1: false,
      isAll: true,
      // 编辑器传入的html内容（获取通过方法实现 getEditorHtml）
      html: '<p></p>',
      // 编辑器页面方向 landscape:横向；portrait：纵向
      pagedir: '',
      // 编辑器页面边距  数组：[上, 右, 下, 左]
      pagePadding: [],
      pagePadding1: [],
      // 编辑器是否可编辑
      editoreditable: false,
      // 编辑器右键菜单
      contextmenu: false,
      // 编辑器内容是否更新
      editorIsUpdated: false,
      // 编辑器工具栏自定义显示
      toolbars: ['Undo', 'Redo', 'Table', 'Image', 'Link', 'Bold', 'Italic', 'Strike', 'Underline', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'Align Left', 'Align Center', 'Align Right', 'Align Justify'],
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
        ...editorBaseOpts
      },
      selHtml: '',
      textSize: 0,
      newHtmlDom: document.createElement('div'),
      editorFlag: false,
      todoData: [], // {id: randomString(32, 62),status: 0,content: ''}
      htmlParams: {
        pageType: this.pageType,
        time: this.listDate,
        orgId: this.clinic.id
      },
      id: ''
    }
  },
  components: {
    evereditor,
    customToolbar,
    todoList,
    dialogPrintList
  },
  created () {
    this.getMsg(this.htmlParams)
  },
  watch: {
    editorFlag (val) {
      // this.cancelFlag()
      this.$emit('updateEditor', val)
    },
    html (val, old) {
      this.newHtmlDom.innerHTML = val
      this.textSize = this.newHtmlDom.textContent.length
      if (this.textSize > 1000) {
        this.$nextTick(_ => {
          this.html = old
        })
      }
    },
    pageType (val) {
      this.htmlParams.pageType = val
    },
    'listDate' (val) {
      this.htmlParams.time = val
    },
    'clinic': {
      handler (val) {
        this.htmlParams.orgId = val.id
      },
      deep: true
    },
    'htmlParams': {
      handler (val) {
        if (val.pageType && val.time && val.orgId) {
          this.getMsg(val)
        }
      },
      deep: true
    }
  },
  methods: {
    cancelFlag () {
      let params = {
        pageType: this.htmlParams.pageType,
        time: this.htmlParams.time,
        orgId: this.htmlParams.orgId,
      }
      if (params.pageType && params.time && params.orgId) {
        this.api.unlock(params).then(rs => {
          if (rs && rs.head.errCode === 0) {
          }
        })
      }
    },
    goPrint () {
      this.$refs.printList.open()
    },
    selectionHtml (val) {
      this.selHtml = val
    },
    getEditorHtml () {
      // ref 替换为对应的
      return this.$refs.todoEditor.getHtml()
    },
    reload () {
      this.getMsg(this.htmlParams)
    },
    getMsg (htmlParams) {
      this.api.getMsg(htmlParams).then(rs => {
        if (rs.data) {
          if (rs.data.msg) {
            this.html = rs.data.msg.content
            this.id = rs.data.msg.id
          } else {
            this.html = '<p></p>'
            this.id = ''
          }
          if (rs.data.richMsg && rs.data.richMsg[0]) {
            this.todoData = rs.data.richMsg
          } else {
            this.todoData = []
          }
        }
      })
    },
    saveHtml () {
      let params = {
        id: this.id || '',
        pageType: this.pageType,
        content: this.getEditorHtml(),
        createTime: this.listDate,
        orgId: this.clinic.id
      }
      if (params.pageType && params.content) {
        this.api.createMsg(params).then(rs => {
          if (rs && rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功', '提示')
            this.editorFlag = false
            this.editoreditable = false
            this.getMsg(this.htmlParams)
          }
        })
      }
    },
    upDateFlag (val) {
      if (val) {
        this.editorFlag = true
        this.editoreditable = true
      } else {
        this.editorFlag = false
        this.editoreditable = false
        this.getMsg(this.htmlParams)
      }
    }
  }
}
</script>
<style scoped>
.todoeditor{width: 100%;min-width: 276px;}
.todoeditor /deep/ .editor__main{font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;}
.fz14{font-size:14px;color: #000000;}
.todo_title{height:20px;line-height: 20px;display:flex;justify-content: space-between;
border: 1px solid #98AEC3;border-radius: 4px 4px 0px 0px;background: #C5D2E0;padding:7.5px 14px;}
.todo_title>div{flex:1;}
.todo_title>div:nth-child(1){text-align: left;position: relative;}
.todo_title>div:nth-child(1) .xiangqing{position: absolute;top:-2px;;left:38px;}
.todo_title>div:nth-child(2){text-align: center;}
.todo_title>div:nth-child(3){text-align: right;}

.ever__editor{width: 100%;box-shadow:0 0 0px rgba(0,0,0,.1);border: none;position: relative;border: 1px solid #98AEC3;border-radius: 0px 0px 4px 4px;box-sizing:border-box;border-top:none;}
.ever__editor{height:304px;overflow: hidden;}
.ever__editor /deep/ .menubar{border-bottom: none;background-color: #FFFEF0;}
.ever__editor /deep/ .editor_content_wrap {width: 100%;height:266px;max-height: 266px;overflow: auto;
border-top:none;border-radius: 0px 0px 4px 4px;background-color:#FFFEF0;text-align:left;}
.ever__editor /deep/ .editor_content_wrap .editor__content{background-color:#FFFEF0;margin-top: 15px;}
.ever__editor /deep/ .editor_content_wrap .editor__main{background-color:#FFFEF0;padding: 0 14px!important;margin-bottom: 17px!important;}

/* 默认展开的动画 */
.openEditor-enter-active, .openEditor-leave-active {transition: all 500ms ease;}
.openEditor-enter, .openEditor-leave-to{height: 0;}

/* 默认收起的动画 */
.closeEditor-enter{height: 0;}
.closeEditor-enter-to{height: 304px;}
.closeEditor-enter-active, .closeEditor-leave-active {transition: all 500ms ease;}
.closeEditor-leave-to{height: 0;}

.icon-tianjia,.icon-shouqi{color: rgba(0,0,0,0.18);}
.icon-gantanhao{color: #98AEC3;margin-left: 7px;font-size:14px;}
</style>
