<template>
<div>
	<div class="list-comparison">
      <div v-for="(item,i) in todoList" :key="item.id" class="list-item">
        <div v-show="isAll?true:!item.status">
          <el-checkbox
          v-model="item.status"
          :true-label="1"
          :false-label="0"
          @change="goCheck(i,item)"
          :disabled="!editorFlag"
          ></el-checkbox>
          <el-input
            resize="none"
            type="textarea"
            autosize
            class="ipt"
            v-model="item.content"
            :disabled="!editorFlag"
            maxlength="100"
            show-word-limit
            @focus="getFocus(i, item)"
            @blur="getBlur(i, item)"
            @keydown.enter.native="addNew1(i, $event, item)"
            @keydown.delete.native="handlerDelete(i, item)"
            @keydown.up.native="goUp(i, $event)"
            @keydown.down.native="goDown(i, $event)"
          ></el-input>
        </div>
      </div>
	</div>
</div>
</template>
<script type="text/javascript">
import api from '@/crm/store/todoeditorapi.js'
import { randomString } from '@/util/common'
export default {
  props: {
    isAll: {
      type: Boolean,
      default: true
    },
    editorFlag: {
      type: Boolean
    },
    todoList: {
      type: Array,
      default () {
        return []
      }
    },
    htmlParams: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      textarea: '',
      addIndex: '',
      api,
      focusId: '',
      focusContent: ''
    }
  },
  created () {
    this.$bus.$on('addNew', v => {
      // this.addItem()
      this.newAdd()
    })
  },
  methods: {
    addNew1 (i, event, item) {
      if (event.which === 13) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
        if (item.content) {
          this.newAdd()
        }
        // this.newAdd()
        // this.addNewitem(i, item)
      }
    },
    addItem () {
      if (this.addIndex || this.addIndex === 0) {
        this.todoList.splice(this.addIndex + 1, 0, {id: randomString(32, 62), status: 0, content: ''})
        this.autofocus(this.addIndex + 1)
      } else {
        this.todoList.push({
          id: randomString(32, 62),
          status: 0,
          content: ''
        })
        let i = this.todoList.length - 1
        this.autofocus(i)
      }
    },
    addNewitem (i, item) {
      this.todoList.splice(i + 1, 0, {id: randomString(32, 62), status: 0, content: ''})
      this.autofocus(i + 1)
    },
    //  无论光标在哪都往最后面追加
    newAdd () {
      if ((this.todoList && this.todoList[0] && this.todoList[this.todoList.length - 1].content) || !this.todoList || this.todoList.length <= 0) {
        this.todoList.push({
          id: randomString(32, 62),
          status: 0,
          content: ''
        })
      }
      // this.todoList.push({
      //   id: randomString(32, 62),
      //   status: 0,
      //   content: ''
      // })
      let i = this.todoList.length - 1
      this.autofocus(i)
    },
    goCheck (i, item) {
      let params = {
        id: item.id,
        pageType: this.htmlParams.pageType,
        createDay: this.htmlParams.time,
        orgId: this.htmlParams.orgId,
        status: item.status,
        content: item.content
      }
      // 失去焦点创建todolist item
      if (params.content && params.pageType) {
        this.createRichMsg(params)
      }
    },
    handlerDelete (i, val) {
      if (!val.content) {
        if (val.id) {
          this.deleteRichMsg(val.id, i)
          // this.todoList.splice(i, 1)
        } else {
          this.todoList.splice(i, 1)
        }
        if (!this.todoList || !this.todoList.length) {
          this.addIndex = ''
        }
      }
    },
    goUp (i, event) {
      if (event.which === 38) {}
    },
    goDown (i, event) {
      if (event.which === 40) {}
    },
    autofocus (i) {
      setTimeout(() => {
        var isIpt = document.getElementsByClassName('el-textarea__inner')
        if (isIpt.length) {
          let temp = i
          if (isIpt[temp]) {
            isIpt[temp].focus()
          }
        }
      }, 1)
    },
    getFocus (i, item) {
      // 存储索引值
      this.addIndex = i
      this.focusId = item.id
      this.focusContent = item.content
    },
    getBlur (i, item) {
      let params = {
        id: item.id,
        pageType: this.htmlParams.pageType,
        createDay: this.htmlParams.time,
        orgId: this.htmlParams.orgId,
        status: item.status,
        content: item.content
      }
      // 失去焦点创建todolist item
      if (params.content && params.pageType) {
        this.createRichMsg(params)
      }
    },
    createRichMsg (params) {
      this.api.createRichMsg(params).then(rs => {
        if (rs && rs.head.errCode === 0) {
          console.log('保存成功')
        }
      })
    },
    deleteRichMsg (id, i) {
      this.api.deleteRichMsg({id: id}).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.todoList.splice(i, 1)
        }
      })
    }
  }
}
</script>
<style scoped>
.list-comparison{padding: 0 14px;}
.list-item{position:relative;}
.list-item span{display: inline-block;width:13px;height:13px;border:1px solid #666666;border-radius: 7px;text-align: center;}
.list-item i{color:#1c7bef;}
.list-item>div{position: relative;}
.list-item /deep/ .el-checkbox{margin-right: 0px;position: absolute;top:4px;left:0}
.list-item /deep/ .el-checkbox{margin-right: 0px;position: absolute;top:4px;left:0}

.list-item /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner{border: 1px solid #AAAAAA;background: #fff;}

.list-item /deep/ .is-disabled.is-checked .el-checkbox__inner{width: 16px;height: 16px;border-radius: 4px;background-color:#1c7bef;border-color: #1c7bef;}
.list-item /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{border-color:#FFFFFF;}


.list-item /deep/ .el-checkbox__inner{width: 16px;height: 16px;border-radius: 4px;}
.list-item /deep/ .el-checkbox__inner::after{height: 8px;left: 5px;top: 2px;}

.list-item .ipt{display: inline-block;width:calc(100% - 26px);margin-left: 26px;font-weight: 400;border: none;border-radius: 0;box-sizing: border-box;color: #333;outline:none;resize:none}
.list-item .ipt /deep/ .el-textarea__inner{font-size: 14px;font-weight: 400;border: none!important;color: #333;outline:none;margin:0;resize:none;overflow: hidden;background-color:#FFFEF0;padding:0px;line-height: 26px;}
</style>
