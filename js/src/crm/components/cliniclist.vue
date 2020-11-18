<template>
  <div id="cliniclist">
    <el-table
      v-if="visible"
      :data="tableData"
      border
      class="el-td-border"
      highlight-current-row>
      <el-table-column
        show-overflow-tooltip
        label="就诊机构"
        align="center"
        max-width="100">
        <template slot-scope="scope">
          {{scope.row.clinicName || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="开单医生"
        align="center"
        max-width="100">
        <template slot-scope="scope">
          {{scope.row.doctorName || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="payedfee"
        label="收费金额"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="使用保险"
        align="center"
        width="120">
        <template slot-scope="scope">
          <label v-if="scope.row.comInsurance">商保</label>
          <label v-else-if="scope.row.medInsurance">医保</label>
          <label v-else>全自费</label>
        </template>
      </el-table-column>
      <el-table-column
        label="保险名称"
        align="center"
        width="120">
        <template slot-scope="scope">
          {{scope.row.insuranceOrgCnName || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="exefee"
        label="自费金额"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="保险支付"
        align="center"
        width="120">
        <template slot-scope="scope">
          <label v-if="scope.row.comInsurance">商保</label>
          <label v-else-if="scope.row.medInsurance">医保</label>
          <label v-else>--</label>
        </template>
      </el-table-column>
      <el-table-column
        label="就诊时间"
        align="center"
        width="120">
        <template slot-scope="scope">
          {{$moment(scope.row.createTime).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="payStatusStr"
        label="状态"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button size="small" @click="settlementDetail(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
  </div>
</template>

<script>
  import api from '../../rcm/store/settlementapi'
  import list from '../../util/list'
  export default {
    mixins: [list],
    data () {
      return {
        api,
        queryObj: {
          payStatus: 2,
          patientId: this.$route.params.patientId
        },
        patientId: this.$route.params.patientId,
        visible: true
      }
    },
    created () {
    },
    methods: {
      settlementDetail (row) {
        location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${this.patientId}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.id}&dptId=${row.orderDept}&showlist=true`
      }
    }
  }
</script>
