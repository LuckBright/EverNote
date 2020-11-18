<template>
  <div class="template-detail">
    <ever-bread-crumb ref="breadCrumb" show-edit-fnt="false" :have-return="true">
      <span class="tpml-back" slot="title" @click.stop="$refs.breadCrumb.prevBack">{{obj.id !== '-1' ? '编辑模版' : '新建模版'}}</span>
    </ever-bread-crumb>
    <div id="addtemplate" class="add-template">
      <div class="layout_inner">
        <ever-form2
          class="ever_form_spe label_bold"
          ref="tplForm"
          :nosubmit="true"
          :rules="rules"
          :schema="schema"
          v-model="obj"
          labelWidth="80px"
        ></ever-form2>
      </div>
      <div class="layout_inner template-table">
        <ever-table
          id="waittable"
          ref="taskTable"
          :loading="false"
          :columns="columns"
          :data="tableListData"
          :is-pagination="false"
          :is-drag-table="true"
          :span-method="arraySpanMethod"
          :header-cell-class-name="headerCellClassName"
          :cell-class-name="cellClassName"
          :row-class-name="rowClassName"
          :is-record-url-params="false"
          :not-select-checkbox="true"
          @configChange="configChange"
          :key="randomKey"
          border
        >
          <template slot="serviceType" slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :show-en="true"></sys-value>
          </template>
          <template slot="doctorAdviceName" slot-scope="scope">
            <span class="namesWrap">
              <!-- 父子医嘱标识 -->
              <span v-if="scope.row.mainFlag" class="leftIcons">
                <span class="top" v-if="String(scope.row.mainFlag) === '1'"></span>
                <span class="middle" v-else-if="waitDataObj[scope.row.mainGroupId].slice(-1)[0].serviceId !== scope.row.serviceId"></span>
                <span class="bottom" v-else></span>
              </span>
              <span class="cellMain">
                <!-- 组套 -->
                <template v-if="scope.row.setFlag">
                  <service-set-items :item="scope.row"></service-set-items>
                </template>
                <!-- 药品逻辑 -->
                <template v-else-if="['301', '302', '303', '304'].includes(scope.row.serviceType)">
                  <!-- 西药、中成药 -->
                  <template v-if="['301', '302'].includes(scope.row.serviceType)">
                    <drug-info class="bold" :drug-obj="scope.row"></drug-info>
                    <svg class="icon fontMargin" aria-hidden="true" v-if="scope.row.employ === '7'" style="font-size: 18px;">
                      <use xlink:href="#iconpishi"></use>
                    </svg>
                  </template>
                  <!-- 中药饮片、中药颗粒 -->
                  <template v-if="['303', '304'].includes(scope.row.serviceType)">
                    <span v-for="(drug, d) in scope.row.adviceFeesDtoList" :key="d" class="labWrap">
                      <label class="bold">{{drug.serviceName}}</label>
                      <label style="top:-5px;" class="lab" v-if="drug.footnote">
                        (<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drug.footnote"></sys-value>)
                      </label>
                      <label style="bottom:-5px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
                    </span>
                  </template>
                  <!-- 毒麻精放等标识 -->
                  <template v-if="scope.row.specialClassifyDrug">
                    <el-tooltip v-for="code in scope.row.specialClassifyDrug.split(',')" :key="code">
                      <span slot="content">{{specialClassify[code]&&specialClassify[code].name}}</span>
                      <span>{{code}}</span>
                      <svg class="icon fontMargin" aria-hidden="true">
                        <use :xlink:href="'#' + (specialClassify[code] && specialClassify[code].icon)"></use>
                      </svg>
                    </el-tooltip>
                  </template>
                </template>
                <!-- 非药品逻辑 -->
                <template v-else>
                  <span class="bold">{{scope.row.doctorAdviceName || scope.row.serviceName}}</span>
                </template>
                <!-- 甲乙丙类标识 -->
                <i class="iconfont icon-charge"
                  :class="{'icon-jia': String(scope.row.chargeLevel) === '1',
                  'icon-CombinedShape': String(scope.row.chargeLevel) === '2',
                  'icon-bing': String(scope.row.chargeLevel) === '3',
                  'icon-menzhen-lixiu': String(scope.row.chargeLevel) === '4'}"></i>
                <!-- 套餐标识 -->
                <i class="iconfont icon-taocan" v-if="scope.row.shopSetItemId"></i>
                <!-- 缺货标识 -->
                <svg class="icon fontMargin" aria-hidden="true" v-if="String(scope.row.shortAgeFlag) === '0'">
                  <use xlink:href="#icon-que"></use>
                </svg>
              </span>
            </span>
          </template>
          <template slot="doctorAdviceContent" slot-scope="scope">
            <span v-if="scope.row.adviceFeesDtoList && scope.row.adviceFeesDtoList[0] && String(scope.row.adviceFeesDtoList[0].feesType) === '2'">数量：{{scope.row.count}}{{scope.row.countUnitName || '项'}}</span>
            <advice-item-show :item="scope.row" :visit-type="visitType" v-else></advice-item-show>
          </template>
          <template slot="operation" slot-scope="scope">
            <el-button type="text" class="editor-btn" @click="editor(scope)">编辑</el-button>
            <el-button type="text" class="delet-btn" @click="del(scope)">删除</el-button>
          </template>
        </ever-table>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="saveTemplate" :disabled="!tableListData.length">保存</el-button>
          </el-col>
          <el-col :span="12" class="total">
            <span>总计: <i>{{getTotal()}}元</i></span>
          </el-col>
        </el-row>
      </div>
      <div class="layout_inner footarea">
        <prescription
          ref="pres"
          :left-icon="visitType === 3"
          :is-add-tpl="true"
          :title="''"
          :scene="visitType"
          :show-add="showAdd"
          :init-data.sync="waitSendData"
          :user-info="baseInfo"
          :share-info="{}"
          :share-time="{}"
          :search-type="1"
          :custom-items="['measure']"
          :self-schema-value="selfSchemaValue"
          :watch-custom="watchCustom"
          :init-value-befor="initValueBefor"
          :init-data-befor="initDataBefor"
          :linkages="linkages"
          :execute-provider-types="executeProviderTypes"
        >
          <!-- 剂量需要有领量 -->
          <template slot="measure" slot-scope="{order}" v-if="visitType === 3">
            <sys-text
              class="required"
              v-model="order.measure"
              type="number"
              :append="order.measureUnitName"
            ></sys-text>
            <label :class="+order.count?'el-form-item__info':'el-form-item__error'">
              {{$t('单次领量')}}:{{(order.count || 0) + (order.countUnitName || '')}}
            </label>
          </template>
        </prescription>
      </div>
    </div>
    <check-submit
      :check-list="visitType === 1 ? ['number'] : []"
      :base-info="baseInfo"
      @submit="submitOrders"
    ></check-submit>
  </div>
</template>

<script>
import api from '@/sob/store/tmpl.api.js'
import form from '@/util/form'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import drugInfo from '@/inpatient/components/drug.info'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import prescription from '@/inpatient/components/issued.orders/index.vue'
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue'
import {objSortBy, objRemove} from '@/util/common'
import {specialClassify} from '@/inpatient/components/doctor.state/index'
import i18n from '@/assets/locals/index'
import { findIndex } from 'lodash'

let schema = [
  {
    name: 'templateName',
    label: '模版名称',
    span: 6,
    props: {
      placeholder: '请输入模版名称',
      maxlength: 20
    }
  }
]
export default {
  mixins: [form],
  components: { adviceItemShow, drugInfo, serviceSetItems, prescription, checkSubmit },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.id = ''
    obj.type = ''
    obj.content = ''
    return {
      api,
      obj,
      userId: this.$store.state.currentUser.userId,
      baseInfo: this.$route.query,
      visitType: this.$route.params.visitType ? parseInt(this.$route.params.visitType) : 1,
      waitSendData: [],
      callbackData: '',
      showAll: true,
      showSend: true,
      showAdd: false,
      subDisabled: false,
      rules: {
        templateName: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      tableListData: [],
      randomKey: Math.random(),
      executeProviderTypes: ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
    }
  },
  computed: {
    waitDataObj () {
      let obj = {}
      this.tableListData.forEach(v => {
        if (v.adviceFeesDtoList.length) {
          v.chargeLevel = v.adviceFeesDtoList[0].feesJson && v.adviceFeesDtoList[0].feesJson.chargeLevel
        }
        if (obj[v.mainGroupId]) {
          obj[v.mainGroupId].push(v)
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      return obj
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.selfSchemaValue = new Function()
      this.space = this.$route.matched[0].meta.space
      this.obj.id = this.$route.params.id
      this.obj.type = this.visitType === 1 ? 100 : 101
      this.baseInfo.userId = this.userId
      this.setEditData()
      this.schema = schema
      this.specialClassify = specialClassify
      // 列配置
      this.columns = this.getColumns()

      this.linkages = ['useFreq', 'termType', 'useDay', 'source', 'executeProvider', 'executeNumber', 'employ', 'startTime', 'sendClinic', 'stopTime']
      if (this.visitType === 1) {
        this.executeProviderTypes = ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04']
        this.watchCustom = {}
        return
      }
      this.executeProviderTypes = ['01.01', '02.01', '02.02', '02.03', '02.04'] // 住院的开单科室类型
      this.selfSchemaValue = function (createSchema, service) {
        if (['301', '302'].includes(service.serviceClassification)) {
          objRemove(createSchema.schema, {name: 'count'})
        }
        let [termTypeSchema] = objRemove(createSchema.schema, {name: 'termType'})
        if (termTypeSchema) {
          if (service.code === 'chuyuan' || service.code === 'zhuanke') {
            delete createSchema.obj.termType
            return
          }
          termTypeSchema.col = {
            style: 'width: 100px'
          }
          createSchema.schema.unshift(termTypeSchema)
        }
      }
      // 监听开单属性值变化
      this.watchCustom = {
        source$: function (order, pos) {
          // 领量
          let countSchema = {
            comp: 'sys-text',
            label: '领量',
            name: 'count',
            span: 2,
            props: {
              append: order.countUnitName,
              clearable: false,
              disabled: false,
              display: 1,
              limitInteger: true,
              max: 999,
              min: 1,
              type: 'number'
            }
          }
          let schema = this.extendFormSchema[pos]
          if (+order.source === 33) {
            let index = findIndex(schema, {name: 'source'})
            index !== -1 && schema.splice(index + 1, 0, countSchema)
          } else {
            if (['301', '302'].includes(order.serviceType)) {
              objRemove(schema, {name: 'count'})
              this.watchCustom.measure.call(this, order)
              this.$set(this.extendFormSchema, pos, schema)
            }
          }
        },
        measure: function (order, opt) { // 住院的领量与剂量及出院带药有关
          if (order.measure) {
            if (+order.source === 33) {
              return
            }
            let freqval = 1
            let discountUnit = order.discountUnit
            let packageToPrepareRatio = order.packageToPrepareRatio
            let measure = order.measure
            let day = 1
            if (!freqval || !discountUnit) {
              return
            }
            if (+this.service.ifReused === 1) { // ifReuse是啥？
              let countNum = ((measure / discountUnit) * (+freqval) * day) / packageToPrepareRatio
              order.count = Math.ceil(countNum)
            } else {
              let countNum = (Math.ceil(measure / discountUnit) * freqval * day) / packageToPrepareRatio
              order.count = Math.ceil(countNum)
            }
          } else {
            order.count = ''
          }
        }
      }
    },
    initValueBefor (data, schema, vm) {
      if (this.visitType === 1) {
        return
      }
      this.watchCustom.measure.call(vm, data)
    },
    initDataBefor (data, schema, vm) {
      if (this.visitType === 1) {
        return
      }
      // 住院没有院外执行
      if (data.executeProvider && data.executeProvider.id === 'SOB_EXTUDE_PROVIDER_OUT') {
        if (this.baseInfo.providerId) {
          data.executeProvider = {
            id: this.baseInfo.providerId,
            name: this.baseInfo.providerName
          }
        } else {
          data.executeProvider = null
        }
      }
    },
    refresh () {
      this.randomKey = Math.random()
    },
    // 编辑等待区域的医嘱
    editWaitService (items) {
      this.callbackData = items
    },
    submitOrders (datas, type, done, fail) {
      if (!datas || !datas.length) {
        done && done()
        return
      }
      datas.forEach(item => {
        item = Object.assign({}, item, item.adviceJson)
        item = Object.assign({}, item, item.extendFieldJson)
        if (['303', '304'].includes(item.serviceType)) {
          item.price = (item.decoctPrice || 0) + (item.adviceFeesDtoList && item.adviceFeesDtoList.reduce((sum, v) => {
            return v.price + sum
          }, 0) || 0)
        }
        this.tableListData.push(item)
      })
      done && done()
    },
    setEditData () {
      if (this.obj.id === '-1' || !this.obj.id) {
        return false
      }
      api.getById(this.obj.id).then(rs => {
        if (!rs) {
          this.tableListData = []
          return
        }
        Object.assign(this.obj, rs)
        let data = JSON.parse(rs.content)
        this.tableListData = data.map(item => { // 兼容中药没有算价格的模版
          if (['303', '304'].includes(item.serviceType) && !item.price) {
            let price = (item.decoctPrice || 0) + (item.adviceFeesDtoList && item.adviceFeesDtoList.reduce((sum, v) => {
              return v.price + sum
            }, 0) || 0)
            price = price.toFixed(6)
            item.price = +price
          } else {
            if (item.price === undefined) {
              item.price = '--'
            } else {
              item.price = +(item.price && item.price.toFixed(6) || 0)
            }
          }
          return item
        })
      })
    },
    saveTemplate () {
      if (!this.tableListData.length) {
        return
      }
      this.subDisabled = true
      this.$refs.tplForm.$refs.form.validate(v => {
        if (!v) {
          this.subDisabled = false
          return false
        }
        let id = this.obj.id
        let params = {
          content: JSON.stringify(this.tableListData),
          templateName: this.obj.templateName,
          sceneType: this.visitType === 1 ? 1 : 3, // 场景 1-门诊模版 3-住院模版
          templateSource: 1,
          id
        }
        params = Object.assign({}, params, this.$route.query)
        api.createOrUpdate(params).then(rs => {
          if (rs.head.errCode) {
            this.subDisabled = false
            return false
          }
          this.$messageTips(this, 'success', '模版保存成功', '成功')
          this.$router.push({ name: 'templateList', query: {type: this.$route.query.templateType} })
        })
      })
    },
    del (scope) {
      objRemove(this.tableListData, {mainGroupId: scope.row.mainGroupId})
      this.refresh()
    },
    editor (scope) {
      let editList = this.tableListData.filter(item => item.mainGroupId === scope.row.mainGroupId)
      if (!editList) {
        return
      }
      this.$bus.$emit('edit:orderData', editList, () => {
        objRemove(this.tableListData, {mainGroupId: scope.row.mainGroupId})
        this.refresh()
      })
    },
    // 点击类型排序
    sortChange ({ column, prop, order }) {
      if (order === 'ascending') {
        this.sortMethods(this.sortType)
      } else if (order === 'descending') {
        this.sortMethods(this.sortType.reverse())
        // reverse 会改变原来的数组，再次reverse恢复原来的顺序
        this.sortType.reverse()
      } else {
        this.tableData = JSON.parse(this.initData)
      }
    },
    // 排序方法
    sortMethods (arr) {
      arr.forEach((item, index) => {
        this.tableData.map(value => {
          if (item === value.serviceType) {
            value.sortIndex = index
            return value
          }
        })
      })
      this.tableData = objSortBy(this.tableData, 'sortIndex')
    },
    // 给header设置类名
    headerCellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      if (this.configData && this.configData.length) {
        this.configData.forEach(item => {
          if (!item.hidden) count++
        })
      }
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        return 'pad-rt-30'
      }
    },
    // 给body中cell 设置类名
    cellClassName ({ row, column, rowIndex, columnIndex }) {
      let count = 0
      let config = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'operation']
      let configIndex = []
      if (this.configData && this.configData.length) {
        this.configData.forEach((item, index) => {
          if (!item.hidden) count++
          if (config.includes(item.prop)) configIndex.push(String(index))
        })
      }
      let className = []
      if (Number(column.columnKey) === count - 1 && column.align === 'is-right') {
        className.push('pad-rt-30')
      }
      if (configIndex.includes(column.columnKey)) {
        if (row.mainFlag && this.waitDataObj[row.mainGroupId] && this.waitDataObj[row.mainGroupId].length) {
          if (this.waitDataObj[row.mainGroupId].length > this.waitDataObj[row.mainGroupId].findIndex(item => { return item.serviceId === row.serviceId }) + 1) {
            className.push('noBottomBorder')
          }
          // 处理父子医嘱标识问题
          if (String(row.mainFlag) === '1') {
            className.push('topCell')
          } else {
            if (row.serviceId === this.waitDataObj[row.mainGroupId][this.waitDataObj[row.mainGroupId].length - 1].serviceId) {
              className.push('bottomCell')
            } else {
              className.push('middleCell')
            }
          }
        }
      }
      return className.join(' ')
    },
    // 给row设置类名
    rowClassName ({ row, rowIndex }) {
      return this.rowClass + (row && row.isSelect ? ' selectbg' : '')
    },
    // 调整table字段位置后回调
    configChange (data) {
      this.configData = data
    },
    // 合并单元格处理
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // 父子医嘱合并单元格
      if (columnIndex === 5 || columnIndex === 6) {
        if (row.mainFlag === 1) {
          let m2 = this.waitDataObj[row.mainGroupId] && this.waitDataObj[row.mainGroupId].length || 0
          return {rowspan: m2, colspan: 1}
        } else if (row.mainFlag > 1) return {rowspan: 0, colspan: 0}
      }
    },
    // 模版总计费用
    getTotal () {
      let total = this.tableListData && this.tableListData.reduce((sum, item) => {
        return sum + item.price
      }, 0)
      if (isNaN(total)) {
        return 0
      }
      return +total.toFixed(6)
    },
    getColumns () {
      return [
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: i18n.t('类型'),
          minWidth: '6%',
          sortable: true,
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: i18n.t('名称'),
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: i18n.t('内容'),
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: i18n.t('嘱托'),
          showOverflowTooltip: true,
          minWidth: '15%',
          undraggable: true
        },
        {
          prop: 'price',
          label: i18n.t('单次价格'),
          showOverflowTooltip: true,
          minWidth: '8%',
          undraggable: true
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '10%',
          undraggable: true
        },
        {
          slot: 'operation',
          prop: 'operation',
          label: i18n.t('操作'),
          showOverflowTooltip: true,
          minWidth: '10%',
          // hidden: true,
          undraggable: true
        }
      ]
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        this.userId = val.userId
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.template-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tpml-back {
  cursor: pointer;
}
.add-template {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #d9ddde;
  box-sizing: border-box;
  .layout_inner {
    background-color: transparent;
  }
  .template-table {
    flex: 1;
    background-color: none;
  }
  .footarea {
    background-color: none;
    position: relative;
    padding: 20px 15px;
    margin-top: 5px;
    border-top: 1px solid #d9ddde;
    background-color: #e1e7ea;
  }
  .el-form-item__info {
    display: block;
    color: #666;
    background: #ebedef;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .execute-provider {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .el-table {
    tr {
      .noBottomBorder {
        border-bottom: none;
      }
      .pad-rt-30 {
        .cell {
          padding-right: 30px;
        }
      }
      &:hover {
        td {
          background: transparent;
        }
      }
      .topCell {
        .cell {
          margin-bottom: -4px;
        }
      }
      .middleCell {
        .cell {
          margin-top: -4px;
          margin-bottom: -4px;
        }
      }
      .bottomCell {
        .cell {
          margin-top: -4px;
        }
      }
      .cell {
        .namesWrap {
          display: flex;
          .leftIcons {
            width: 6px;
            margin-right: 8px;
            position: relative;
            .top {
              border-top: 3px solid;
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 8px;
              bottom: 0;
            }
            .middle {
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 0;
              bottom: 0;
            }
            .bottom {
              border-bottom: 3px solid;
              border-left: 3px solid;
              width: 100%;
              height: 10px;
              position: absolute;
              top: 0;
            }
          }
          .cellMain {
            flex: 1;
            .labWrap {
              position: relative;
              margin: 5px 40px 5px 0;
              line-height: 1.5;
              word-wrap: break-word;
              display: inline-block;
              .lab {
                font-size: 12px;
                position: absolute;
                right: -48px;
                width: 48px;
                transform: scale(0.9, 0.9);
              }
            }
          }
        }
      }
    }
    .selectbg {
      background: #FEF5BE;
      &:hover {
        background: #FEF5BE !important;
      }
    }
    .iconfont {
      color: #999;
    }
    .icon-charge {
      color: #009944;
    }
    .iconYouji {
      color: #FF4F00;
      position: absolute;
      top: 1px;
      right: 0;
      font-size: 24px;
    }
  }
  .noRelateDpt {
    margin: 0;
    color: #ee4433;
  }
  .editor-btn {
    color: #409eff
  }
  .delet-btn {
    color: #f56c6c
  }
  .total {
    font-size: 16px;
    text-align: right;
    i {
      font-size: 20px;
      font-style: normal;
      color: red;
      font-weight: bold;
      padding-right: 15px;
    }
  }
}

</style>

