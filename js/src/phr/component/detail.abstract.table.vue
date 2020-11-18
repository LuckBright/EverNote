<template>
  <div class="abstract-item-box">
    <div class="abstract-item-title">
      {{tableObj.title}}
      <span class="abstract-more" @click="goMore">
        更多<i class="icon el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="abstract-item-table">
      <ever-table
        :table-loading="tableLoading"
        :isPagination="false"
        :height="133"
        ref="table"
        class="phrTable"
        row-key="id"
        :show-index="false"
        :columns="tableObj.columns"
        :data="tableData"
        :maxBtnCount="6">
        <!--      <template slot="setName" slot-scope="scope">-->
        <!--        <template>-->
        <!--          <span>{{scope.row.setName}}</span> - <span class="cGray"><sys-value type="THC_SET_VERSION" :code="scope.row.setVersion"></sys-value></span>-->
        <!--        </template>-->
        <!--      </template>-->
        <template slot="reportDoctorName" slot-scope="scope">
          <template>
            <span>{{scope.row.executeResult.reportDoctorName}}</span>
          </template>
        </template>
        <template slot="doctorAdviceExecuteDate" slot-scope="scope">
          <template>
            <span>{{scope.row.execute.doctorAdviceExecuteDate}}</span>
          </template>
        </template>
        <template slot="categoryCode" slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.doctorAdviceTypeCode || scope.row.doctorAdviceItemTypeCode" :show-en="true"></sys-value>
        </template>
        <template slot="status" slot-scope="scope">
          <template v-if="adviceStatus[String(scope.row.doctorAdviceStatusCode)] && adviceStatus[String(scope.row.doctorAdviceStatusCode)].txt">
            <span :class="{'cRed': ['2', '70'].includes(String(scope.row.doctorAdviceStatusCode))}">{{adviceStatus[String(scope.row.doctorAdviceStatusCode)].txt}}</span>
          </template>
          <template v-else>--</template>
        </template>
      </ever-table>
    </div>
  </div>
</template>

<script>
import {request} from '@/util/req'
import {mapState} from 'vuex'
import {ADVICE_STATUS, OUTPATIENT_ADVICE_STATUS} from '@/util/otherconfig'

export default {
  props: {
    tableObj: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      OUTPATIENT_ADVICE_STATUS,  // 门诊医嘱状态
      ADVICE_STATUS,             // 住院医嘱执行状态
    }
  },
  computed: {
    ...mapState(['phrPatientActive']),
    // 执行状态 实际 门诊和住院会有不同
    adviceStatus () {
      return this.$route.query.visitSerialTypeCode === 1 ? this.OUTPATIENT_ADVICE_STATUS : this.ADVICE_STATUS
    }
  },
  created () {
    this.getList()
  },
  methods: {
    goMore () {
      this.$router.push({
        path: this.tableObj.moreUrl,
        query: {
          ...this.$route.query, // 住院的需求，如果有问题去掉时候通知下cpoe
          fromType: this.$route.query.fromType,
          visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
          visitSerialNumber: this.$route.query.visitSerialNumber,
          patientId: this.$route.query.patientId || this.phrPatientActive.patientId,
          hospitalizedNumber: this.$route.query.hospitalizedNumber || this.phrPatientActive.hospitalizedNumber || '',
          outpatientSerialNumber: this.$route.query.outpatientSerialNumber || this.phrPatientActive.outpatientSerialNumber || ''
        }
      })
    },
    getList () {
      this.tableLoading = true
      request(this.tableObj.url,
        {
          visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
          visitSerialNumber: this.$route.query.visitSerialNumber,
          patientId: this.$route.query.patientId,
          outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
          hospitalizedNumber: this.$route.query.hospitalizedNumber,
          page: 1,
          pagesize: 3,
          offset: 0
        }
      ).then((res) => {
        if (res.head.errCode === 0) {
          this.tableLoading = false
          this.tableData = res.data.resultList || (Array.isArray(res.data) ? res.data : [])
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .abstract-item-box{
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    .abstract-item-title{
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      padding: 0 10px 0 10px;
      font-size: 14px;
      color: #666666;
      font-weight: bold;
      box-shadow: 0 2px 4px 0 rgba(204,204,204,0.30);
      .abstract-more{
        float: right;
        cursor: pointer;
        &:hover {
          color: #4484C9;
        }
      }
    }
    .abstract-item-table{
      min-height: 133px;
      box-shadow: 0 2px 4px 0 rgba(204,204,204,0.50);
      /deep/ .el-table{
        margin: 0;
        border: none;
        &:before{
          display: none;
        }
      }
    }
  }
  .phrTable /deep/ .el-table .el-table__header-wrapper{
    th.is-leaf {
      border-bottom: 1px solid #DADCE0
    }
    th {
      background:#f3f7fb
    }
  }
</style>
