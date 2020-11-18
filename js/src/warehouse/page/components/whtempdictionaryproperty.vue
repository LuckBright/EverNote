<template>
  <div class="flex_column_full_hidden"  style="overflow-y: auto">
    <div class="layout_inner">
      <div class="steps">
        <el-row :gutter="20" class="steps-box">
          <el-col :span="6"> &nbsp;</el-col>
          <el-col :span="12">
            <ul>
            <li class="active"><span class="circle">1</span>属性项设置</li>
            <li class="active"><span class="line"></span></li>
            <li class="active"><span class="circle">2</span>属性值设置</li>
          </ul>
          </el-col>
          <el-col :span="6"> &nbsp;</el-col>
        </el-row>
      </div>
      <div class="content-box">
        <div class="necessary condition pos_re" v-for="(item, index) in propertyData" :key="index">
          <div class="title" @click="handleOpenPopover(index, item.propertyRealtionId)">
            <!-- <span class="red">*</span> -->
            <span class="require">{{item.propertyName || (item.propertyObject && item.propertyObject.name)}}</span>
            <span :ref="'titleBtn' + index" class="titleBtn visited"><i class="icon iconfont icon-PathCopy"></i></span>
            <span>鼠标长按可拖动，在必填项中进行排序。</span>
          </div>
          <div class="content" v-if="item[templetVals] && item[templetVals].length">
            <SortableList axis="xy" :pressDelay="pressDelay" v-model="item[templetVals]" @sortStart="sortStart" @sortEnd="sortEnd" @sortMove="sortMove" @input="onInput">
              <SortableItem v-for="(item, j) in item[templetVals]" :index="j" :listIndex="index" :key="j" :item="item" :data="item[templetVals]" :dataIndex="j" :attr="templetVals" @handleClose="handleClose"></SortableItem>
            </SortableList>
          </div>
          <ever-popover :ref="'popover' + index" :attr="templetVals" :selectData="item[templetVals]" :popoverIndex="index" :data="propertyPopoverData" @selected="handlePopoverSelect" @popoverHide="handlePopoverHide" :property="true"></ever-popover>
        </div>
        <div class="ml120">
          <el-button @click="handleBack" size="large">上一步</el-button>
          <el-button type="primary" @click="submitForm('form')" size="large">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort'
import { GLOBAL_ATTR, getFirstRoutePath } from '@/util/common'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'
import everPopover from '@/warehouse/page/components/popovers'

const SortableList = {
  mixins: [ContainerMixin],
  template: `<ul class="list clearfix"><slot /></ul>`
}

const SortableItem = {
  mixins: [ElementMixin],
  props: ['item', 'data', 'dataIndex', 'changeColor', 'attr', 'listIndex'],
  methods: {
    handleEdit (val) {
      this.$emit('handleEdit', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor })
    },
    handleTag (val) {
      this.$emit('handleTag', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor, attr: this.attr })
    },
    handleClose (val) {
      this.$emit('handleClose', { val, data: this.data, dataIndex: this.dataIndex, changeColor: this.changeColor, listIndex: this.listIndex, attr: this.attr })
    }
  },
  template: `<li class="list-item fl"><el-tag :disable-transition="true" :closable="item.globalFlag ? true : true" :type="item.color ? 'primary' : ''" @close="handleClose(item)"><span @click="handleTag(item)">{{item.name || item.valueSetItemName ||  (item.propertyValueObject && item.propertyValueObject.name)}}</span></el-tag></li>`
}
export default {
  props: ['routePath', 'customPathList', 'systemType'],
  data () {
    return {
      objId: this.$route.params.id,
      source: this.$route.query.source,
      pressDelay: 200,
      templetVals: 'templetDictPropertyValues',
      propertyData: [],
      propertyPopoverData: [],
      totalSelectData: [],
      oldPopoverIndex: '',
      popoverStatus: false,
      rules: {
        classifyId: { required: true, message: '必填项', trigger: 'change' },
        name: { required: true, message: '必填项', trigger: 'blur' }
      }
    }
  },
  created () {
    // 物资模版属性项获取
    this.handlePropertyList()
  },
  methods: {
    handlePopoverHide () {
      this.popoverStatus = true
      this.propertyData.forEach((item, i) => {
        this.$refs['titleBtn' + i][0].className = 'titleBtn visited'
      })
    },
    handleBack () {
      this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.routePath}/${this.objId}?source=${this.source}&inUse=${this.$route.query.inUse}&customPathList=${this.customPathList}&propertyPath=${getFirstRoutePath(this.$route.path, 2)}&routePath=${this.routePath}&systemType=${this.systemType}`)
    },
    handlePropertyList () {
      let params = {
        propertyTypes: [GLOBAL_ATTR[2].id, GLOBAL_ATTR[3].id],
        systemType: this.systemType
      }
      if (this.source === 'group') {
        params.templetId = this.objId
        this.templetVals = 'templetPropertyValues'
        templetApi.templetPropertyList(params).then(result => {
          if (result[0]) {
            this.cacheDataProperty = JSON.parse(JSON.stringify(result))
            // 设置必要项属性值不允许修改
            let resultData = JSON.parse(JSON.stringify(result))
            resultData.forEach(item => {
              item[this.templetVals] = item[this.templetVals] || []
              if (item.templetDictPropertyId) {
                if (!item[this.templetVals]) item[this.templetVals] = []
                item[this.templetVals].forEach(itemVal => {
                  itemVal.globalFlag = true
                })
              }
            })
            this.propertyData = resultData
          }
        })
      }
    },
    handlePopoverSelect ({ data, attr, index }) {
      if (Array.isArray(data)) {
        data.forEach(data => {
          data.pertyValueId = data.id
          data.lineNumber = ''
          delete data.id
          let index1 = -1
          index1 = this.cacheDataProperty[index][attr] && this.cacheDataProperty[index][attr].findIndex(item => {
            return item.propertyRealtionId === data.propertyRealtionId && item.propertyValueId === data.valueId
          })
          if (typeof index1 === 'number' && index1 > -1) {
            this.propertyData[index][attr].push(this.cacheDataProperty[index][attr][index1])
          } else {
            delete data.updateBy
            delete data.updateTime
            delete data.createTime
            delete data.createBy
            delete data.propertyValueObject
            this.propertyData[index][attr].push(data)
          }
        })
      } else {
        data.propertyValueId = data.id
        data.lineNumber = ''
        delete data.id
        let index1 = -1
        index1 = this.cacheDataProperty[index][attr] && this.cacheDataProperty[index][attr].findIndex(item => {
          return item.propertyRealtionId === data.propertyRealtionId && item.propertyValueId === data.valueId
        })
        if (typeof index1 === 'number' && index1 > -1) {
          this.propertyData[index][attr].push(this.cacheDataProperty[index][attr][index1])
        } else {
          delete data.updateBy
          delete data.updateTime
          delete data.createTime
          delete data.createBy
          delete data.propertyValueObject
          this.propertyData[index][attr].push(data)
        }
      }
    },
    handleOpenPopover (index, id) {
      let popover = this.$refs['popover' + index][0].popover
      this.popoverStatus = false
      let popovers = 'popover' + index
      this.propertyData.forEach((item, i) => {
        this.$refs['titleBtn' + i][0].className = 'titleBtn visited'
        this.$refs['popover' + i][0].close()
      })
      // this.propertyPopoverData = []
      templetApi.propertyInfo({ id }).then(result => {
        if ((result || result.list) && (result.length || result.list.length)) {
          this.propertyPopoverData = result || result.list
          if (!popover) this.$refs[popovers][0].open()
        }
      })
      if (!popover) this.$refs['titleBtn' + index][0].className = 'titleBtn active'
    },
    handleClose ({ val, data, dataIndex, changeColor, listIndex, attr }) {
      this.propertyData[listIndex][attr].splice(dataIndex, 1)
    },
    sortStart ({ index }) {
      console.log(index, 'start')
    },
    sortMove () {
    },
    sortEnd ({ oldIndex, newIndex }) {
      console.log(oldIndex, newIndex, 'end')
    },
    onInput (newList) {
      console.log(newList, 'input')
    },
    submitForm () {
      let params = [...this.propertyData]
      for (let i = 0; i < this.propertyData.length; i++) {
        let item = this.propertyData[i]
        if ((item.templetDictPropertyValues && !item.templetDictPropertyValues.length) || (item.templetPropertyValues && !item.templetPropertyValues.length)) {
          this.$messageTips(this, 'warning', '\'' + item.propertyName || item.propertyObject.name + '\' ' + '未添加数据，请添加后再保存')
          return
        }
        for (let m = 0; m < params[i][this.templetVals].length; m++) {
          let itemVal = params[i][this.templetVals][m]
          itemVal.lineNumber = m + 1
        }
        delete params[i].propertyObject
      }
      let paramsObject = Object.assign({}, { templetProperties: params, systemType: this.systemType })
      if (this.source === 'group') {
        templetApi.updateTempletProperty(paramsObject).then(result => {
          if (result) {
            this.$messageTips(this, 'success', '保存成功')
            this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.customPathList}`)
          }
        })
      }
    },
    _resetTotalSelectData () {
      this.totalSelectData = [...this.obj.templetDictPropertiesForSpuCertainly, ...this.obj.templetDictPropertiesForSpuNotCertainly, ...this.obj.templetDictPropertiesForSkuCertainly, ...this.obj.templetDictPropertiesForSkuNotCertainly]
    }
  },
  watch: {
    'obj.templetDictPropertiesForSpuCertainly' (val) {
      this._resetTotalSelectData()
    },
    'obj.templetDictPropertiesForSpuNotCertainly' (val) {
      this._resetTotalSelectData()
    },
    'obj.templetDictPropertiesForSkuCertainly' (val) {
      this._resetTotalSelectData()
    },
    'obj.templetDictPropertiesForSkuNotCertainly' (val) {
      this._resetTotalSelectData()
    }
  },
  components: {
    SortableItem,
    SortableList,
    everPopover
  }
}
</script>
<style lang="scss" scoped>

.red { color: #e43}
.necessary {
  min-height: 30px;
  margin: 0 20px;
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
  span { display: inline-block; padding-left: 10px}
}
.queryClass {min-width: 220px; display: inline-block; margin-right: 5px}
ul, li {list-style-type: none; margin: 0; padding: 0}
.steps { padding: 30px 0; padding-bottom: 50px}
.steps-box ul li { display: inline; line-height: 24px; color: #999}
.steps-box ul li .line { background: #e9e9e9; height: 3px; display: inline-block; margin: 0 50px; margin-top: 10px; width: 40%}
.circle { width: 24px; height: 24px; border-radius: 50%; background: #e9e9e9; display: inline-block; text-align: center; color: #bbb; margin-right: 10px}
.steps-box ul li.active { color: #1C7BEF}
.steps-box ul li.active .circle, .steps-box ul li.active .line { background: #1C7BEF; color: #fff;}
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
