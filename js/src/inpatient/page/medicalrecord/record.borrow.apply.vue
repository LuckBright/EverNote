<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="dptId">
          <ever-subject-select type="select" v-model="queryObj.dptId" placeholder="科室" fields="id"></ever-subject-select>
        </template>
        <template slot="diagnosisCodes">
          <diagnosis-multiple v-model="queryObj.diagnosisCodes"></diagnosis-multiple>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :max-height="maxHeight"
      :url="url"
      fixed-elements="js-main-head js-title"
      :params.sync="queryObj"
      :columns="columns"
      @eventChange="eventChange">
      <template slot="sex" slot-scope="scope">
        <sys-value type="GBT.2261.1" :code="String(scope.row.sex)" v-if="scope.row.sex"></sys-value>
        <span v-else>--</span>
      </template>
    </ever-table>
    <borrow-apply-dialog :visible.sync="dialogVisible" :data="currentData" @save="saveApply"></borrow-apply-dialog>
  </div>
</template>
<script>
import maxHeight from './maxheight.js'

import urlMap from '@/emr/urls'
import { request } from '@/util/req'
import diagnosisMultiple from '@/inpatient/page/medicalrecord/diagnosis.multiple'
import borrowApplyDialog from '@/inpatient/page/medicalrecord/borrow.apply.dialog'
export default {
  mixins: [maxHeight],
  data () {
    let querySchema = [
      {
        name: 'visitId',
        label: '住院号',
      },
      {
        name: 'name',
        label: '姓名',
      },
      {
        name: 'sex',
        label: '性别',
        comp: 'sys-type',
        props: {
          code: 'GBT.2261.1'
        }
      },
      {
        name: 'dptId',
        label: '科室',
        comp: 'custom',
      },
      {
        name: 'admitDoctorId',
        label: '住院医师',
        comp: 'everStaffSelect',
        props: {
          clearable: true,
          type: 'select',
          fields: 'id',
          params: {
            typeCodeList: ['DOCTOR'],
            everQueryType: 'out',
            tenantSubjectIdList: []
          }
        },
      },
      {
        name: 'inDate',
        label: '入院时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm',
          valueFormat: 'yyyy-MM-dd HH:mm',
        }
      },
      {
        name: 'outDate',
        label: '出院时间',
        comp: 'el-date-picker',
        props: {
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:00',
          valueFormat: 'yyyy-MM-dd HH:mm',
        }
      },
      {
        name: 'diagnosisCodes',
        label: '主要诊断名称包含',
        comp: 'custom',
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.patientStatus = '2' // 患者状态 1-在院 2-出院
    queryObj.opStatus = '1'  // 文书状态 0-未归档 1-已归档
    queryObj.inDate = []
    queryObj.outDate = []
    queryObj.diagnosisCodes = []
    return {
      querySchema,
      queryObj,
      columns: [],
      url: urlMap.borrow.searchBorrowApply,
      dialogVisible: false,
      currentData: {},
    }
  },
  watch: {
    'queryObj.dptId': {
      handler (val) {
        this.$ever.getFieldFromSchema(this.querySchema, 'admitDoctorId').props.params.tenantSubjectIdList = [val]
      },
      deep: true
    },
    'queryObj.inDate': {
      handler (val) {
        if (val && val.length) {
          this.queryObj.admissionStartTime = this.queryObj.inDate[0] + ':00'
          this.queryObj.admissionEndTime = this.queryObj.inDate[1] + ':00'
        } else {
          delete this.queryObj.admissionStartTime
          delete this.queryObj.admissionEndTime
        }
      },
      deep: true
    },
    'queryObj.outDate': {
      handler (val) {
        if (val && val.length) {
          this.queryObj.dischargeStartTime = this.queryObj.outDate[0] + ':00'
          this.queryObj.dischargeEndTime = this.queryObj.outDate[1] + ':00'
        } else {
          delete this.queryObj.dischargeStartTime
          delete this.queryObj.dischargeEndTime
        }
      },
      deep: true
    }
  },
  created () {
    this.columns = this.getColumns()
  },
  mounted () {
    this.queryObj.diagnosisCodes = []
    this.list(false)
  },
  methods: {
    list (searchFirstPage = true) {
      this.$refs.table.list(searchFirstPage)
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    borrowApply (data) {
      this.dialogVisible = true
      this.currentData = data
    },
    async saveApply (data) {
      let params = {
        visitId: this.currentData.visitId,
        patientId: this.currentData.patientId,
        patientName: this.currentData.name,
        sex: this.currentData.sex,
        age: this.currentData.age,
        admissionTime: this.currentData.admissionTime,
        dischargeTime: this.currentData.dischargeTime,
        dptId: this.currentData.dptId,
        dptName: this.currentData.dptName,
        admitDoctorId: this.currentData.admitDoctorId,
        admitDoctorName: this.currentData.admitDoctorName,
        borrowingMethod: data.borrowingMethod ? '2' : '1',
        borrowingPurpose: data.borrowingPurpose,
        borrowingPeriod: String(data.borrowingPeriod)
      }
      let res = await request(urlMap.borrow.addBorrowing, params)
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '借阅申请成功', '提示')
        this.list(true)
      }
    },
    getColumns () {
      return [
        {
          prop: 'visitId',
          label: '住院号',
          width: 200,
        },
        {
          prop: 'name',
          label: '姓名',
          width: 150,
        },
        {
          slot: 'sex',
          prop: 'sex',
          label: '性别',
          width: 120,
        },
        {
          prop: 'age',
          label: '年龄',
          width: 120,
        },
        {
          prop: 'admitDoctorName',
          label: '住院医师',
          width: 150,
        },
        {
          prop: 'admissionTime',
          label: '入院时间',
        },
        {
          prop: 'dischargeTime',
          label: '出院时间',
        },
        {
          prop: 'dptName',
          label: '科室',
        },
        {
          prop: 'diagnosis',
          label: '主要诊断',
        },
        {
          type: 'btns',
          label: '操作',
          fixed: 'right',
          width: 120,
          btns ({ row }) {
            return [{
              prop: 'borrowApply',
              label: '借阅申请',
            }]
          },
        },
      ]
    }
  },
  components: {
    diagnosisMultiple,
    borrowApplyDialog
  }
}
</script>
<style scoped lang="less">
.layout_inner {
  /deep/ .el-form {
    .el-form-item:nth-last-child(2) {
      /deep/ .el-select {
        width: 400px;
      }
    }
  }
}
</style>
