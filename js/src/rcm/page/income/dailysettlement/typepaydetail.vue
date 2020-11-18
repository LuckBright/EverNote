<template>
  <div>
    <el-dialog
      :title="computedTitle"
      :visible.sync="v"
      class="ui_dialog_02 dailytosettlecode"
      width="90%"
    >
      <div>
        <ever-form2
          :schema="querySchema"
          class="diy-form"
          v-model="queryObj"
          ref="form2"
          :is-query="true"
          :inline="true"
          label-position="right"
          @query="list()"
        >
          <template slot="patientId">
            <ever-patient-select
              ref="inputSeach"
              v-model="queryObj.patientId"
              :allowCreate="false"
              class="focus-packlist"
            ></ever-patient-select>
          </template>
        </ever-form2>
        <div class="inforight">
          <span style="margin-right:15px;">
            <label>{{feeType==7?'金额总计':'应收合计'}}:</label>
            {{totalPayPrice | formatToFinacial}}
          </span>
        </div>
        <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          id="printTable"
          v-if="feeType==7"
          v-loading="loading"
        >
          <el-table-column prop="settlementNo" width="200" label="结算单号">
            <template slot-scope="scope">
              <a
                href="javascript:void(0)"
                @click="settlementDetail(scope.row)"
              >{{scope.row.settlementNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="patientName" label="姓名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="patientNumber" label="病案号"></el-table-column>
          <el-table-column prop="patientNumber" label="类型" v-if="title==='储值卡'||title==='套餐'">
            <template slot-scope="scope">
              <div v-if="title==='储值卡'">{{scope.row.direction==1?'充值':'提现'}}</div>
              <div v-else>{{scope.row.direction==1?'销售':'退款'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            v-if="title!=='储值卡'"
            :label="title==='套餐'?'原价':'应收金额'"
            align="right"
          >
            <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column
            prop="payPrice"
            v-if="title!=='储值卡'"
            :label="title==='套餐'?'售价':'实收金额'"
            align="right"
          >
            <template slot-scope="scope">{{scope.row.payPrice | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column
            v-for="item in addTableData"
            :key="item"
            :prop="item"
            :label="item"
            align="right"
          >
            <template slot-scope="scope">{{scope.row[item] | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="交易时间" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table :data="tableData" border id="printTable" v-if="feeType!==7" v-loading="loading">
          <el-table-column
            v-for="(item, index) in addTableData"
            :key="item"
            :prop="item"
            :label="item"
            :width="index==0?'200':''"
            show-overflow-tooltip
            :align="([0,1,2,addTableData.length-1].indexOf(index) > -1)? '': 'right'"
          >
            <template slot-scope="scope">
              <div v-if="index==0" class="itemcontainer">
                <a
                  href="javascript:void(0)"
                  @click="settlementDetail(scope.row)"
                >{{scope.row[item]}}</a>
              </div>
              <div v-else-if="index==1 || index==2" class="itemcontainer">{{scope.row[item]}}</div>
              <div
                v-else-if="index==addTableData.length-1"
                class="itemcontainer"
              >{{scope.row[item]}}</div>
              <div v-else class="itemcontainer">{{scope.row[item] | formatToFinacial}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/rcm/store/income/dailysettlementapi'
export default {
  props: ['visibile', 'title', 'id', 'feeType', 'infoObj'],
  computed: {
    v: {
      get () {
        return this.visibile
      },
      set (val) {
        this.$emit('update:visibile', val)
      }
    },
    computedTitle () {
      return this.feeType === 7 ? `${this.title}收费日结明细` : this.title
    }
  },
  data () {
    let schema = [
      {
        label: '患者姓名/病案号',
        name: 'patientId',
        comp: 'custom'
      }
    ]
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      queryObj: obj,
      querySchema: schema,
      loading: false,
      totalPayPrice: 0,
      tableData: [],
      addTableData: []
    }
  },
  methods: {
    settlementDetail (row) {
      let url = `${this.$ever.rcmIndex}/rcm/paymentDetail?status=2&settlementId=${row.settlementId}`
      if (this.feeType !== 7) {
        url = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientid}&dptId=${row.orderDept}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.settlementid}&showlist=true`
      }
      window.open(url)
    },
    list () {
      let params = {}
      let url = 'getCostClassInfo'
      this.tableData = []
      this.addTableData = []
      this.totalPayPrice = 0
      this.loading = true
      if (this.feeType === 7) {
        params.id = this.id
        params.name = this.title
        params.patientId = this.queryObj.patientId
      } else {
        params.orderType = this.feeType
        params.closeId = this.id || '0'
        url = 'getFlowFee'
        if (this.queryObj.patientId) {
          params.patientid = this.queryObj.patientId
        }
      }
      api[url](params).then(rs => {
        if (rs.head.errCode === 0) {
          this.initData(rs)
        }
      })
    },
    initData (rs) {
      if (this.feeType === 7) {
        this.totalPayPrice = rs.data.totalPayPrice
        this.addTableData = rs.data.typeSet || []
        this.tableData = rs.data.list
      } else if (this.feeType !== 7 && rs.newDataTitles.length > 1) {
        this.addTableData = Object.values(rs.newDataTitles).filter(item => !['优惠金额', '实收金额', '套餐消费'].includes(item))
        this.tableData = rs.newData || []
        this.getTotalPrice(rs.newData)
      }
      this.loading = false
    },
    getTotalPrice (json) {
      let totalPrice = 0
      json.forEach(item => {
        totalPrice += item['应收金额']
      })
      this.totalPayPrice = totalPrice.toFixed(2)
    }
  },
  watch: {
    'visibile': {
      handler: function (val) {
        if (val) {
          this.list()
        } else {
          this.tableData = []
          this.addTableData = []
          this.queryObj.patientId = ''
          this.totalPayPrice = 0
          this.queryObj.patientId = ''
        }
      }
    }
  }
}
</script>
<style scoped>
.ui_dialog_02.dailytosettlecode .el-dialog .el-dialog__body {
  padding-bottom: 30px;
}
.itemcontainer {
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-form {
  float: left;
}
.inforight {
  float: right;
}
</style>
