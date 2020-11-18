<!-- 编辑发药任务 -->
<template>
  <ever-form2
    class="custom-form"
    :class="{audit: obj.auditReject}"
    :schema="schema"
    size="mini"
    :label-width="obj.auditReject ? '1px' : '80px'"
    v-model="obj"
    ref="form">
    <template slot="identification">
      <template v-if="!obj.auditReject">
        <el-checkbox
          v-model="obj.identification"
          @change="markAbnormalHandler"
          :true-label="1"
          :false-label="0">标记异常</el-checkbox>
      </template>
      <template v-else>
        <h3 class="alg_c lh35 f18">选择{{obj.auditReject ? '驳回' : '异常'}}原因</h3>
      </template>
      <template>
        <el-container class="select-abnormal page_layout_full_hidden" v-show="obj.identification">
          <el-aside v-if="isMany || isLayout" width="300px" class="flex_column_full_hidden no-box-sha">
            <ever-table
              ref="table"
              :table-default-cell-value="tableDefaultCellValue"
              :columns="columns"
              :key="tableKey"
              :data="table"
              border
              style="margin-top: 0px"
              table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
              class="flex_scroll flex_hidden"
              :is-record-url-params="false"
              :not-select-checkbox="true"
              :selectable="selectable"
              :checkbox-width="checkboxWidth"
              @selection-change="handleSelectionChange"
              @eventChange="eventChange"
              :show-checkbox="true">
              <template v-for="column in renderColumns" :slot="column.slotName">
                <el-table-column
                  :key="column.prop"
                  :slot="column.prop"
                  :label="column.label"
                  :width="column.width"
                  :prop="column.prop">
                  <template slot="header" slot-scope="{}">
                    {{column.label}}
                  </template>
                  <template slot-scope="scope">
                    <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
                  </template>
                </el-table-column>
              </template>
            </ever-table>
          </el-aside>
          <el-main class="border-main p0i main page_layout_full_hidden" :class="{minus: isLayout}">
            <el-container class="flex_column_full_hidden">
              <el-header height="260px" class="padd10 bor_bom_1 flex_scroll" id="treeBox">
                <common-tree id="commonTree" :api="api" :isSelectAdd="true" @thisSelectData="addSelect" :statusType="1"></common-tree>
              </el-header>
              <el-main class="main">
                <el-container class="page_layout_full_hidden">
                  <el-main class="flex_column_full_hidden">
                    <el-container class="flex_column_full_hidden bg_col_01 padd10">
                      <el-main class="main flex_scroll" id="abnormally">
                          <transition-group name="list" tag="ul" class="ul">
                            <li class="df" v-for="(item, index) in abnormalListData" :key="item.id">
                              <label class="flex1"><span class="cGary">{{index + 1}}、</span>{{item.contentText}}</label>
                              <i class="iconfont icon-delete blue cur" @click="abnormallyReasonDeleteHandler(item, index)"></i>
                            </li>
                            <li key="-1" class="alg_c cGray" v-if="!abnormalListData.length">{{!obj.auditReject ? '请选择异常信息或者输入异常信息' : '请选择驳回原因或者输入驳回原因'}}</li>
                          </transition-group>
                      </el-main>
                      <el-header class="p0 mt5" height="30px">
                        <textarea maxlength="200" class="textarea" placeholder="请输入异常信息(最大200个字符)" :disabled="inputDisable" @input="customAbnormalChangeHandler" v-model="customAbnormal"></textarea>
                        <!-- <el-input v-model="customAbnormal" @blur="customAbnormalChangeHandler" :disabled="inputDisable" placeholder="请输入异常信息" type="textarea" class="textarea"></el-input> -->
                      </el-header>
                    </el-container>
                  </el-main>
                  <el-aside width="100px" class="no-box-sha flex_column_full_hidden" v-if="isMany || isLayout">
                    <el-button class="fjc flex_hidden mt10 mb10 mr10"
                      :disabled="inputDisable"
                      @keyup.enter.native="enterCustomAbnormal(customAbnormal)" @click="enterCustomAbnormal(customAbnormal)">提交并继续</el-button>
                  </el-aside>
                </el-container>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </template>
    </template>
    <template slot="default"><span></span></template>
  </ever-form2>
</template>

<script>
import {
  SEND_MODE,
  tableDefaultCellValue
} from '@/warehouse/views/util/constant.js'
import { debounce } from '@/util/common'
import api from '@/warehouse/page/prescription.review/util/commentapi.js'
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import CommonTree from '@/warehouse/page/prescription.review/components/commontree.vue'
import SpanMethodMixin from '@/warehouse/views/drug/mixin/span.method.mixin.js'
import storage from '@/util/storage.js'
const tempSchema = [
  {
    name: 'delivery',
    label: '发货方式',
    comp: 'sys-select',
    parentClass: 'custom-item',
    props: {
      clearable: false,
      options: SEND_MODE
    }
  },
  {
    name: 'actualStorageRoomId',
    label: '发货库房',
    parentClass: 'custom-item',
    comp: 'sys-select',
    props: {
      options: []
    }
  },
  {
    name: 'identification',
    label: '异常处理',
    comp: 'custom',
    identification: 1
  },
]
export default {
  mixins: [SpanMethodMixin],
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    storageRoomList: Array,
    obj: {},
    pageType: { // 页面：1、任务审核  2、收方发药  3、缺货任务  4、发药记录 5、任务列表
      type: Number,
      required: true,
      default: 1
    },
    isLayout: Boolean,
    isChineseMedicine: Boolean, // 中药
    parentIndex: Number, // 表格 列表index(当前数据的父数据下标)
    identification: Number, // 该数据是否异常 => 处方整单情况下（只有处方整单才会展示异常处方）
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    newStorageRoom () {
      return this.storageRoomList.map(storage => ({
        id: storage.id,
        name: storage.clinicName + '-' + storage.name // 拼接机构名称和库房名称
      }))
    },
    inputDisable () {
      const selectLen = this.selectionData.length
      const len = this.tableData.length
      if (selectLen) return false
      return !(!selectLen && len === 1 && !this.isLayout)
    },
    table () {
      if (this.isChineseMedicine && this.pageType !== 1) {
        return this.tableData[0]._sourceData.map(table => Object.assign({}, table, { dialogFlag: 1 }))
      }
      // 数据为坚持发药  又带着异常和驳回 原因 清空异常和驳回原因
      let newTable = JSON.parse(JSON.stringify(this.tableData)).map(table => {
        if (table.description && !table.dialogFlag && !table.identification) {
          if (table.identificationInfo) table.identificationInfo = ''
          if (table.rejectionReasons) table.rejectionReasons = ''
        }
        return Object.assign({}, table, { dialogFlag: 1 })
      }) // 在元数据中添加一个弹窗数据标识，用于展示删除异常操作
      return newTable
    },
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
    isMany () { //  > 1 ,父子医嘱或者处方整单操作， = 1 明细单条操作
      return this.tableData.length > 1
    }
  },
  data () {
    const isBatch = Number(storage.getLocalStorage('IS_BATCHPRICE') || 0) // 定价模式
    const schema = this.handlerSchemaShow(isBatch)
    return {
      schema,
      api,
      tableKey: 0,
      tableDefaultCellValue,
      abnormalEle: null,
      dom: null,
      eventHandler: null,
      formInline: {},
      selectionData: [], // evertable 勾选的数据
      abnormalListData: [], // 异常列表
      fullAbnormalAddData: [], // 整单处理异常时标记的异常数据
      customAbnormal: '', // 自定义异常信息
    }
  },
  created () {
    this.init()
    if (!this.identification && this.$ever.getFieldFromSchema(this.schema, 'actualStorageRoomId')) {
      const has = this.newStorageRoom.find(storage => storage.id === this.obj.actualStorageRoomId)
      if (!has) this.$emit('update:obj', Object.assign(this.obj, { actualStorageRoomId: '' }))
      this.$ever.getFieldFromSchema(this.schema, 'actualStorageRoomId').props.options = this.newStorageRoom
    }
  },
  mounted () {
    // 处方单异常时点击编辑：初始化异常处理值
    if (this.identification) {
      this.obj.identification = this.identification
      this.$emit('update:isAbnormal', this.identification)
    }
    setTimeout(_ => {
      this.eventHandler = this.dom && this.domEventHandler()
      this.dom && this.dom.addEventListener('click', this.eventHandler, true)
    }, 300)
    // 弹出框删除驳回信息
    this.$bus.$on('deleteAbnormallyDeleteHandler', (row, index, type) => {
      this.abnormallyDeleteHandler(row, index, type)
    })
    this.$bus.$on('outpatient:delete-exception-cause-multi', (row, index) => {
      this.abnormallyDeleteHandler(row, index, 0)
    })
  },
  watch: {
    obj: {
      handler (v) {
        this.$emit('update:obj', v)
      },
      deep: true
    }
  },
  beforeDestroy () {
    this.dom && this.dom.removeEventListener('click', this.eventHandler, true)
  },
  methods: {
    init () {
      this.abnormalListData = []
      this.fullAbnormalAddData = []
      this.customAbnormal = ''
    },
    handlerSchemaShow (isBatch) {
      // 1、修改发货方式
      // a)主状态为“已完成”的，只允许修改为“邮寄”
      // b)邮寄标识为“已邮寄”的任务，不允许修改
      // 2、修改库房
      // a)主状态为“已完成”的任务，不允许修改发货库房
      // b)标记为异常的任务不允许修改库房
      // 3、异常处理
      // a)主状态为“已完成”的任务，不允许标记异常
      // b)发药方式为“自备”的任务，不允许标记异常
      // 4、发药完成
      // a)标记为“已完成”的任务
      // 1.允许修改发货方式为邮寄
      // 2.不允许标记异常
      // 3.不允许修改库房
      // 2、批次定价模式不能修改库房   ****** ！！！

      let schema = []
      // 驳回
      if (this.obj.auditReject) {
        return tempSchema.filter(item => item.identification).map(item => ({
          name: 'identification',
          label: '',
          comp: 'custom',
        }))
      }
      const { delivery, mailFlag, status, scene } = this.tableData[0]
      this.$ever.getFieldFromSchema(tempSchema, 'delivery').props.options = SEND_MODE
      if (this.identification) {  // 操作异常处方时， 只展示标记异常checkbox
        schema = tempSchema.filter(item => item.identification)
      } else {
        if (delivery === 1) {
          if (!mailFlag) {
            if (status >= 3) {
              schema = tempSchema.filter(item => { return item.name === 'delivery' })
            } else {
              schema = tempSchema.slice()
            }
          }
        } else if (delivery === 2) {
          schema = tempSchema.filter(item => !item.identification)
        } else {
          if (status === 3) {
            schema = tempSchema.filter(item => { return item.name === 'delivery' })
            schema[0].props.options = SEND_MODE.slice(1)
            this.obj.delivery = '1'
          } else {
            schema = tempSchema.slice()
          }
        }
      }
      if (scene === 6) schema = schema.filter(item => item.name !== 'identification')
      // 批次定价模式不展示修改库房
      if (isBatch) schema = schema.filter(item => item.name !== 'actualStorageRoomId')
      return schema
    },
    domEventHandler () {
      const dom = this.dom = document.querySelector('#treeBox')
      const commonTree = document.querySelector('#commonTree')
      let treeHeight = commonTree.offsetHeight // 树的历史高度
      return function eventHandler (e) {
        const domHeight = dom.offsetHeight // 盒子高度
        const targetHeight = e.target.offsetHeight + 20
        if (e.target.getAttribute('type') === 'button' || e.target.parentNode.getAttribute('type') === 'button') return
        setTimeout(function () {
          const top = dom.getBoundingClientRect().top // 元素上边距离页面上边的距离
          const newTreeHeight = commonTree.offsetHeight // 树的实时高度
          if ((e.pageY - top) > (domHeight - targetHeight) &&
            treeHeight < newTreeHeight) {
            treeHeight = newTreeHeight
            // todo: bug 最后一条数据展开不会向上滚动
            dom.scrollTo(0, dom.scrollTop + targetHeight)
          } else {
            treeHeight = 0
          }
        }, 0)
      }
    },
    addSelect: debounce(function (data, parentAllData) {
      if (this.isLayout && !this.selectionData.length) return this.$messageTips(this, 'warning', '请先勾选物资明细后再添加异常原因')
      if (!this.abnormalEle) {
        this.abnormalEle = document.querySelector('#abnormally')
      }
      const reason = this.abnormalListData.find(item => item.id === data.id)
      if (reason) return this.$messageTips(this, 'warning', '当前异常原因已经选择过了')
      // 拼接选中数据的父子联系
      let Allstr = parentAllData ? parentAllData.map(item => item.name).join('>') : ''
      this.abnormalListData.push(Object.assign(JSON.parse(JSON.stringify(data)), {contentText: Allstr ? Allstr : data.contentText}))
      this.$emit('single-abnormal-data', this.abnormalListData, this.customAbnormal, this.isMany)
      this.scrollTopTo()
    }),
    customAbnormalChangeHandler (v) {
      this.$emit('single-abnormal-data', this.abnormalListData, this.customAbnormal, this.isMany)
    },
    handleSelectionChange (selection) {
      // 记录表格勾选的数据
      this.selectionData = selection
    },
    markAbnormalHandler (isAbnormal) {
      this.$emit('update:isAbnormal', isAbnormal)
    },
    selectable (row) { // checkbox 是否可勾选
      return row
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    scrollTopTo () {
      if (this.abnormalEle) {
        this.$nextTick(_ => {
          this.abnormalEle.scrollTop = this.abnormalEle.scrollHeight
        })
      }
    },
    enterCustomAbnormal (name) {
      // 只有在按处方整单维度处理才会提交改方法 | 明细父子医嘱时
      if (!(name = name.trim()) &&
        !this.abnormalListData.length) return this.$messageTips(this, 'warning', '请选择异常信息或者输入异常信息后再添加')
      if (this.isLayout || this.isMany || this.pageType === 1) { // 按处方整单维度处理(父子医嘱) | 审核页面
        const isAudit = this.obj.auditReject // 驳回操作：需要区分是标记异常还是驳回，obj.auditReject为真时，为操作驳回
        this.selectionData.forEach(select => {
          // 添加驳回原因时， 手动把数据状态重置为待审核状态
          isAudit && (select.examineFlag = 1)
          const currentTable = this.table.find(item => item.taskId === select.taskId)
          // 异常原因： 点击添加 + 手动输入 => 用于前后端交互数据
          const abnormalList = this.customAbnormal ? [...this.abnormalListData, this.customAbnormal] : this.abnormalListData.slice()
          // 回显弹框中选择或填写的原因
          let reason = ''
          abnormalList.forEach((item, index) => ((item.contentText || item) && (reason += `${index + 1}、${item.contentText || item}<br/>`)))
          // 此处是只有选中项标记异常
          const abnormalIndex = this.fullAbnormalAddData.findIndex(item => item.taskId === select.taskId)
          // 此处只是做回显使用数据
          currentTable[isAudit ? 'rejectionReasons' : 'identificationInfo'] = reason
          // 回显标记异常是  添加异常状态
          if (!isAudit) {
            currentTable.identification = 1
          }

          if (~abnormalIndex) {
            this.fullAbnormalAddData.splice(abnormalIndex, 1, Object.assign({newIdentification: 1}, currentTable, { abnormalList }))
          } else {
            this.fullAbnormalAddData.push(Object.assign({}, currentTable, { abnormalList, newIdentification: 1 }))
          }
          // 此处是父子医嘱统一标记异常或者驳回原因
          // const { mainGroupId } = this.table[index]
          // this.table.forEach(list => {
          //   const taskitem = list
          //   if (taskitem.mainGroupId === mainGroupId) {
          //     const abnormalIndex = this.fullAbnormalAddData.findIndex(item => item.id === taskitem.id)
          //     // 此处只是做回显使用数据
          //     taskitem[isAudit ? 'rejectionReasons' : 'identificationInfo'] = reason
          //     if (~abnormalIndex) {
          //       this.fullAbnormalAddData.splice(abnormalIndex, 1, Object.assign({}, list, { abnormalList }))
          //     } else {
          //       this.fullAbnormalAddData.push(Object.assign({}, list, { abnormalList }))
          //     }
          //   }
          // })
        })
        this.$refs.table.$refs.everTable.clearSelection()
      }
      this.tableKey++
      this.abnormalListData = []
      this.customAbnormal = ''
      this.$emit('full-abnormal-add-data', this.fullAbnormalAddData, this.isMany)
    },
    abnormallyReasonDeleteHandler (row, index) {
      // 当前组件内删除已选择的异常原因(右侧)
      this.abnormalListData.splice(index, 1)
    },
    abnormallyDeleteHandler (row, index, type) {
      // 删除异常 左侧evertable 派发事件接收处理(左侧)
      // index: tabledata 明细下标
      // this.index: tabledata 下标
      // type  1:驳回原因  0:异常原因
      if (type && row.rejectionReasons && row.auditOpinion) return
      if (!type && !row.dialogFlag) return
      this.table[index][type ? 'rejectionReasons' : 'identificationInfo'] = ''
      this.tableKey++
      const fIndex = this.fullAbnormalAddData.findIndex(data => data.taskId === row.taskId)
      if (~fIndex) this.fullAbnormalAddData.splice(fIndex, 1)
      type ? this.$emit('delete-abnormally', row, this.parentIndex, index) : this.$emit('full-abnormal-add-data', this.fullAbnormalAddData, this.isMany)
    }
  },
  components: {
    ColtdFunctional,
    CommonTree
  }
}
</script>

<style lang="scss" scoped>
%reset {
  padding: 0;
  margin: 0;
}
.custom-form {
  &.audit {
    h3 {
      margin: 0;
    }
    /deep/ .el-col {
      border: none;
      padding: 0
    }
  }
  .select-abnormal {
    .ul {
      @extend %reset;
      li {
        @extend %reset;
        i.iconfont {
          flex: 0 0 20px
        }
      }
    }
    /deep/ .textarea {
      width: 100%;
      height: 30px;
    }
    .minus {
      margin-left: -1px;
    }
    /deep/ .el-table__row {
      td:last-child {
        padding-right: 15px
      }
    }
    .border-main {
      border: 1px solid #ddd;
    }
    height: 390px;
  }
  /deep/ .el-col {
    .el-form-item {
      margin-bottom: 0;
    }
    .custom-item {
      /deep/ .el-form-item__content {
        width: 50%
      }
    }
    border: 1px solid #ddd;
    padding: 5px;
    margin-top: -1px;
  }
  .el-form-item--mini .el-form-item__content, /deep/ .el-checkbox__label {
    line-height: 32px;
    font-weight: normal;
  }
  .list-enter-active, .list-leave-active {
    transition: all .2s;
  }
  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
