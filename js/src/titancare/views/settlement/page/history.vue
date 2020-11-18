<template>
  <div>
    <ever-bread-crumb name="退费记录"></ever-bread-crumb>
    <!-- <p class="title">退费记录</p> -->
    <div class="layout_inner f14">
      <!-- <p class="topClose">
        <span @click="close">&lt;&nbsp;&nbsp;返回</span>
      </p> -->
      <patientinfo :patientinfo="patientobj"></patientinfo>
      <el-table
        class="mt30"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        empty-text="无退费记录"
      >
        <el-table-column prop="refundApplyDate" label="退款申请时间"></el-table-column>
        <el-table-column prop="refundApplyName" label="退款申请人"></el-table-column>
        <el-table-column label="申请方">
          <template
            slot-scope="scope"
          >{{scope.row.applySource === 1?'客服':scope.row.applySource === 2?'用户':''}}</template>
        </el-table-column>
        <el-table-column prop="fee" label="退款金额">
          <template slot-scope="scope">{{scope.row.fee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="recipeCode" label="编号"></el-table-column>
        <el-table-column prop="itemNameQuantityUnit" label="退款项目/数量单位"></el-table-column>
        <el-table-column prop="refundStatus" label="状态">
          <template
            slot-scope="scope"
          >{{scope.row.refundStatus === 1||scope.row.refundStatus === 0?'退款中':scope.row.refundStatus === -1?'失败':scope.row.refundStatus === 2?'退款成功':'--'}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/settlement'
import patientinfo from './patientinfo.vue'

export default {
  components: {
    patientinfo
  },
  data () {
    return {
      api,
      tableData: [],
      patientobj: ''
    }
  },
  created () {
    this.getRefundRecords()
    this.getOutpatientSettlementInfo()
  },
  methods: {
    // close () {
    //   this.$router.go(-1)
    // },
    getOutpatientSettlementInfo () {
      this.api.getOutpatientSettlementInfo({ id: this.$route.query.settlementId }).then(rs => {
        if (rs && rs.data) {
          this.patientobj = rs.data // 结算信息1
        }
      })
    },
    getRefundRecords (v) {
      let params = {
        recipeIds: [this.$route.query.recipeId],
        settlementId: this.$route.query.settlementId
      }
      this.api.getRefundRecords(params).then(rs => {
        if (rs.errCode === 0 && rs.data && rs.data[0]) {
          this.tableData = rs.data
        }
      })
    }
  }
}
</script>
