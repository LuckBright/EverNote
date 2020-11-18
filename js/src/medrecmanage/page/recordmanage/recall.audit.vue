<template>
  <div class="layout_inner flex_column_full_hidden" style="box-sizing: border-box;">
    <div class="main-head">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          :gutter="20"
          :is-query="true"
          :inline="true"
          label-position="right"
          @query="list">
          <template slot="dptId">
              <ever-subject-select
                ref="dept"
                v-model="queryObj.dptId"
                type="select"
                placeholder="科室名称"
                fields="orgSubjectCode">
              </ever-subject-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      is-auto-height
      :fixed-height="50"
      @eventChange="eventChange">
      <template slot="sex">
        <el-table-column prop="sex" show-overflow-tooltip label="性别">
          <template slot-scope="scope">
            <template v-if="scope.row.sex || scope.row.sex === 0">
              <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
            </template>
            <template v-else>
              --
            </template>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <refuse-dialog command="1" :visible.sync="dialogVisible" @submit="refuseSubmit"></refuse-dialog>
    
  </div>
</template>

<script>
  // import {commandLog} from '@/phr/mixin/operationLog.js'
  import { request } from '@/util/req'
  import urlMap from '@/emr/urls'
  import refuseDialog from '@/medrecmanage/page/recordmanage/refuse.dialog'
  import {
  recallLevel2Schema,
  recallLevel2Colums
  } from '@/inpatient/page/medicalrecord/recall.config.js'
  export default {
    components: {
      refuseDialog
    },
    data () {
      let schema = recallLevel2Schema
      let queryObj = this.$ever.createObjFromSchema(schema)
      return {
        queryObj,
        schema,
        dialogVisible: false,
        url: urlMap.recall.medicalRecordAudit,
        tableData: [],
        allColumns: recallLevel2Colums,
        row: {}
      }
    },
    mounted () {
      // commandLog({
      //   content: '登录运行病历',
      //   opModuleOne: '病案管理-运行病历',
      //   opType: 'LOGIN'
      // })
    },
    methods: {
      list (searchFirstPage = true) {
        this.$refs.table.list(searchFirstPage)
      },
      eventChange ({ prop, row }) {
        this.row = row
        this[prop](row)
      },
      agree(row) {
        request(urlMap.recall.medicalRecordAgree, {id: row.id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
          }
        })
      },
      refuse () {
        this.dialogVisible = true
      },
      refuseSubmit (val, form) {
        request(urlMap.recall.medicalRecordRefuse, {id: this.row.id, recordReasonsForRejection: form.reasonsForRejection}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
          }
        })
      }
    }
  }
</script>
