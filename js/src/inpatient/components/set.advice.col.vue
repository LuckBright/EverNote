<template>
  <el-popover
    popper-class="layout_box task_box pt10 noBorder"
    trigger="click"
    placement="bottom"
    width="235"
    :open-delay="300"
    v-model="isShow"
    @show="show"
    @hide="hide"
  >
    <div class="choose-wrap" v-if="chooseData && chooseData.length">
      <p class="tips">
        <span>拖拽可排序</span>
        <el-button type="text" @click="reset">恢复默认</el-button>
      </p>
      <ul class="content" ref="dragCon" @dragover="onDragOver($event)">
        <li class="items" 
          v-for="(item, index) in chooseData" 
          :key="index" 
          :class="{'disabled': item.disabled, 'active': item.isActive}" 
          :draggable="!item.disabled"
          @dragstart="onDragStart(item, $event)"
          @dragenter="onDragEnter(item, $event)"
          @dragleave="onDragLeave(item, $event)"
          @dragover="onDragItemOver(item, $event)"
          @dragend="onDragEnd(item, $event)"
          @drop="drop(item, $event)"
          >
          {{item.label}}
          <i class="iconfont icon-zhuyuan-yizhu-bohui" v-if="!item.disabled" @click="deleteChoose(item, index)"></i>
        </li>
      </ul>
    </div>
    <div class="wait-choose-wrap" v-if="waitChooseData && waitChooseData.length">
      <p class="tips">
        <span>点击可添加</span>
      </p>
      <ul class="content">
        <li class="items" v-for="(item, index) in waitChooseData" :key="index" @click="addChoose(item, index)">
          <i class="iconfont icon-tianjia"></i>
          {{item.label}}
        </li>
      </ul>
    </div>
    <div class="choose-btns">
      <el-button type="primary" @click="saveChoose">添加</el-button>
      <el-button @click="isShow = false;isOpen = false">取消</el-button>
    </div>
    <template slot="reference">
      <el-button type="text" class="setColBtn"><span class="text">自定义医嘱列</span><i class="iconfont" :class="{'icon-xia': !isOpen, 'icon-shang': isOpen}"></i></el-button>
    </template>
  </el-popover>
</template>
<script>
import api from '@/components/evertableapi'
export default {
  data () {
    return {
      isShow: false,
      isOpen: false,
      localData: [],
      chooseData: [],
      waitChooseData: [],
      tableId: 'outpatient.waitadvice.configf',
      disableDrag: ['adviceType', 'adviceName', 'disposeContent'],
      dragstartArr: [],
      curDragItem: {}
    }
  },
  props: [],
  methods: {
    show () {
      this.isOpen = true
      this.getConfigData()
    },
    getConfigData () {
      this.localData = []
      this.chooseData = []
      this.waitChooseData = []
      api.getConfig({tableId: this.tableId}).then(res => {
        if (res.head && res.head.errCode === 0 && res.data && res.data.config && res.data.config.length) {
          res.data.config.map(item => {
            if (this.disableDrag.includes(item.prop)) {
              item.disabled = true
            }
            if (item.hidden) {
              this.waitChooseData.push(item)
            } else {
              this.chooseData.push(item)
            }
            return item
          })
          // this.$emit()
          this.localData = res.data.config
        }
      })
    },
    hide () {
      this.isOpen = false
    },
    reset () {
      this.chooseData = []
      this.waitChooseData = []
      this.localData.map(item => {
        if (item.hidden) {
          this.waitChooseData.push(item)
        } else {
          this.chooseData.push(item)
        }
      })
    },
    onDragStart (item, event) {
      this.curDragItem = JSON.stringify(item)
      event.dataTransfer.setData('text/plain', JSON.stringify(item))
    },
    onDragEnter (item, event) {
      if (item.disabled) return
      if (item.prop === this.curDragItem.prop) return
      let domArr = this.$refs.dragCon.getElementsByClassName('items')
      let index = this.chooseData.findIndex(value => item.prop === value.prop)
      domArr[index].classList.add('active')
    },
    onDragLeave (item, event) {
      let domArr = this.$refs.dragCon.getElementsByClassName('items')
      let index = this.chooseData.findIndex(value => item.prop === value.prop)
      domArr[index].classList.remove('active')
    },
    onDragItemOver (item, event) {
    },
    onDragEnd (item) {
      // this.curDragItem = {}
    },
    onDragOver (event) {
      event.preventDefault()
    },
    drop (item, event) {
      if (item.disabled) return
      let dropData = JSON.parse(event.dataTransfer.getData('text/plain'))
      if (item.prop === dropData.prop) return
      let sindex = this.chooseData.findIndex(value => dropData.prop === value.prop)
      this.chooseData.splice(sindex, 1)
      let index = this.chooseData.findIndex(value => item.prop === value.prop)
      this.chooseData.splice(index, 0, dropData)
    },
    deleteChoose (item, index) {
      item.hidden = true
      this.waitChooseData.push(item)
      this.chooseData.splice(index, 1)
    },
    addChoose (item, index) {
      item.hidden = false
      this.chooseData.push(item)
      this.waitChooseData.splice(index, 1)
    },
    saveChoose () {
      let params = {
        tableId: this.tableId,
        config: this.chooseData.concat(this.waitChooseData)
      }
      api.saveConfig(params).then(res => {
        if (res && res.head && res.head.errCode === 0) {
          this.isShow = false
          this.$messageTips(this, 'success', '设置成功', '提示')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tips {
  margin: 0 0 5px;
  padding: 0 5px;
  span {
    color: #666666;
  }
  .el-button {
    padding: 0;
    float: right;
  }
}
.content {
  overflow: hidden;
  padding: 0;
  margin: 5px 0;
  .items {
    float: left;
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    color: #333333;
    text-align: center;
    margin: 5px;
  }
}
.choose-wrap {
  .items {
    background: #F1F1F1;
    position: relative;
    border: 1px solid #F1F1F1;
    width: 63px;
    opacity: 1;
    .iconfont {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      color: #cccccc;
      top: -10px;
      right: -3px;
    }
  }
  .active {
    border-color: #1c7bef;
    opacity: 0.6;
  }
  .disabled {
    color: #999999;
  }
}
.wait-choose-wrap {
  padding-top: 0;
  .items {
    border: 1px solid #DDDDDD;
    width: 63px;
    cursor: pointer;
    .iconfont {
      color: #666666;
      font-size: 12px;
    }
  }
}
.choose-wrap, .wait-choose-wrap {
  padding: 5px;
  font-size: 12px;
}
.choose-btns {
  padding: 10px;
  border-top: 1px solid #dedede;
  /deep/ .el-button {
    padding: 6px 7px;
    font-size: 12px;
  }
}
.setColBtn {
  font-size: 12px;
  .text {
    text-decoration:  underline;
    cursor: pointer;
  }
  .iconfont {
    color: #979797;
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
