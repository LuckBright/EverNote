<template>
  <div class="recall_log">
    <div class="query">
      <ever-form2
        :schema="schema"
        v-model="queryObj"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="list">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
        </template>
        
      </ever-form2>
    </div>
    <div class="table">
      <ever-table
        :max-height="maxHeight"
        ref="table"
        :columns="columns"
        :url="url"
        :params.sync="queryObj"
        is-auto-height
        :fixed-height="50"
        :is-auto-check-row="false"
        :is-record-url-params="false"
        @eventChange="eventChange"
        >
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
    </div>
  </div>
</template>
<script>
import urlMap from '@/emr/urls'
import maxHeight from './maxheight.js'
import {
  recallLogSchema,
  recallLogColums
  } from '@/inpatient/page/medicalrecord/recall.config.js'
export default {
  name: 'recall_log',
  mixins: [maxHeight],
  data () {
    let schema = recallLogSchema
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      columns: recallLogColums,
      url: urlMap.recall.recallRecord
    }
  },
  methods: {
    list (searchFirstPage = true) {
      this.$refs.table.list(searchFirstPage)
    },
    search () {},
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    showRecord (row) {
      let routeNames = {
        recordrecallForDoctor: 'medicalRecordDetailForDoctor',
        recordrecallForNurse: 'medicalRecordDetailForNurse'
      }
      let query = {
        patientId: row.patientId,
        visitNumber: row.visitId,
        providerId: row.dptId,
        patientName: row.patientName,
        from: 'medicalRecall'
      }
      this.$router.push({name: routeNames[this.$route.name], query})
    }
  }
}
</script>

