<template>
  <div
    class="layout_inner flex_column_full_hidden"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <!-- 查询 -->
    <ever-form2 :schema="schema" v-model="obj" class="form" @query="query" :inline="true">
      <template slot="showTypes">
        <el-cascader
          style="width: 320px;"
          placeholder="请选择分列项"
          :options="showTypesOptions"
          v-model="obj.showTypes"
          :clearable="false"
          @change="handleCascader"
          :props="{ checkStrictly: true }">
        </el-cascader>
      </template>
      <template slot="material">
        <material-select
          ref="remoteselect"
          class="method-width"
          :needObjFlag="true"
          v-model="obj.material"
          :params="materialParams"
        ></material-select>
      </template>
      <span slot="default">
        <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
        <el-button @click="handlerReset" size="small">重置</el-button>
        <!-- 导出 -->
        <doc-download
          class="ml5"
          :exportType="exportType"
          @downFile="downFile"
          @exportStatus="changeStatus"
          ref="exportExcel"
          :size="'small'"
          btnTxt="导出"
        ></doc-download>
        <!-- checkbox 组 -->
        <div class="fr">
          <span v-if="routeName === 'inventory'">
            <el-checkbox
              v-model="checkObj.viewAll"
              v-if="!status || status === '20'"
            >显示全部（包括实际库存为0的物资）</el-checkbox>
            <el-checkbox v-model="checkObj.flag" v-if="status && status === '24'">显示金额</el-checkbox>
            <!-- <el-checkbox v-model="checkObj.viewAll" v-if="status && status === '24'">显示系统结存</el-checkbox> -->
            <el-checkbox v-model="storageRoomItemze" v-if="status && status === '24'">库房分列</el-checkbox>
          </span>
        </div>
      </span>
    </ever-form2>
    <!-- 表单区域 -->
    <div
      :style="tableWidth"
      class="flex_col_1_hidden main-wrap custom-sort-icon"
      id="purchasingBox"
    >
      <el-table
        border
        :data="tableData"
        :summary-method="getSummaries"
        :show-summary="true"
        :row-class-name="tableRowClassName"
        :max-height="tableHieght"
        height="100%"
        style="width: 100%"
      >
        <el-table-column
          v-for="(inven, index) in invoList"
          :key="index + inven.key + status"
          :prop="inven.key"
          :align="inven.location || 'center'"
          :width="inven.width"
          :fixed="inven.fixed"
          :label="inven.value"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row[inven.key] || scope.row[inven.key] === 0"
              :class="{ 'mr10': index === invoList.length - 1 }"
            >
              <span v-if="inven.textType === 'money'">{{scope.row[inven.key] | formatToFinacial(4)}}</span>
              <span v-else class="form_cell">{{scope.row[inven.key]}}</span>
            </span>
            <span v-else :class="{ 'mr10': index === invoList.length - 1 }">- -</span>
          </template>
          <el-table-column
            v-if="inven.titleDtoList"
            v-for="(column, i) in inven.titleDtoList"
            :width="column.width ? column.width : ''"
            :key="i + column.key + status"
            :align="column.location || 'center'"
            :prop="column.key"
            :label="column.value"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row[column.key] || scope.row[column.key] === 0"
                :class="{ 'mr10': i === inven.titleDtoList - 1 }"
              >
                <span
                  v-if="column.textType === 'money'"
                >{{scope.row[column.key] | formatToFinacial(4)}}</span>
                <span v-else class="form_cell">{{scope.row[column.key]}}</span>
              </span>
              <span v-else :class="{ 'mr10': index === inven.length - 1 }">- -</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <ever-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import materialApi from '@/warehouse/page/institutionmaterial/store/materiallistapi.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import getmaterialinfoapi from '@/warehouse/store/getmaterialinfoapi.js'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import supplierpriceapi from '@/warehouse/store/supplierpriceapi.js'
import supplyapi from '@/warehouse/page/supplyapi/supplyapi.js'
import storage from '@/util/storage'
import purchasingApi from '@/warehouse/page/storages/reportform/purchasing/purchasingapi.js'
import materialSelect from '@/warehouse/page/components/material.select.vue'
import {
  REMOTE_METHODS_PLACEHOLDER,
  REMOTE_METHODS_WIDTH,
  DOWNLOAD_FILE,
  BUSINESS_TYPE_COLLECT } from '@/warehouse/views/util/constant'
import {
  STENCIL_TYPE,
  searchDateMoment,
  dateFormat,
  STORAGE_ROOM_TYPE,
  MATERIA_TYPE_OPTIONS} from '@/util/common'
import purchasingMixin from './purchasing.mixin.js'
import schemaObj from './purchasingschema.js'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import { request } from '@/util/req'
import transferAxios from '@/manages/page/organization/utils/axios'

let querySchema = [ // 报表查询
  {
    name: 'storageRoomIds',
    label: '库房',
    comp: 'sys-select',
    style: 'width: 270px;',
    props: {
      placeholder: '请选择药房',
      options: [],
      field: {
        multiple: true,
        collapsetags: true
      }
    },
  },
  {
    name: 'materialTypes',
    label: '物资分类',
    comp: 'sys-select',
    style: 'width: 100px;',
    props: {
      placeholder: '请选择物资',
      options: MATERIA_TYPE_OPTIONS,
    },
  },
  {
    name: 'material',
    label: '物资名称',
    comp: 'custom',
    class: 'method-width',
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'printCode',
    label: '序号',
    comp: 'el-input',
    style: 'width: 100px;'
  },
  {
    name: 'date',
    label: '业务日期',
    comp: 'ever-range-picker',
    style: 'width: 360px;',
    class: 'data_picker',
    props: {
      dateType: 'datetimerange',
      noclear: true,
      outformat: 'YYYY-MM-DD HH:mm:ss',
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: {}
    }
  }
]
let businessOption = [{ id: '', name: '全部' }, { id: '1', name: '采购入库单' }, { id: '2', name: '采购退货单' }]
export default {
  props: {
    api: {
      type: Object,
      default: () => { }
    },
    apiName: {
      type: String,
      default: ''
    },
    exportType: {
      type: String,
      default: ''
    },
    reStatus: {
      type: String,
      default: ''
    },
    hisSubModule: {
      type: String,
      default: ''
    }
  },
  mixins: [getstorage, purchasingMixin],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    obj.startDate = ''
    obj.endDate = ''
    obj.date = []
    obj.clinicIds = []
    return {
      schema: [],
      obj,
      printArr: ['WH_DRUG_100_40', 'WH_DRUG_50_40', 'WH_DRUG_68_52'],
      schemaObj,
      checkObj: {
        viewAll: false,
        flag: false,
      },
      storageRoomItemze: 0,
      cacheShowTypes: [], // 缓存一份showType
      initoptions: [],
      querySchema,
      businessOption,
      tenantId: storage.getStorageByClinic('TENANTID') || '', // 集团机构id
      REMOTE_METHODS_PLACEHOLDER,
      STORAGE_ROOM_TYPE, // 库房类型
      MATERIA_TYPE_OPTIONS, // 物资分类
      status: this.reStatus,
      getmaterialinfoapi,
      materialApi,
      materialParams: {},
      STENCIL_TYPE,
      materialList: [], // 待处理的物资分类数据
      clincOption: [], // 集团机构options
      storageroomapi,
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      clincId: storage.getStorageByClinic('CLINICID') || '', // 储存的当前机构ID
      tableData: [], // 列表数据
      invoList: [], // 进销存报表数据
      loading: false,
      supplierOptions: [], // 供应商options
      sumsObj: {}, // 合计对象
      routeName: '',
      tableWidth: '', // 表格的宽度
      tableHieght: '0',
      type: null,
      once: true,
      printCodeSetting: 2, // 是否展示序号配置 1：展示 2：不展示
      isTaskform: false,
      showTypesOptions: [], // 分列options
      storageItem: [] // 本人拥有的库房列表
    }
  },
  components: {
    materialSelect
  },
  mounted () { // 实时获取窗口高度来改变表格的流体高度
    this.storageItem = JSON.parse(storage.getLocalStorage('STORAGE_ITEM'))
    window.onresize = () => {
      this.$nextTick(() => {
        let purchasingBox = document.querySelector('#purchasingBox')
        if (this.tableHieght === `${purchasingBox.offsetHeight}`) return
        this.tableHieght = `${purchasingBox.offsetHeight - 55}`
      })
    }
  },
  watch: {
    'reStatus': {
      async handler (val) {
        let newSchema = [...this.querySchema]
        this.routeName = this.hisSubModule
        if (['14', '15'].includes(val)) {
          newSchema.unshift(this.schemaObj.SUPPLIER)
          newSchema.splice(3, 0, this.schemaObj.BUSINESS_TYPE)
          this.setSupplyOptions(newSchema)
        } else {
          newSchema = [...this.querySchema]
        }
        let dateObj = newSchema.find(item => item.name === 'date')
        //  其他 限制 结束时间只能选择当前时间23:59:59
        if (dateObj) {
          this.getOutpatientSchema(dateObj, val)
        }
        if (this.routeName === 'hospitalization') { // 发退药报表
          newSchema[0] = this.schemaObj.SECTIONS
          newSchema.unshift(this.schemaObj.BUSINESS_TYPE_MULTIPLE)
        }
        this.getInventorySchema(newSchema, dateObj, val)
        if (['21', '14'].includes(val)) {
          if (this.$route.matched[0].path === '/bi') {
            this.showTypesOptions = [{ value: '1', label: '按机构分列', children: [...this.schemaObj.BREAKDOWN_TYPE_OPTIONS] }]
          } else {
            this.showTypesOptions = JSON.parse(JSON.stringify(this.schemaObj.BREAKDOWN_TYPE_OPTIONS))
          }
          newSchema.push(this.schemaObj.BREAKDOWN_TYPE)
        }
        if (this.$route.matched[0].path === '/bi') { // 统计分析工作站
          this.schema = [this.schemaObj.CLINICIDS, ...newSchema]
          Object.assign(this.materialParams, { managePermission: 1, clinicId: this.tenantId })
          this.type = 1
        } else {
          this.schema = [...newSchema]
          this.type = 2
        }
        this.status = val
        await this.getPrintCodeSetting()
        if (val !== this.status) {
          this._info()
          this.query()
        }
      },
      deep: true,
      immediate: true
    },
    obj: {
      handler (v) {
        v.materialID = v.material ? v.material.materialSkuId : ''
        if (Array.isArray(v.date)) {
          v.startDate = v.date[0] || ''
          v.endDate = v.date[1] || ''
        }
      },
      deep: true
    },
    'obj.businessTypes': {
      handler (v) {
        let interestedParties = this.$ever.getFieldFromSchema(this.schema, 'interestedParties')
        if (v && v.length) {
          let params = {
            businessTypes: this.obj.businessTypes,
            clinicIds: this.obj.clinicIds
          }
          interestedParties && purchasingApi.getRelatedParty(params).then(res => {
            if (res && res.length) {
              this.obj.interestedParties = res.filter(key => {
                return this.obj.interestedParties.find(item => { return item.id === key.id })
              })
            } else {
              this.obj.interestedParties = []
            }
            interestedParties.props.options = res && res.length ? res : []
            interestedParties.props.disabled = !res || !res.length
          })
        } else {
          if (interestedParties) {
            interestedParties.props.options = []
            this.obj.interestedParties = []
            interestedParties.props.disabled = true
          }
        }
      },
      deep: true
    },
    'obj.interestedParties': {
      handler (v) {
        this.obj.relatedPartyIds = []
        this.obj.relatedPartyNames = []
        if (!v) return
        v && v.forEach(item => {
          this.obj.relatedPartyIds.push(item.id)
          this.obj.relatedPartyNames.push(item.name)
        })
      },
      deep: true
    },
    'obj.clinicIds': {
      async handler (v) {
        // 监控机构，获取机构下的所有的药房
        let clinicIds = {
          clinicIds: v
        }
        let storageRoomIds = this.$ever.getFieldFromSchema(this.schema, 'storageRoomIds')
        let storageRoomOptions = []
        if (this.type === 1) {
          await this.api.getAllStorageRooms(clinicIds).then(res => {
            if (res && res.length) {
              res = res.map(storage => {
                return {
                  id: storage.id,
                  name: storage.name,
                  type: storage.type
                }
              })
              storageRoomOptions = res.filter(item => { return item.type !== STORAGE_ROOM_TYPE[1].id })
            } else {
              storageRoomIds.props.options = []
            }
            this.obj.storageRoomIds = this.filterDate(res, this.obj.storageRoomIds)
          })
        }
        if (storageRoomIds) {
          storageRoomIds.props.options = v.length ? this.type === 1 ? storageRoomOptions : this.storageItem : []
        }
        if (this.hisSubModule === 'hospitalization') { // 获取当前机构下的科室
          let params = {
            orgIdList: v,
            offset: 0,
            pagesize: 10000,
            status: 'Y',
            usePermissionStatus: 'Y'
          }
          supplyapi.getTenantSubjectListByCondition(params).then(res => {
            let { resultList } = res.data || []
            if (resultList && resultList.length) {
              resultList = resultList.map(sction => {
                return {
                  id: sction.orgSubjectCode,
                  name: sction.orgSubjectName
                }
              })
              this.$ever.getFieldFromSchema(this.schema, 'sectionIds').props.options = v.length ? resultList : []
            } else {
              this.$ever.getFieldFromSchema(this.schema, 'sectionIds').props.options = []
            }
            this.obj.sectionIds = this.filterDate(resultList, this.obj.sectionIds)
          })
        }
      },
      deep: true
    },
  },
  beforeDestroy () {
    window.onresize = null
  },
  async created () {
    // 获取默认时间
    searchDateMoment(this.obj, this.reStatus === '24' ? -1 : '')
    if (this.obj.startDate) {
      this.obj.date.push(dateFormat(this.obj.startDate, 'YYYY-MM-DD HH:mm:ss'), dateFormat(this.obj.endDate, 'YYYY-MM-DD HH:mm:ss'))
    }
    this._info()
    this.query()
  },
  methods: {
    getPrintCodeSetting () {
      // 库房配置查询
      // printCodeSetting 2：关闭 1：开启
      storageroomapi.selectSystemSettingByClinicId().then(res => {
        if (res && res.id) {
          this.printCodeSetting = res.printCodeSetting || 2
          this.isTaskform = ['11', '15', '13', '19', '17', '22'].includes(this.status)
          if (this.printCodeSetting === 2 || (this.printCodeSetting === 1 && !this.isTaskform)) {
            let printCodeIndex = this.schema.findIndex(item => item.name === 'printCode')
            if (~printCodeIndex) {
              this.schema.splice(printCodeIndex, 1)
            }
          }
        }
      })
    },
    setSupplyOptions (newSchema) {
      supplierpriceapi.queryLocal({ filterOverdueRecord: true, showflag: 1 }).then(res => { // 获取供应商
        if (res && res.length) {
          res = res.map(supplier => {
            return {
              id: supplier.supplierId,
              name: supplier.supplierObject ? supplier.supplierObject.name : ''
            }
          })
          this.$ever.getFieldFromSchema(newSchema, 'supplierIds').props.options = res
        }
      })
    },
    handleCascader () {
      let dom = document.querySelector('.el-cascader__dropdown')
      dom.style.zIndex = 1
    },
    getInventorySchema (newSchema, dateObj, val) {
      let storageObj = newSchema.find(item => item.name === 'storageRoomIds')
      if (storageObj) {
        if (val === '22') {
          newSchema.splice(3, 0, this.schemaObj.INTERESTED_PARTIES)
        }
      }
      if (['hospitalization', 'outpatient'].includes(this.routeName)) return
      if (!val || val === '20') {
        let dateIndex = newSchema.findIndex(d => d.name === 'date')
        newSchema.splice(dateIndex, 1)
      } else if (['21', '22'].includes(val)) {
        newSchema.splice(3, 0, this.schemaObj.BUSINESS_TYPE_MULTIPLE)
      } else if (val === '23') { // || val === '24'
        newSchema[4] = this.schemaObj.DAYS_DETENTION
        newSchema.splice(1, 0, this.schemaObj.BUSINESS_TYPE_MULTIPLE)
      }
      //  增加限制时间选择范围
      if (val === '24' && dateObj) {
        //  进销存报表 限制 结束时间只能选择当前时间的前一天23:59:59
        dateObj.props.pickerOptions = {
          disabledDate: (time) => {
            return time.getTime() > this.$moment().add(-1, 'days').endOf('day').valueOf()
          }
        }
      }
    },
    getOutpatientSchema (dateObj, val) {
      dateObj.props.pickerOptions = {
        disabledDate: (time) => {
          return time.getTime() > this.$moment().endOf('day').valueOf()
        }
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
    },
    // 根据机构实时联动库房和科室的选中数据
    filterDate (res, arr) {
      let list = []
      if (this.obj.clinicIds.length) {
        list = arr.filter(ids => {
          const idsIndex = res.findIndex(find => { return ids === find.id })
          if (~idsIndex) {
            return res[idsIndex].id
          }
        })
      } else {
        list = []
      }
      return list
    },
    getTableWidth () {
      this.$nextTick(() => {
        let layoutBox = document.querySelector('.settle_inner')
        let width = 0
        if (this.invoList && this.invoList.length) {
          this.invoList.forEach(item => {
            width += item.width
          })
        }
        this.tableWidth = width < layoutBox.clientWidth && this.reStatus !== '24' ? `width: ${width + 1}px` : `width: 100%`
        let purchasingBox = document.querySelector('#purchasingBox')
        this.tableHieght = `${purchasingBox.offsetHeight - 55}`
      })
    },
    // 所有报表的options的值处理都在这
    _info () {
      this.checkList = []
      this.tableData = []
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.date = []
      this.obj.supplierIds = []
      this.obj.clinicIds = []
      this.obj.sectionIds = []
      this.obj.storageRoomIds = []
      if (this.isTaskform) this.obj.printCode = ''
      searchDateMoment(this.obj, this.reStatus === '24' ? -1 : '')
      if (this.obj.startDate) {
        this.obj.date.push(dateFormat(this.obj.startDate, 'YYYY-MM-DD HH:mm:ss'), dateFormat(this.obj.endDate, 'YYYY-MM-DD HH:mm:ss'))
      }
      this.materialList = []
      this.pagesize = 20
      this.offset = 0
      this.current = 1
      this.obj.clinicIds[0] = `${this.clincId}`
      this.checkObj = {
        viewAll: false,
        flag: false,
      }
      if (['14', '21'].includes(this.reStatus)) {
        this.obj.showTypes = this.type === 1 ? ['1', '2', '3', '4'] : ['2', '3', '4']
      }
      const businessType = this.$ever.getFieldFromSchema(this.schema, this.routeName === 'outpatient' ? 'businessType' : 'businessTypes')
      if (businessType) {
        const hospitalizationOption = BUSINESS_TYPE_COLLECT.filter(hospi => { return ['18', '19'].includes(this.reStatus) ? hospi.back : hospi.task })
        const inventoryOption = BUSINESS_TYPE_COLLECT.filter(inven => { return inven.inventory })
        const businessTypeOptions = {
          'outpatient': this.businessOption,
          'inventory': this.reStatus === '23' ? inventoryOption : BUSINESS_TYPE_COLLECT,
          'hospitalization': hospitalizationOption
        }
        businessType.props.options = businessTypeOptions[this.routeName]
      }
      const clinicData = this.$ever.getFieldFromSchema(this.schema, 'clinicIds')
      if (clinicData) {
        // 查询当前登录人的执业机构
        request(orgUrlMap.org.loadByStaffId, {
          staffId: localStorage.getItem('USERID'),
          staffLoginOrgPermission: '1',
        }, 'post', transferAxios).then(res => {
          if (res.head.errCode === 0) {
            this.clincOption = res.data.map(clinic => {
              return {
                id: clinic.id,
                name: clinic.name
              }
            })
            this.$ever.getFieldFromSchema(this.schema, 'clinicIds').props.options = this.clincOption
          }
        })
      }
    },
    changeStatus (a) {
      this.$messageTips(this, 'success', '导出报表成功')
    },
    downFile () { // 导出
      let params = {
        suffix: 'xls',
        exportType: this.exportType,
        offset: this.offset,
        pagesize: this.pagesize,
        pricingModel: this.isBatch,
      }
      if (this.status === '24') params.storageRoomItemze = Number(this.storageRoomItemze)
      if (this.isTaskform) params.printCodeSetting = this.printCodeSetting
      Object.assign(params, this.obj)
      delete params.date
      params.materialTypes = params.materialTypes ? [params.materialTypes] : []
      params.businessTypes = Array.isArray(params.businessTypes) ? params.businessTypes : []
      params.type = this.type
      this.api.exportExcel(params).then(res => {
        if (res) {
          this.$refs.exportExcel.downfile(DOWNLOAD_FILE + res.fileName)
        }
      })
    },
    deleteParam (obj, keys) { // 删除为空的参数
      Object.keys(obj).forEach(key => {
        if (!keys.includes(key)) delete obj[key]
      })
      return obj
    },
  },
}

</script>
<style lang="less" scoped>
.el-table
  /deep/
  .el-table__footer-wrapper
  .el-table__footer
  tbody
  tr
  td:nth-last-child(2)
  .cell {
  margin-right: 10px;
}
.border {
  border-top: 1px solid #000;
  width: 15px;
  height: 5px;
  margin-top: 16px;
}
.el-table /deep/ .success-row {
  background: #f4f9f8;
}
.form_cell {
  font-size: 14px;
  font-family: PingFangSC-Regular, sans-serif;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.multi-cascader {
  width: 270px;
}
.form {
  /deep/ .data_picker .el-date-editor {
    width: 360px !important;
  }
  /deep/ .method-width {
    width: 350px;
  }
}
.inputOption {
  margin-top: 11px;
}
</style>
