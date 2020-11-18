<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        @query="list"
        labelWidth="140px"
        :inline="true"
        :is-query="true"
      ></ever-form2>
      <div class="main-option">
        <el-button type="primary" @click="month">结算</el-button>
        <el-button @click="cancel">取消结算</el-button>
      </div>
    </div>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%;overflow:auto;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="settleTypeName" label="结算类型"></el-table-column>
      <el-table-column prop="tradeType" label="交易类型">
        <template slot-scope="scope">{{scope.row.tradeType==1?'月结算': '取消月结算'}}</template>
      </el-table-column>
      <el-table-column prop="settlePeriod" label="月结算期"></el-table-column>
      <el-table-column prop="settleNumber" label="月结算流水号"></el-table-column>
    </el-table>
    <div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import {
  searchMedMonthSettle,
  monthSettle,
  cancelSettle
} from '@/rcm/store/otmdiscomponent/reconciliationapi.js'
import list from '@/util/list'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'

let schema = [
  // {
  //   name: 'insuranceOrgId',
  //   label: '保险类别',
  //   comp: medicalOrgList,
  //   props: {
  //     defaultFirst: true
  //   }
  // },
  {
    name: 'settlePeriod',
    label: '结算月份',
    comp: 'elDatePicker',
    props: {
      type: 'month'
    }
  },
  {
    name: 'settleType',
    label: '结算类型',
    comp: 'ever-select',
    props: {
      clearable: false,
      options: [
        { id: '01', name: '基本医疗和生育' },
        { id: '02', name: '离休二乙结算' },
        // { id: '04', name: '工伤结算' },
        { id: '06', name: '离休副省结算' }
      ]
    }
  }
]
export default {
  props: ['insuranceOrgId'],
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    obj.settlePeriod = this.$moment(new Date()).format('YYYY-MM')
    obj.settleType = '01'
    return {
      querySchema: schema,
      queryObj: obj,
      loading: false,
      checkArr: []
    }
  },
  components: {
    medicalOrgList
  },
  async created () {
  },
  methods: {
    list () {
      this.loading = true
      let params = { pagesize: this.pagesize, offset: this.offset, ...this.queryObj, insuranceOrgId: this.insuranceOrgId }
      // params.insuranceOrgId = 'a77b1eb78eee447ebbe429bc5b1bb6b2'
      params.settlePeriod = params.settlePeriod ? this.$moment(params.settlePeriod).format('YYYY-MM').replace('-', '') : ''
      searchMedMonthSettle(params).then(rs => {
        this.loading = false
        this.tableData = rs.data
        this.totalCount = rs.totalCount
      })
    },
    month () {
      let params = {}
      // params.insuranceOrgId = 'a77b1eb78eee447ebbe429bc5b1bb6b2'
      params.insuranceOrgId = this.insuranceOrgId
      params.macId = this.macId
      params.settleType = this.queryObj.settleType
      params.settlePeriod = this.queryObj.settlePeriod ? this.$moment(this.queryObj.settlePeriod).format('YYYY-MM').replace('-', '') : ''
      monthSettle(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '结算成功')
          this.list()
        } else {
          this.$messageTips(this, 'error', '结算失败')
        }
      })
    },
    cancel () {
      let params = {}
      // params.insuranceOrgId = 'a77b1eb78eee447ebbe429bc5b1bb6b2'
      params.insuranceOrgId = this.insuranceOrgId
      params.macId = this.macId
      params.settleType = this.queryObj.settleType
      params.settlePeriod = this.queryObj.settlePeriod ? this.$moment(this.queryObj.settlePeriod).format('YYYY-MM').replace('-', '') : ''
      cancelSettle(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '取消结算成功')
          this.list()
        } else {
          this.$messageTips(this, 'error', '取消结算失败')
        }
      })
    },
    handleSelectionChange (arr) {
      this.checkArr = arr
    }
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
</style>
