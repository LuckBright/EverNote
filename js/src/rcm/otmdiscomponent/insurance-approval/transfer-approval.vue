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
        >
      </ever-form2>
    </div>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="personName" label="姓名"></el-table-column>
      <el-table-column prop="visitNumber" label="住院流水号" width="200"></el-table-column>
      <el-table-column prop="hospitalizedEndDate" label="出院日期"></el-table-column>
      <el-table-column prop="sectionName" label="科室" width="150"></el-table-column>
      <el-table-column prop="diseaseArea" label="病区"></el-table-column>
      <el-table-column prop="bedno" label="床号"></el-table-column>
      <el-table-column prop="patientContact" label="联系电话"></el-table-column>
      <el-table-column prop="opStatus" label="状态">
        <template slot-scope="scope">
          {{!scope.row.opStatus?'未审批':'已审批'}}
        </template>
      </el-table-column>
      <el-table-column prop="approvePersonName" label="审批人"></el-table-column>
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.opStatus" type="primary" size="small" @click="check(scope.row, 'approval')">审批</el-button>
          <el-button v-if="!!scope.row.opStatus" type="primary" size="small" @click="cancel(scope.row)">撤销</el-button>
          <el-button v-if="!!scope.row.opStatus" type="primary" size="small" @click="check(scope.row, 'check')">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
    <transfer-log ref="transferLog" :data="data" :type="type" @success="success"></transfer-log>
  </div>
</template>
<script>
import {
  getTransferList,
  cancelTranSfer
} from '@/rcm/store/otmdiscomponent/insurance-approval-api'
import list from '@/util/list'
import transferLog from './transfer-log'
let schema = [
  {
    name: 'visitNumber',
    label: '住院流水号'
  },
  {
    name: 'section',
    label: '科室',
    comp: 'everSubjectSelect',
    props: {
      type: 'select'
    }
  },
  {
    name: 'personName',
    label: '姓名'
  },
  {
    name: 'approvePersonName',
    label: '审批人'
  },
  {
    name: 'date',
    label: '入院时间',
    comp: 'everRangePicker',
    props: {
      type: 'datetimerange'
    }
  }
]
export default {
  components: {
    transferLog
  },
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      loading: false,
      type: 'approval',
      data: {}
    }
  },
  methods: {
    cancel (row) {
      this.$confirm('是否撤销审批', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        let params = {
          insuranceOrgId: '307cb17330944ff5ba1969453eb92f82',
          macId: this.macId,
          personno: row.approvalNo,
          approvalNo: row.approvalNo,
          approvePerson: row.approvePerson,
          approvalId: row.approvalId
        }
        cancelTranSfer(params).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '撤销成功')
            this.list()
          } else {
            this.loading = false
          }
        })
      })
    },
    check (row, type) {
      this.type = type
      this.data = JSON.parse(JSON.stringify(row))
      this.$refs.transferLog.dialogVisible = true
    },
    success () {
      this.list()
    },
    list () {
      this.loading = true
      let params = Object.assign({pagesize: this.pagesize, offset: this.offset, clinicId: localStorage.getItem('CLINICID')}, this.queryObj)
      delete params.date
      if (this.queryObj.date[0]) {
        params['hospitalizedStartDate'] = this.queryObj.date[0].replace(/-/g, '')
        params['hospitalizedEndDate'] = this.queryObj.date[1].replace(/-/g, '')
      }
      if (this.queryObj.section) {
        params.sectionId = this.queryObj.section.id
        delete params.section
      }
      getTransferList(params).then(rs => {
        if (!rs.head.errCode) {
          this.loading = false
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.loading = false
        }
      }).catch(rj => {
        this.loading = false
      })
    },
    upload (row) {
    }
  }
}
</script>
