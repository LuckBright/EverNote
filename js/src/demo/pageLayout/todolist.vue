<template>
    <div>
	 <el-button @click="addItem">添加</el-button>
   <el-switch v-model="isAll" :disabled="false"></el-switch>
	 <div class="list-comparison">
      <div v-for="(item,i) in todoList" :key="item.id" class="list-item">
        <div v-show="isAll?true:!item.checked">
          <span v-if="item.checked === 0" :class="item.checked?'checked':'unchecked'" @click="goCheck(i)">
          </span>
          <i v-if="item.checked" class="icon iconfont icon-wancheng" @click="goCheck(i)"></i>
          <el-input
            resize="none"
            type="textarea"
            autosize
            class="ipt"
            v-model="item.content"
            maxlength="100"
            show-word-limit
            @focus="getFocus(i)"
            @blur="getBlur(i)"
            @keydown.enter.native="addNew(i, $event)"
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
export default {
  data () {
    return {
      todoList: [{
        id: new Date().getTime(),
        checked: 0,
        content: '内容'
      }],
      flag: true,
      textarea: '',
      isAll: true,
      addIndex: ''
    }
  },
  methods: {
    addNew (i, event) {
      if (event.which === 13) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
        this.addNewitem(i)
      }
    },
    addItem () {
      this.todoList.push({
        checked: 0,
        content: ''
      })
      let i = this.todoList.length - 1
      this.autofocus(i)
    },
    addNewitem (i) {
      this.todoList.splice(i + 1, 0, {id: new Date().getTime(), checked: 0, content: ''})
      this.autofocus(i + 1)
    },
    goCheck (i) {
      this.todoList[i].checked = this.todoList[i].checked === 1 ? 0 : 1
    },
    handlerDelete (i, val) {
      if (!val.content) {
        this.todoList.splice(i, 1)
        console.log(val.id, 'id')
        // if (i === 0) {
        //   this.autofocus(i)
        // } else {
        //   this.autofocus(i - 1)
        //   // 定位光标
        //   var isIpt = document.getElementsByClassName('ipt')
        //   if (i > 0 && isIpt.length) {
        //     this.setFocus(isIpt)
        //   }
        // }
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
          isIpt[temp].focus()
        }
      }, 100)
    },
    getFocus (i) {
      // 存储索引值
      console.log(i, '索引')
      this.addIndex = i
    },
    getBlur (i) {
    },
    setCaretPosition (tObj, sPos) {
      if (tObj.setSelectionRange) {
        setTimeout(function () {
          tObj.setSelectionRange(sPos, sPos)
          tObj.focus()
        }, 0)
      } else if (tObj.createTextRange) {
        var rng = tObj.createTextRange()
        rng.move('character', sPos)
        rng.select()
      }
    },
    setFocus (el) {
      el = el[0]
      el.focus()
      var range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      var sel = window.getSelection()
      if (sel.anchorOffset !== 0) {
        return
      }
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}
</script>
<style scoped>
.list-comparison{width:400px;border:1px solid #666666;min-height:400px;max-height: 400px;padding: 10px;overflow: auto;}
.list-item{position:relative;}
.list-item span{display: inline-block;width:13px;height:13px;border:1px solid #666666;border-radius: 7px;text-align: center;position: absolute;top:8px;left:0;}
.list-item i{display: inline-block;color:#1c7bef;text-align: center;position: absolute;top:8px;left:0;z-index:1;}
.list-item .ipt{display: inline-block;width:90%;line-height: 20px;font-weight: 400;border: none;
border-radius: 0;box-sizing: border-box;color: #333;outline:none;margin:0;margin-left: 20px;resize:none}
.list-item .ipt /deep/ .el-textarea__inner{font-size: 14px;line-height: 20px;font-weight: 400;border: none!important;color: #333;outline:none;margin:0;resize:none;overflow: hidden;}
</style>
