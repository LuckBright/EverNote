<template>
  <div class="flex_column_full_hidden">
    <div class="layout_inner flex_column_full_hidden">
      <div class="main-head pos_re">
        <ever-form2 :schema="schema" v-model="queryObj" ref="form" :inline="true" :class="{pr100: !isClinic || (isClinic && priceManage)}">
          <template slot="type">
            <el-cascader
              :options="typeOpts"
              size="small"
              clearable
              placeholder="物资类别"
              v-model="queryObj.type"
              @change="queryEvent">
            </el-cascader>
          </template>
          <template slot="state" v-if="isClinic">
            <ever-select
              v-model="queryObj.state"
              placeholder="请选择物资状态"
              :options="stateOption"
              :clearable="true"
            ></ever-select>
          </template>
          <template slot="splitFlag">
            <el-checkbox v-model="splitFlag" :true-label="1" @change="queryEvent">查看拆零物资</el-checkbox>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="query(queryObj)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="pos_ab pricebtn" v-if="!pathSwitch">
          <span v-if="routerPath !== '/workspace/druglist'" :class="{pr100: !isClinic}">
            <el-button
              v-if="haveManage"
              type="primary"
              size="small"
              @click="$router.push(isClinic ? `/warehouse/materialdetail/${isBacth ? '?isBatch=true' : '?' }`: '/manages/materialinfo?isConcise=1')"
            >新建物资</el-button>
          </span>
          <column-filter v-if="isClinic" v-model="priceColumns" ref="columnFilter"></column-filter>
          <template v-if="isBacth && isClinic">
            <!-- 批量设置加成率 -->
            <bulk-set-mark class="ml10 mr10" :typeOptions="typeOpts" :api="api"></bulk-set-mark>
            <!-- 批次定价的调价历史 -->
            <el-button type="primary" size="small" @click="$router.push('/warehouse/pricedetailslist?isBatch=true')">调价历史</el-button>
          </template>
          <!-- 批次定价不显示 -->
          <span v-if="!isBacth">
            <price-mutil
              v-if="isClinic && priceManage"
              :orgTree="[]"
              sourceModule="warehouse"
              :isTenant="false"
              @publishSuccess="publishSuccess"
            ></price-mutil>
            <price-submit-button
              v-if="isClinic && priceManage"
              size="small"
              type="primary"
              class="price-submit-btn"
              source="org"
              :checkLength="true"
              sourceModule="warehouse"
              @submit="priceSubmit"
            ></price-submit-button>
          </span>
          <doc-download
            @downFile="downFile"
            class="ml5"
            :size="'small'"
            @exportStatus="changeStatus"
            ref="childMethodt"
            btnTxt="导出价格"
          ></doc-download>
        </div>
      </div>
      <ever-table
        ref="everTable"
        :columns="columns"
        :border="true"
        :table-class="'no-hover'"
        class="flex_column_full_hidden"
        v-bind="abc"
        :tableKey="'localMaterialId'"
        :data="isClinic ? tableDataList : tableData">
        <!-- 物资展示 -->
        <template slot="materialName" slot-scope="scope">
          <a @click="handleLookDetail(scope.row.id, activeName, scope.row.id, scope.row)">
            <wh-code-to-name
              v-if="scope.row.ext"
              :isExt="true"
              :cType="3"
              :patchObj="{list: scope.row.ext}">
            </wh-code-to-name>
          </a>
        </template>
        <!-- 规格展示 -->
        <template slot="spec" slot-scope="scope">
          <wh-code-to-name
            v-if="scope.row.ext"
            :isExt="true"
            :showIcon="false"
            :patchObj="{
              standard: true,
              list: scope.row.ext,
              code: [[]], // 方法中默认会处理规格字段的code
            }">
          </wh-code-to-name>
        </template>
        <!-- 状态 -->
        <template slot="status" slot-scope="scope" v-if="isClinic">
          <span :class="{'red': scope.row.state === 1}">{{scope.row.state | stateDesc}}</span>
        </template>
        <!-- 批次定价详情弹窗 -->
        <template slot="priceDetails" slot-scope="scope">
          <el-button type="text" @click="materialBacthOpen(scope.row)" v-if="scope.row.sysBatchCode">详情</el-button>
        </template>
        <!-- 价格管理 -->
        <template v-for="item in columns">
          <el-table-column
            :key="item.prop"
            :slot="item.prop"
            v-if="item.display"
            :label="item.label"
            :width="item.width"
            :prop="item.prop">
            <template slot="header" slot-scope="scope">
              {{item.label}}
            </template>
            <template slot-scope="scope">
              <col-td :row="scope.row" :render="bindObj(item.render)" :td-key="item.prop" :td-key-name="item.label"></col-td>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current="current"
        :totalCount="totalCount"
      ></ever-pagination>
      <!-- 批次定价弹窗 -->
      <material-bacth-dialog ref="materialBacthDialog" :isBacth="isBacth"></material-bacth-dialog>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import { columns } from './columns.js'
import * as enumConfig from '@/util/common'
import api from './store/materiallistapi'
import manageapi from '@/manages/page/material/materialapi'
import classify from '@/warehouse/util/classify'
import ManageConfigMixin from '@/manages/mixin/manageconfigmixin'
import BeforeRouteLeave from '@/warehouse/util/mixins/before.route.leave'
import templateApi from '@/manages/api/template'
import { PACKAGE_MUSTER } from '@/manages/config'
import '@/warehouse/page/assets/index.scss'
import whCodeToName from '@/warehouse/page/components/code.to.name'
import { REMOTE_METHODS_PLACEHOLDER, REMOTE_METHODS_WIDTH, DOWNLOAD_FILE } from '@/warehouse/views/util/constant'
import ClassifyCascader from '@/warehouse/page/components/classifycascader'
import priceSubmitButton from '@/manages/components/price.manage/price.submit.vue'
import priceMutil from '@/manages/components/price.manage/price.mutil.vue'
import priceInfo from '@/manages/components/price.manage/price.info'
import columnFilter from '@/manages/components/price.manage/column.filter.vue'
import storage from '@/util/storage'
import colTd from '@/manages/components/relevance.table/coltd.js'

let schema = [
  {
    name: 'type',
    label: '物资类型',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '物资名称',
    props: {
      placeholder: REMOTE_METHODS_PLACEHOLDER
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'state',
    label: '状态',
    comp: 'custom'
  },
  {
    name: 'splitFlag',
    comp: 'custom'
  }
]
let stateOption = [
  {
    name: '启用',
    id: '0'
  },
  {
    name: '停用',
    id: '1'
  }
]
let systemType = enumConfig.STENCIL_TYPE[0].id
export default {
  components: {
    whCodeToName,
    ClassifyCascader,
    priceSubmitButton,
    priceMutil,
    colTd,
    columnFilter,
    materialBacthDialog: () => import('@/warehouse/page/institutionmaterial/materia.batch.dialog.vue'),
    bulkSetMark: () => import('@/warehouse/page/institutionmaterial/bulkset.mark.vue')
  },
  mixins: [list, classify, ManageConfigMixin, BeforeRouteLeave],
  props: {
    isBacth: { // 是否是批次定价
      type: Boolean,
      default: false
    },
    isClinic: {
      type: Boolean,
      default: true
    },
    pr: {
      type: Boolean,
      default: false
    }
  },
  data () {
    if (!this.isClinic && schema.length > 3) schema.splice(2, 1)
    let queryObj = this.$ever.createObjFromSchema(schema)
    Object.assign(queryObj, { systemType: enumConfig.STENCIL_TYPE[0].id })
    queryObj.systemType = systemType
    queryObj.isClinic = this.isClinic
    queryObj.classifyId = ''
    if (this.isClinic) {
      queryObj.usePermission = 1
    } else {
      queryObj.managePermission = 1
    }
    queryObj.orderType = enumConfig.ORDER_TYPE[1]
    return {
      pathSwitch: this.$route.path === '/workspace/druglist',
      abc: {
        [(!this.isClinic || this.$route.path === '/workspace/druglist') ? 'height' : 'xxx']: 400
      },
      PACKAGE_MUSTER,
      systemTypeObject: enumConfig.STENCIL_TYPE[0],
      api,
      columns,
      enumConfig,
      noClearParams: ['classifyId', 'name', 'state'],
      stateOption,
      codesMatchValuesCodes: [...enumConfig.MATERILA_PINYIN_CODE, ...enumConfig.SEARCH_CODE, enumConfig.GENERAL_CODE],
      queryObj,
      schema,
      splitFlag: 1,
      activeName: 'materiallists',
      pathName: this.$route.name,
      routerPath: '', // 记录当前路由地址
      systemType,
      typeOpts: [],
      scene: [],
      tableDataList: [],
      priceChangeList: [],
      priceColumns: [],
      noStoreQuery: true,
      btnLoading: false
    }
  },
  computed: {
    CLINICID () {
      return storage.getLocalStorage('CLINICID') || ''
    }
  },
  // 离开当前路由进入详情，给详情路由修改菜单选中状态
  beforeRouteLeave (to, from, next) {
    if (to.name === 'materialdetail') {
      to.meta.thirdActiveIndex = from.path
    }
    next()
  },
  activated () {
    this.priceChangeList = []
    this.list()
  },
  async created () {
    this.routerPath = this.$route.path
    if (this.isClinic) this.queryObj.isBathchPrice = this.isBacth
    if (!this.isClinic) {
      this.columns = this.columns.filter(item => !item.mate)
    }
    this.fetchMaterialType()
  },
  methods: {
    materialBacthOpen (row) {
      this.$refs.materialBacthDialog.open(row, this.priceColumns, this.CLINICID)
    },
    changeStatus (a) {
      if (a) {
        this.$messageTips(this, 'success', '导出价格成功')
      }
    },
    downFile () {
      let params = {
        usePermission: 1,
        isClinic: true,
        ifService: [2, 3]

      }
      this.$refs.childMethodt.loading = true
      if (this.isBacth) params.isBathchPrice = this.isBacth
      manageapi.getExcelPrice(params).then(result => {
        if (result) {
          this.$refs.childMethodt.downfile(DOWNLOAD_FILE + result.fileName)
        }
        this.$refs.childMethodt.loading = false
      })
    },
    publishSuccess () {
      this.list()
    },
    // 提交修改价格
    priceSubmit (submit, param) {
      let newObj = [{
        orgId: this.CLINICID,
        items: []
      }]
      this.priceChangeList.forEach(item => {
        newObj[0].items = newObj[0].items.concat(item.items)
      })
      param.data = newObj
      submit(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '调价发布成功')
          this.priceChangeList = []
          this.list()
        }
      })
    },
    // 输入框价格发生变动
    priceChange (serviceId, data) {
      data.itemId = serviceId
      let priceChangeObj = {}
      this.priceChangeList.forEach(item => {
        item.items.forEach(v => {
          priceChangeObj[v.itemId + '&&' + v.scene] = v
        })
      })
      if (data.originalPrice !== null && +data.originalPrice === data.currentPrice) {
        delete priceChangeObj[data.itemId + '&&' + data.scene]
      } else {
        priceChangeObj[data.itemId + '&&' + data.scene] = data
      }
      let resObj = {}
      Object.keys(priceChangeObj).forEach(key => {
        let keys = key.split('&&')
        let serviceId = keys[0]
        if (resObj[serviceId]) {
          resObj[serviceId].items.push(priceChangeObj[key])
        } else {
          resObj[serviceId] = {
            orgId: this.CLINICID,
            items: [priceChangeObj[key]]
          }
        }
      })
      this.priceChangeList = Object.values(resObj)
    },
    async pullPrice () {
      const serviceList = this.tableData.filter(item => item.serviceId)
      const itemIdList = serviceList.map(item => item.serviceId)
      let sysBatchCodeList = []
      if (this.isBacth) {
        serviceList.forEach(code => {
          if (code.sysBatchCode) sysBatchCodeList.push(code.sysBatchCode)
        })
      }
      const flag = this.isBacth ? sysBatchCodeList.length : true
      if (this.isClinic) {
        const info = itemIdList.length && flag ? await priceInfo.getPriceConfig({ itemIdList, orgId: this.CLINICID }, 'item', this.isBacth ? sysBatchCodeList : false) : {data: [], columns: []}
        this.priceColumns = info.columns
        // 批次定价模式下，价格无法编辑
        let priceColumns = [].concat(priceInfo.getPriceColumns.call(this, info.columns, info.data, 'usePermission', this.isBacth ? true : this.pathSwitch ? this.pathSwitch : !this.priceManage))
        if (this.isBacth && sysBatchCodeList.length) {
          priceColumns.push({
            label: '价格详情',
            prop: 'priceDetails',
            wdth: 80,
            align: 'center',
            slot: 'priceDetails',
          })
        }
        this.tableData.forEach(item => {
          item = Object.assign(item, { priceData: info.data[item.serviceId] || {} })
        })
        this.columns = [].concat(columns, priceColumns)
        if (this.priceColumns && this.$refs.columnFilter) this.$refs.columnFilter.options = this.priceColumns
        return JSON.parse(JSON.stringify(this.tableData))
      }
    },
    bindObj (render) {
      return render.bind(this)
    },
    // 请求物资分类
    async fetchMaterialType () {
      let options = await templateApi.getSourceByClassify(enumConfig.STENCIL_TYPE[0].id).then(res => {
        return res
      })
      this.typeOpts = this.handleMaterialType(options)
    },
    // 处理物资分类数据格式为级联组件要求格式
    handleMaterialType (options) {
      options.forEach(item => {
        item.value = item.id
        item.label = item.name
        item.children = JSON.parse(JSON.stringify(item.classifyList))
        delete item.classifyList
        if (item.children && item.children.length) this.handleMaterialType(item.children)
      })
      return options
    },
    queryEvent () {
      if (this.splitFlag) {
        delete this.queryObj.splitFlag
      } else {
        this.queryObj.splitFlag = 0
      }
      const size = this.queryObj.type.length
      this.queryObj.classifyId = size ? this.queryObj.type[size - 1] : ''
      this.list(true)
    },
    handleLookDetail (id, activeName, localId, v) {
      let curTab = this.routerPath.split('/').pop()
      localId = localId || 0
      let curPath = '/warehouse/materialdetail'
      if (this.routerPath === '/workspace/druglist') curPath = '/workspace/materialdetail'
      if (this.isClinic) {
        this.$router.push(`${curPath}/${id}?source=${curTab}&groupId=${id}&haveManage=${this.haveManage ? 1 : 0}&priceManage=${this.priceManage ? 1 : 0}${this.isBacth ? '&isBatch=true' : ''}`)
      } else {
        this.$router.push(`/manages/materialinfo/${id}?isConcise=1&priceManage=${this.priceManage ? 1 : 0}`)
      }
    },
    setPackSpec (data) {
      // 中药类型：CHINESE_MEDICINE_TYPE
      // 西药类型：WEST_MEDICINE_TYPE
      const classify = this.enumConfig.objGet(data, 'classifyObject.id', '')
      let propertys = null
      if (this.enumConfig.WEST_MEDICINE_TYPE.includes(classify)) {
        propertys = [this.enumConfig.SPU_SPEC_CODE]
      } else if (this.enumConfig.CHINESE_MEDICINE_TYPE.includes(classify)) {
        propertys = PACKAGE_MUSTER.CHINESE_MEDICINE_PACKAGE_CODE
      } else {
        // 除药品类其他类型展示规则
        propertys = PACKAGE_MUSTER.WARES_PACKAGE_CODE
      }
      return this.enumConfig.parserComplex({ data, propertys, split: '' })
    }
  },
  watch: {
    'tableData': {
      async handler (v) {
        this.tableDataList = await this.pullPrice()
        this.tableDataList && this.tableDataList.forEach(item => {
          // 批次定价模式
          item.usePermission = (item.state || item.ifService === 1) ? 0 : 1
          item.orgId = item.serviceId
        })
      },
      deep: true,
    },
    priceColumns (val) {
      let columnDisplay = {}
      let cols = [...val, ...columns]
      cols.forEach(item => {
        columnDisplay[item.prop] = true
      })
      this.columns.forEach(item => {
        if (!columnDisplay[item.prop]) {
          item.display = false
        } else {
          item.display = true
        }
      })
    },
    'queryObj.name' (v) {
      if (v) {
        Object.assign(this.queryObj, { codesMatchValues: [{ codes: this.codesMatchValuesCodes, value: v.toString().trim() }] })
      } else {
        delete this.queryObj.codesMatchValues
      }
      this.query(this.queryObj)
    },
    '$route' (v) {
      this.routerPath = v.path
      if (this.pathName !== v.name) {
      }
    },
    'queryObj.state' (val) {
      this.query(this.queryObj)
    }
  },
  filters: {
    stateDesc (val) {
      let statedesc = val === 1 ? '停用' : '启用'
      return statedesc
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table__body .el-table__row td .cell .btn {
  display: none;
}
.el-table__body .el-table__row:hover td .cell .btn {
  display: block;
}
.queryClass {
  width: 180px;
  display: inline-block;
  margin-right: 5px;
}
</style>
<style lang="scss" scoped>
.pricebtn {
  right: 0px;
  top: 0px;
}
/deep/ .confirmstyle {
  .confirm-title {
    text-align: center;
  }
  .confirm-text {
    text-align: center;
  }
}
.bor_0{
  /deep/ .el-input{
    border: 0;
  }
}
.pr100{
  padding-right: 190px;
}
</style>
