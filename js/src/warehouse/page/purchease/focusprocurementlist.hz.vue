<template>
  <div>
    <div class="layout_inner">
      <div class="main-head pos_re">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          @query="customList">
          <template slot="date">
            <ever-range-picker
              dateType="daterange"
              :autoWidth="false"
              width="260px"
              :start.sync="queryObj.startApplyDate"
              :end.sync="queryObj.endApplyDate"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="dateTimes">
            <ever-range-picker
              dateType="daterange"
              :autoWidth="false"
              width="260px"
              :start.sync="queryObj.startSummaryDate"
              :end.sync="queryObj.endSummaryDate"
              :outformat="`YYYY-MM-DD HH:mm:ss`"
              :default-time="['00:00:00', '23:59:59']"
            ></ever-range-picker>
          </template>
          <template slot="default">
            <el-button type="primary" size="small" @click="customList">查询</el-button>
            <el-button size="small" class="btnW" @click="handlerReset">重置</el-button>
          </template>
        </ever-form2>
      </div>
      <!-- 列表数据 -->
      <procurement-list
        :loading="loading"
        :auditFlag="auditFlag"
        :tableData="tableData"
        @handleSelectionChange="handleSelectionChange"
        path="/goods/focusprocurementdetail/">
      </procurement-list>
      <!-- 分页 -->
      <el-row type="flex" justify="end">
        <el-button type="primary" v-if="auditFlag == '2' && tableData.length" @click="summaryCheckData" :disabled="!selectDataArr.length" style="position:absolute; left: 0">汇总</el-button>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../storages/store/procurementapi'
import { request } from '@/util/req'
import urls from '@/manages/page/organization/utils/urls.js'
import storage from '@/util/storage'
import customList from '@/warehouse/page/storages/util/customList'
import sets from '@/util/setstatusname'
import procurementList from '@/warehouse/page/components/procurement/procurementlist.hz'
import { MATERIA_TYPE_OPTIONS, FULL_STATE } from '@/util/common'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
var querySchema = [
  {
    name: 'applyCode',
    label: '采购申请单号',
  },
  {
    name: 'clinicId',
    label: '机构名称',
    comp: 'sys-select',
    props: {
      placeholder: '请选择机构',
      filterable: true,
      options: []
    }
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', splitFlag: 0, status: '' },
      needObjFlag: true
    },
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'date',
    label: '申请时间',
    comp: 'custom',
  },
  {
    name: 'applyStatus',
    label: '申请单状态',
    comp: 'sys-select',
    props: {
      options: []
    }
  }
]
var querySchema2 = [
  {
    name: 'applyCode',
    label: '采购申请单号',
  },
  {
    name: 'clinicId',
    label: '机构名称',
    comp: 'sys-select',
    props: {
      filterable: true,
      placeholder: '请选择机构',
      options: []
    }
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    placeholder: '请输入通用名/商品名/首字母缩写/物资编码/商品条形码',
    comp: 'material-select',
    props: {
      params: { materialType: '', splitFlag: 0, status: '' },
      needObjFlag: true
    },
    style: 'width: 300px'
  },
  {
    name: 'date',
    label: '申请时间',
    comp: 'custom',
  },
  {
    name: 'dateTimes',
    label: '汇总时间',
    comp: 'custom',
  },
  {
    name: 'summaryStatus',
    label: '汇总状态',
    comp: 'sys-select',
    props: {
      options: [
        { id: '', name: '全部' },
        { id: '0', name: '未汇总' },
        { id: '1', name: '汇总中' },
        { id: '2', name: '已汇总' },
      ]
    }
  },
  {
    name: 'applyStatus',
    label: '申请单状态',
    comp: 'sys-select',
    props: {
      options: []
    }
  }
]
export default {
  mixins: [customList, sets],
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      api,
      // materialType: '',
      summary: 1,
      querySchema,
      FULL_STATE,
      MATERIA_TYPE_OPTIONS,
      queryObj: {},
      statusOpions: [],
      noClearParams: ['materialType'],
      changeMaterialTypeId: [],
      auditFlag: this.status,
      selectDataArr: [],
      initcondition: []
    }
  },
  created () {
    request(urls.org.getOrgListByCondition.url).then(res => {
      if (res.data && res.data.resultList && res.data.resultList.length) {
        res.data.resultList.forEach(item => {
          this.initcondition.push({
            id: item.id,
            name: item.name
          })
        })
      }
    })
    this._info()
  },
  methods: {
    summaryCheckData () {
      storage.removeSessionStorage('summaryCheckData')
      storage.setSessionStorage('summaryCheckData', JSON.stringify(this.selectDataArr))
      this.$router.push('/goods/summarylist')
    },
    handleSelectionChange (v) {
      this.selectDataArr = v
    },
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
    },
    _info () {
      this.statusOpions = [{ id: '', name: '全部' }]
      if (this.status === 1) {
        this.querySchema = querySchema
        this.queryObj = this.$ever.createObjFromSchema(querySchema)
      } else {
        this.querySchema = querySchema2
        this.queryObj = this.$ever.createObjFromSchema(querySchema2)
      }
      Object.keys(FULL_STATE.procurement).map(key => {
        const arr = this.status === 1 ? ['816', '821'] : ['815', '814']
        if (arr.includes(key)) {
          this.statusOpions.push({
            id: key,
            name: FULL_STATE.procurement[key]
          })
        }
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'applyStatus').props.options = this.statusOpions
      this.$ever.getFieldFromSchema(this.querySchema, 'clinicId').props.options = this.initcondition
      if (this.status === 2) {
        this.queryObj.applyStatus = '815'
        this.queryObj.summaryStatus = '0'
      }
      if (!this.$route.query.q) {
      } else {
        this.offset = (this.current - 1) * this.pagesize
        let query = JSON.parse(this.$route.query.q)
        Object.assign(this.queryObj, query)
      }
      this.customList()
    },
    customList: function (refresh) {
      this.tableData = []
      if (refresh) {
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj)
      params.offset = this.offset
      params.pagesize = this.pagesize
      params.auditFlag = this.auditFlag + ''
      if (params.localMaterialId instanceof Object && params.localMaterialId.materialSkuId) {
        params.materialSkuId = params.localMaterialId.materialSkuId
        delete params.localMaterialId
      }
      this.api.queryApplyListByCondition(params).then(res => {
        if (res && res.list) {
          let results = JSON.parse(JSON.stringify(res.list))
          this.tableData = results
          this.totalCount = res.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
        // this._encodeSearchParams(this.queryObj)
      })
    }
  },
  watch: {
    'status' (type) {
      this.auditFlag = type
      this._info()
    },
  },
  components: {
    procurementList,
  }
}
</script>

<style lang="scss" scoped>
  .main-option h4 { margin: 0;float: left; line-height: 36px;}
</style>
