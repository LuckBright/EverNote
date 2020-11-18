<template>
  <div class="infusion_card">
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true">
            <template slot="termTypes">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <div slot="default" class="el-form-item">
              <el-button type="primary" @click="queryList" style="padding: 8px 12px;">查询</el-button>
            </div>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <!-- <el-button size="small" type="primary" @click="printEvent" :disabled="!selectData.length">打印</el-button> -->
          <el-dropdown @command="print">
            <el-button size="small" type="primary" :disabled="!showTableData.length">
              打印<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" class="print-dropdown">
              <el-dropdown-item command="page" :disabled="!selectData.length">打印选中项目</el-dropdown-item>
              <el-dropdown-item command="all">打印全部项目</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <div class="main-wrap">
        <advice-show-table
          ref="adviceShow"
          :visitType="3"
          :showData="showTableData"
          :columns="columns"
          :configOption="configOption"
          :arraySpan="arraySpan"
          :noBorderSpan="noBorderSpan"
          :showCheckbox="true"
          setMainGroupId="mainGroupIdFlag"
          specCheckboxMergeFlag="checkboxMergeFlag"
          :specRowClass="'-1'"
          @selectionChange="selectionChange"
        >
          <span slot="employName" slot-scope="scope">
            {{scope.row.employName}}
            <sys-value v-if="scope.row.adviceJson.dropSpeed" type="THC_CPOE_DropRate"  :code="scope.row.adviceJson.dropSpeed"></sys-value>
          </span>
        </advice-show-table>
      </div>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="queryObj.pagesize"
          :totalCount="totalCount"
          :current="queryObj.page"
        ></ever-pagination>
      </el-row>
      <!-- 患者列表监听 -->
      <inpatient-refresh
        ref="inpatientRefresh"
        :query="this.$route.query"
        :checks="['bedId', 'areaId', 'providerId']"
        @refresh="refresh"
      ></inpatient-refresh>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import api from '@/inpatient/store/advice/execute.print'
import sysvalue from '@/warehouse/store/sysvalueapi'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import autoprintsetapi from '@/sob/store/autoprintsetapi'
import { HOSPITAL_INFUSION_CARD } from '@/util/table-config'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    clearInfo: Function
  },
  data () {
    let querySchema = [
      {
        name: 'termTypes',
        label: '',
        comp: 'custom'
      },
      {
        name: 'planTime',
        label: '计划时间',
        comp: 'el-date-picker',
        props: {
          type: 'date',
          format: 'yyyy-MM-dd',
          valueFormat: 'yyyy-MM-dd',
          placeholder: ''
        }
      },
      {
        name: 'printStatus',
        label: '',
        comp: 'ever-select',
        props: {
          placeholder: '请选择是否打印',
          options: [{
            id: '0',
            name: '未打印'
          }, {
            id: '1',
            name: '已打印'
          }],
          filterable: true,
          clearable: true,
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termTypes = -1
    queryObj.planTime = this.$moment().format('YYYY-MM-DD')
    return {
      storage,
      api,
      sysvalue,
      querySchema,
      queryObj,
      activeIndex: '',
      tableData: [],
      totalCount: 0,
      selectData: [],
      selectIds: [],
      columns: [
        {
          prop: 'patientName',
          label: '患者信息',
          showOverflowTooltip: true,
          minWidth: '10%',
          formatter: ({value, row}) => {
            return (row.bedName ? row.bedName + ' ' : '') + value
          }
        },
        {
          prop: 'planTime',
          label: '计划时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'termType',
          label: '长/临',
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({value}) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          prop: 'measure',
          label: '剂量',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value, row}) => {
            return value + row.measureUnitName
          }
        },
        {
          slot: 'employName',
          prop: 'employName',
          label: '用法',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'useFreqName',
          label: '频次',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        }
      ],
      configOption: {id: HOSPITAL_INFUSION_CARD},
      arraySpan: ['patientName', 'planTime', 'employName', 'termType', 'useFreqName'],
      noBorderSpan: ['doctorAdviceName', 'measure', 'entrust']
    }
  },
  components: {
    adviceShowTable,    // 医嘱显示组件
    inpatientRefresh // 患者列表监听
  },
  created () {
    this.queryObj.page = Number(this.$route.query.page) || 1
    this.queryObj.pagesize = Number(this.$route.query.pagesize) || 20
    this.queryObj.offset = (Number(this.$route.query.page) - 1) * Number(this.$route.query.pagesize) || 0
  },
  mounted () {
    this.saveSizeChange()
    this.getDocumentList()
  },
  methods: {
    // tab获取住院护士打印配置
    getDocumentList () {
      let parms = {
        source: 3,
        executeTypeCode: 'SHU_YE_KA'
      }
      this.documentList = []
      autoprintsetapi.getConfigList(parms).then(res => {
        if (res.data.length > 0) {
          this.queryObj.includeAdviceType = res.data[0].includeAdviceType
          this.queryObj.includeUsage = res.data[0].includeUsage
          this.queryObj.code = res.data[0].executeTypeCode
          this.queryList()
        }
      })
    },
    // 分页，获取每页页数
    handleSizeChange (pagesize) {
      this.queryObj.pagesize = pagesize
      this.saveSizeChange()
      this.queryList()
    },
    // 分页，获取当前页码
    handleCurrentChange (page) {
      this.queryObj.page = page
      this.saveSizeChange()
      this.queryList()
    },
    // 保存分页信息到route
    saveSizeChange () {
      this.queryObj.offset = (this.queryObj.page - 1) * this.queryObj.pagesize
      let obj = {
        page: this.queryObj.page,
        pagesize: this.queryObj.pagesize,
        offset: this.queryObj.offset
      }
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...Object.assign({}, this.baseInfo, obj)
        }
      })
    },
    // 获取查询参数
    getParams () {
      if (this.queryObj.termTypes > -1) {
        this.queryObj.termType = String(this.queryObj.termTypes)
      } else if (this.queryObj.termType) {
        delete this.queryObj.termType
      }
      this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
      this.queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      this.queryObj.patientName = this.baseInfo.patientName
      this.queryObj.patientId = this.baseInfo.patientId
      return Object.assign({}, this.queryObj)
    },
    // 查询列表
    queryList () {
      this.getParams()
      this.queryEvent()
    },
    async queryEvent () {
      let res = await api.queryInfusionCardList(this.queryObj)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
        this.totalCount = res.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    // table checkbox 回调事件
    selectionChange (val) {
      this.selectIds = []
      this.selectData = val
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item.id)
        })
      }
    },
    async getAllDataIds () {
      let params = this.getParams()
      params.isAll = 1
      let res = await api.queryInfusionCardList(params)
      if (res && res.list && res.list.length) {
        return res.list
      }
      return []
    },
    async print (type) {
      if (type === 'page') {
        this.printEvent()
      }
      if (type === 'all') {
        let executeIdList = await this.getAllDataIds()
        mutiplePrint([{
          code: 'ZY_CPOE_SHU_YE_KA',
          params: {
            executeIdList: executeIdList,
          },
          printParams: {
            cb: () => {
              api.addExecutePrintRecord({
                executeIdList: executeIdList,
                code: 'SHU_YE_KA'
              })
            }
          }
        }])
      }
    },
    // 打印
    printEvent () {
      if (!this.selectData.length) {
        return
      }
      let executeIdList = this.selectData.map(item => item.id)
      mutiplePrint([{
        code: 'ZY_CPOE_SHU_YE_KA',
        params: {
          executeIdList: executeIdList,
        },
        printParams: {
          cb: () => {
            api.addExecutePrintRecord({
              executeIdList: executeIdList,
              code: 'SHU_YE_KA'
            })
          }
        }
      }])
    },
    // 患者状态发生变化
    refresh (key, patient, list) {
      if (key === 'storage') {
        this.$router.push({query: {
          areaId: storage.getLocalStorage('inpatientKey').split(',')[0]
        }})
        this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
        this.clearInfo && this.clearInfo()
        return
      }
      if (!patient && this.inpatientNumber !== list.length) {
        this.$router.push({query: {
          areaId: this.$route.query.areaId
        }})
        this.clearInfo && this.clearInfo()
        this.inpatientNumber = list.length
        this.queryList()
        return
      }
      this.inpatientNumber = list.length
    }
  },
  computed: {
    showTableData () {
      let data = []
      let obj = {}
      this.tableData.forEach(item => {
        if (item.length) {
          item.forEach(val => {
            val.mainGroupIdFlag = val.mainGroupId + '_' + val.planTime + '_' + val.patientId
            val.checkboxMergeFlag = val.planTime + '_' + val.patientId
            data.push(val)
            if (obj[val.checkboxMergeFlag]) {
              obj[val.checkboxMergeFlag].push(val)
            } else {
              obj[val.checkboxMergeFlag] = [val]
            }
          })
        }
      })
      Object.keys(obj).forEach((v, k) => {
        if (k % 2 === 0) {
          data.forEach(m => {
            if (m.checkboxMergeFlag === v) m.specbg = true
          })
        }
      })
      return data
    },
    fuziData () {
      let obj = {}
      this.showTableData.forEach(v => {
        if (obj[v.mainGroupIdFlag]) {
          obj[v.mainGroupIdFlag].push(v)
        } else {
          obj[v.mainGroupIdFlag] = [v]
        }
      })
      return obj
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        this.queryList()
      },
      deep: true
    },
    'baseInfo': {
      handler (val) {
        this.queryList()
        this.queryObj.page = 1
        this.saveSizeChange()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.infusion_card {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      margin-top: 12px;
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-form-item {
          margin: 0 10px 2px 0;
        }
      }
      .alg_r {
        line-height: 30px;
      }
    }
    .main-wrap {
      overflow: auto;
    }
  }
}
.print-dropdown {
  /deep/ .el-dropdown-menu__item.is-disabled {
    color: #aaa;
    cursor: not-allowed;
  }
}
</style>
