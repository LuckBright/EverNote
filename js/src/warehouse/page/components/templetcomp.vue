<template>
  <div>
    <h4>基本信息</h4>
    <!-- SPU 必要项 -->
    <div class="necessary condition pos_re">
      <div class="title" @click="handleOpenPopover('spu_popover', 'titleBtnSPU')">
        <span class="red">*</span>
        <span class="require">必要项</span>
        <span ref="titleBtnSPU" class="titleBtn visited"><i class="icon iconfont icon-PathCopy"></i></span>
        <span>基本信息的必要信息，均为必填项；拖动可排序</span>
      </div>
      <div class="content" v-if="attrs.spuCertainly && obj[attrs.spuCertainly].length">
        <SortableList axis="xy" :pressDelay="pressDelay" v-model="obj[attrs.spuCertainly]" @sortStart="sortStart" @sortEnd="sortEnd" @sortMove="sortMove" @input="onInput">
          <SortableItem v-for="(item, j) in obj[attrs.spuCertainly]" :index="j" :key="j" :item="item" :data="obj[attrs.spuCertainly]" :dataIndex="j" :attr="attrs.spuCertainly" @handleClose="handleClose" @handleTag="handleTag"></SortableItem>
        </SortableList>
      </div>
      <ever-popover ref="spu_popover" :attr="attrs.spuCertainly" :selectData="totalSelectData" :data="propertyData" @selected="handlePopoverSelect" property="spu" @close="handleClosePopover"></ever-popover>
    </div>
    <!-- SPU 非必要项 -->
    <div class="not necessary condition pos_re">
      <div class="title" @click="handleOpenPopover('not_spu_popover', 'titleBtnSPU1')">
        <span class="require">非必要项</span>
        <span ref="titleBtnSPU1" class="titleBtn visited"><i class="icon iconfont icon-PathCopy"></i></span>
        <span>基本信息的其他信息，默认均为非必填项，可点击属性项设置必填项；拖动可排序</span>
      </div>
      <div class="content" v-if="attrs.spuNotCertainly && obj[attrs.spuNotCertainly].length">
        <SortableList axis="xy" :pressDelay="pressDelay" v-model="obj[attrs.spuNotCertainly]" @sortStart="sortStart" @sortEnd="sortEnd" @sortMove="sortMove" @input="onInput">
          <SortableItem v-for="(item, j) in obj[attrs.spuNotCertainly]" :index="j" :key="j" :item="item" :dataIndex="j" :data="obj[attrs.spuNotCertainly]" :attr="attrs.spuNotCertainly" :changeColor="true" @handleClose="handleClose" @handleTag="handleTag"></SortableItem>
        </SortableList>
      </div>
      <ever-popover ref="not_spu_popover" :attr="attrs.spuNotCertainly" :selectData="totalSelectData" :data="propertyData" @selected="handlePopoverSelect" property="spu" @close="handleClosePopover"></ever-popover>
    </div>
    <h4>规格</h4>
    <!-- SKU 必要项 -->
    <div class="necessary condition pos_re">
      <div class="title" @click="handleOpenPopover('sku_popover', 'titleBtnSKU')">
        <span class="red">*</span>
        <span class="require">必要项</span>
        <span ref="titleBtnSKU" class="titleBtn visited"><i class="icon iconfont icon-PathCopy"></i></span>
        <span>规格的必要信息，均为必填项；拖动可排序</span>
      </div>
      <div class="content" v-if="attrs.skuCertainly && obj[attrs.skuCertainly].length">
        <SortableList axis="xy" :pressDelay="pressDelay" v-model="obj[attrs.skuCertainly]" @sortStart="sortStart" @sortEnd="sortEnd" @sortMove="sortMove" @input="onInput">
          <SortableItem v-for="(item, j) in obj[attrs.skuCertainly]" :index="j" :key="j" :item="item" :data="obj[attrs.skuCertainly]" :attr="attrs.skuCertainly" :dataIndex="j" @handleClose="handleClose" @handleTag="handleTag"></SortableItem>
        </SortableList>
      </div>
      <ever-popover ref="sku_popover" :attr="attrs.skuCertainly" :selectData="totalSelectData" :data="propertyData" @selected="handlePopoverSelect" property="sku" @close="handleClosePopover"></ever-popover>
    </div>
    <!-- SKU 非必要项 -->
    <div class="not necessary condition pos_re">
      <div class="title" @click="handleOpenPopover('not_sku_popover', 'titleBtnSKU1')">
        <span class="require">非必要项</span>
        <span ref="titleBtnSKU1" class="titleBtn visited"><i class="icon iconfont icon-PathCopy"></i></span>
        <span>规格的其他信息，默认均为非必填项，可点击属性项设置必填项；拖动可排序</span>
      </div>
      <div class="content" v-if="attrs.skuNotCertainly && obj[attrs.skuNotCertainly].length">
        <SortableList axis="xy" :pressDelay="pressDelay" v-model="obj[attrs.skuNotCertainly]" @sortStart="sortStart" @sortEnd="sortEnd" @sortMove="sortMove" @input="onInput">
          <SortableItem v-for="(item, j) in obj[attrs.skuNotCertainly]" :changeColor="true" :attr="attrs.skuNotCertainly" :index="j" :key="j" :item="item" :data="obj[attrs.skuNotCertainly]" :dataIndex="j" @handleClose="handleClose" @handleTag="handleTag"></SortableItem>
        </SortableList>
      </div>
      <ever-popover ref="not_sku_popover" :attr="attrs.skuNotCertainly" :selectData="totalSelectData" :data="propertyData" @selected="handlePopoverSelect" property="sku" @close="handleClosePopover"></ever-popover>
    </div>
  </div>
</template>
<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort'
import everPopover from './popovers'
const SortableList = {
  mixins: [ContainerMixin],
  template: `<ul class="list clearfix"><slot /></ul>`
}

const SortableItem = {
  mixins: [ElementMixin],
  props: ['item', 'data', 'dataIndex', 'changeColor', 'attr'],
  methods: {
    handleEdit (val) {
      this.$emit('handleEdit', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor })
    },
    handleTag (val) {
      this.$emit('handleTag', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor, attr: this.attr })
    },
    handleClose (val) {
      this.$emit('handleClose', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor })
    }
  },
  template: `<li class="list-item fl"><el-tag :disable-transition="true" :closable="item.globalFlag ? true : true" :type="!item.isMust && item.color ? item.color : item.isMust ? 'primary' : 'info'" @close="handleClose(item)"><span @click="handleTag(item)">{{item.name || item.propertyName || (item.propertyObject && item.propertyObject.name)}}</span></el-tag></li>`
}
export default {
  props: ['attrs', 'obj', 'totalSelectData', 'propertyData'],
  data () {
    return {
      pressDelay: 200
    }
  },
  created () { },
  methods: {
    handleClose ({ val, data, dataIndex, changeColor }) {
      this.$emit('handleClose', { val, data, dataIndex, changeColor })
    },
    handleTag ({ val, data, dataIndex, changeColor, attr }) {
      this.$emit('handleTag', { val, data, dataIndex, changeColor, attr })
    },
    handlePopoverSelect ({ data, attr, index, type }) {
      this.$emit('handlePopoverSelect', { data, attr, index, type })
    },
    sortStart ({ index }) {
      // console.log(index, 'start')
    },
    sortMove () {
    },
    sortEnd ({ oldIndex, newIndex }) {
      // console.log(oldIndex, newIndex, 'end')
    },
    onInput (newList) {
      // console.log(newList, 'input')
    },
    handleOpenPopover (diaName, btnName) {
      console.log(diaName)
      let popover = this.$refs[diaName].popover
      let dialogRefs = ['titleBtnSPU', 'titleBtnSPU1', 'titleBtnSKU', 'titleBtnSKU1']
      let btnRefs = ['spu_popover', 'sku_popover', 'not_spu_popover', 'not_sku_popover']
      btnRefs.forEach(item => {
        if (item !== diaName) {
          this.$refs[item].close()
        } else {
          if (!popover) {
            this.$refs[diaName].open()
          } else {
            this.$refs[diaName].close()
          }
        }
      })
      dialogRefs.forEach(item => {
        if (item !== btnName) {
          this.$refs[item].className = 'titleBtn visited'
        } else {
          if (!popover) {
            this.$refs[btnName].className = 'titleBtn active'
          } else {
            this.$refs[btnName].className = 'titleBtn visited'
          }
        }
      })
    },
    handleClosePopover (v) {
      if (!v) {
        let dialogRefs = ['titleBtnSPU', 'titleBtnSPU1', 'titleBtnSKU', 'titleBtnSKU1']
        dialogRefs.forEach(item => {
          this.$refs[item].className = 'titleBtn visited'
        })
      }
    }
  },
  components: {
    SortableItem,
    SortableList,
    everPopover
  },
  watch: {

  }
}
</script>
<style lang="scss" scoped>
.red { color: #e43}
.necessary {
  // margin: 0 20px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px 20px;
  .title {
    line-height: 30px;
    height: 30px;
    font-size: 14px;
    color: #999;
    .require {
      color: #000
    }
    span:last-child {
      padding-left: 30px
    }
  }
  .content {
    ul.list {
      padding-bottom: 10px;
    }
    .el-tag {
      margin-bottom: 10px;
    }
  }
}
.necessary /deep/ .el-tag, .list-item.fl /deep/ .el-tag {
  height: 30px;
  line-height: 28px;
  padding: 0;
  padding-right: 10px;
  span { display: inline-block; padding-left: 10px;}
}
ul, li {list-style-type: none; margin: 0; padding: 0}
.titleBtn {transform: rotate(180deg); display: inline-block; margin-left: 5px;
  .iconfont {font-size: 12px}
}
.titleBtn.active {transform: rotate(270deg); animation: animated .35s}
.titleBtn.visited {transform: rotate(180deg); animation: animated_back .35s}
.list-item.fl {margin-top: 10px; margin-right: 10px}
@keyframes animated
{
from {transform: rotate(180deg);}
to {transform: rotate(270deg);}
}
@keyframes animated_back
{
from {transform: rotate(270deg);}
to {transform: rotate(180deg);}
}
</style>

