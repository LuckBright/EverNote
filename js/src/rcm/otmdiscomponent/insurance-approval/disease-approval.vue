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
        <el-button type="primary" @click="jljhybReadCard(false)">新增</el-button>
      </div>
    </div>
    <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
      <el-table-column show-overflow-tooltip prop="approveNo" label="审批编号"></el-table-column>
      <el-table-column prop="approveType" label="审批类别">
        <template slot-scope="scope">{{scope.row.approveType | approveType}}</template>
      </el-table-column>
      <el-table-column prop="approvePerson" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">{{scope.row.sex | formatSex}}</template>
      </el-table-column>
      <el-table-column prop="birthDay" label="出生日期">
        <template
          slot-scope="scope"
        >{{scope.row.birthDay && $moment(String(scope.row.birthDay).substring(0, 8)).format('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="personno" label="个人编号"></el-table-column>
      <el-table-column prop="remark" label="诊断"></el-table-column>
      <el-table-column prop="startDay" label="开始日期"></el-table-column>
      <el-table-column prop="endDay" label="终止日期"></el-table-column>
      <el-table-column prop="doctor" label="诊断医生"></el-table-column>
      <el-table-column prop="approvePerson" label="经办人"></el-table-column>
      <el-table-column prop="approveTime" label="经办日期"></el-table-column>
      <el-table-column prop="isValid" label="有效标识">
        <template slot-scope="scope">{{scope.row.isValid === '1'? '有效':''}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="check(scope.row, 'modify')">修改</el-button>
          <el-button type="primary" size="small" @click="check(scope.row, 'check')">详情</el-button>
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
    <approval-log
      ref="approvalLog"
      :headInfo="headInfo"
      :data="data"
      :type="type"
      @success="success"
    ></approval-log>
  </div>
</template>
<script>
import {
  reportList
} from '@/rcm/store/otmdiscomponent/insurance-approval-api'
import list from '@/util/list'
import personno from '@/rcm/otmdiscomponent/personno.vue'
import { getPersonInfo as jljhybGetPersonInfo } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import approvalLog from './approval-log'
import { jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
let schema = [
  {
    name: 'personno',
    label: '个人编号',
    comp: personno,
    props: {
      insuranceOrgId: jljhCode
    }
  },
  {
    name: 'personName',
    label: '姓名'
  },
  {
    name: 'approvePerson',
    label: '经办人'
  },
  {
    name: 'date',
    label: '经办时间',
    comp: 'everRangePicker',
    props: {
      type: 'datetimerange'
    }
  }
]
export default {
  components: {
    approvalLog
  },
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      loading: false,
      headInfo: {},
      type: 'add',
      data: {}
    }
  },
  filters: {
    approveType (val) {
      if (val === '11') {
        return '门诊慢病'
      } else if (val === '12') {
        return '门诊大病'
      } else {
        return '其他'
      }
    }
  },
  methods: {
    check (row, type) {
      this.type = type
      this.data = JSON.parse(JSON.stringify(row))
      this.$refs.approvalLog.dialogVisible = true
    },
    success () {
      this.list()
    },
    jljhybReadCard () {
      this.loading = true
      let params = {
        insuranceOrgId: '307cb17330944ff5ba1969453eb92f82',
        macId: this.macId
      }
      jljhybGetPersonInfo(params).then(res => {
        this.loading = false
        let result = res.data && res.data.infos && res.data.infos[0]
        this.headInfo = result
        this.type = 'add'
        this.$refs.approvalLog.dialogVisible = true
      }, err => {
        console.log('err', err)
        this.$messageTips(this, 'error', '读卡失败，请稍后再试！')
        this.loading = false
        this.v = false
      }).catch((err) => {
        console.log('err', err)
        this.loading = false
      })
    },
    list () {
      this.loading = true
      let params = Object.assign({ pageSize: this.pagesize, offset: this.offset }, this.queryObj)
      delete params.date
      if (this.queryObj.date[0]) {
        params['approveStartTime'] = this.queryObj.date[0].replace(/-/g, '')
        params['approveEndTime'] = this.queryObj.date[1].replace(/-/g, '')
      }
      reportList(params).then(rs => {
        if (!rs.head.errCode) {
          this.loading = false
          this.tableData = rs.data
          this.totalCount = rs.totalCount
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
