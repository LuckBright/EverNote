<template>
  <div class="margin" v-loading="loading">
    <el-collapse
      v-if="diagnosisArrList.length"
      class="overflowtext"
      v-model="activeId"
      @change="activeTog"
      accordion
    >
      <el-collapse-item
        v-for="(value, index) in diagnosisArrList"
        :class="{ on: (indexs === index) }"
        :key="value.visit_record_id"
        :name="index"
      >
        <template slot="title" class="bold">
          <el-col>
            <span>{{ value.visitDate | formatDateByExp('YYYY/MM/DD') }}</span>
            <span>{{value.outpatientVisitTypeName}}</span>
            <span
              :title="value.mainDiagnosis"
              v-if="value && value.mainDiagnosis"
            >{{value.mainDiagnosis}}</span>
            <span>{{value.visitTenantSubjectName}}</span>
            <span>{{value.visitDoctorName}}</span>
            <span>{{value.visitOrgName}}</span>
          </el-col>
        </template>
        <diagnosis-view
          v-if="activeId === index"
          @openReport="openReport"
          :num="indexs"
          @quote="quoteHandle"
          @treat="treat"
          :diagnosisArrList="diagnosisArrList"
          :treatment="treatment"
          :disabled="disabled"
          class="no-padding"
        ></diagnosis-view>
      </el-collapse-item>
    </el-collapse>
    <el-row v-else style="text-align: center;padding: 260px 0 300px">
      <el-col v-if="!loading" :span="24">
        <ever-no-data></ever-no-data>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import reportDialog from '@/infusion/components/report.card.vue'
import diagnosisView from './diagnosisview'
import api from '../store/diagnosisapi'
import phr from '@/inpatient/store/phr'
import taskvaluekey from '@/crm/page/healthy/taskvaluekey'
export default {
  components: {
    diagnosisView,
    reportDialog
  },
  mixins: [taskvaluekey],
  props: ['disabled'],
  data () {
    return {
      activeId: 0,
      diagnosisArrList: [],
      patientId: this.$route.query.patientId ? this.$route.query.patientId : 1,
      indexs: 0,
      treatment: {},
      loading: false
    }
  },
  async created () {
    this.init()
  },
  methods: {
    openReport (value) {
      this.$emit('openReport', value)
    },
    getOutHosiptalHistoryByPatientId () {
      this.loading = true
      api.getOutHosiptalHistoryByPatientId({
        patientId: this.$route.query.patientId, // string 是 患者ID
      }).then(res => {
        this.loading = false
        if (res && res.data && res.data.length) {
          this.diagnosisArrList = res.data
          this.getAllrecord(this.diagnosisArrList[0].visitSerialNumber)
        }
      })
    },
    quoteHandle (data) {
      this.$emit('quote', data)
    },
    treat (data) {
      this.$emit('treat', data)
    },
    activeTog: async function (index) {
      this.indexs = index
      if (this.diagnosisArrList && this.diagnosisArrList[this.indexs]) {
        this.getAllrecord(this.diagnosisArrList[this.indexs].visitSerialNumber)
      }
    },
    getAllrecord (sn) {
      phr.getDoctorAdviceByMessage({ visitNumber: sn }).then(rs => {
        if (rs && rs.length) {
          this.$emit('getRecord')
          this.treatment = rs
        } else {
          this.treatment = []
        }
      })
    },
    // 无人调用 4.11.1 去掉 by lvjiangtao@everjiankang.com
    // printPatientAllRecord () {
    //   let pageObj = {
    //     pagination: true,
    //     fixedHeader: true,
    //     fixedFooter: true,
    //     size: 'A4',
    //     margin: [1]
    //   }
    //   doPrint(
    //     this,
    //     'medical_record_print',
    //     pageObj,
    //     'print_header_01',
    //     'print_footer_01'
    //   )
    // },
    async init () {
      this.getOutHosiptalHistoryByPatientId()
    }
  }
}
</script>
<style lang='scss' scoped>
.overflowtext {
  border: none;
  .el-col {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: bolder;
    padding: 0 5px;
  }
  /deep/ .el-collapse-item {
    margin-bottom: 10px;
  }
  /deep/ .el-collapse-item__header {
    height: 36px;
    background: #eee;
    border: 1px solid #ccc;
  }
  /deep/ .el-collapse-item__content {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
}
.margin {
  margin: 0px 10px 0px -5px;
}
</style>
