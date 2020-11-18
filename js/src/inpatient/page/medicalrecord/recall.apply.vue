<template>
  <div class="recall_apply">
    <ever-form2
      :schema="schema"
      v-model="queryObj"
      :gutter="20"
      :is-query="true"
      :inline="true"
      label-position="right">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list()">查询</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <ever-table
        :max-height="maxHeight"
        ref="table"
        :columns="columns"
        :url="url"
        :params.sync="queryObj"
        is-auto-height
        :fixed-height="50"
        :is-record-url-params="true"
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
    <dialog-recall-apply
      :row="row"
      :dialogVisible.sync="dialogVisible"
    ></dialog-recall-apply>
  </div>
</template>
<script>
import urlMap from '@/emr/urls'
import {
  recallApplySchema,
  getRecallApplyColums
  } from '@/inpatient/page/medicalrecord/recall.config.js'
import dialogRecallApply from '@/inpatient/page/medicalrecord/recall.apply.dialog'
import maxHeight from './maxheight.js'
export default {
  name: 'recall_apply',
  mixins: [maxHeight],
  components: {
    dialogRecallApply
  },
  data () {
    let schema = recallApplySchema
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      queryObj,
      dialogVisible: false,
      schema,
      columns: getRecallApplyColums(this.$route.matched[0].meta.space),
      row: {}
      // url: urlMap.recall.recallApplyListForDoctor
    }
  },
  computed: {
    url() {
      if (this.$route.matched[0].meta.space === 'resident') {
        return urlMap.recall.recallApplyListForDoctor
      } else if (this.$route.matched[0].meta.space === 'inpatient') {
        return urlMap.recall.recallApplyListForNurse
      }
    }
  },
  watch: {
    'queryObj.admission': {
      handler (val) {
        if (val && val.length) {
          this.queryObj.admissionStartTime = val[0]
          this.queryObj.admissionEndTime = val[1]
        } else {
          this.queryObj.admissionStartTime = null
          this.queryObj.admissionEndTime = null
        }
      },
      deep: true
    },
    'queryObj.discharge': {
      handler (val) {
        if (val && val.length) {
          this.queryObj.dischargeStartTime = val[0]
          this.queryObj.dischargeEndTime = val[1]
        } else {
          this.queryObj.dischargeStartTime = null
          this.queryObj.dischargeEndTime = null
        }
      }
    }
  },
  methods: {
    list (searchFirstPage = true) {
      this.$refs.table.list(searchFirstPage)
    },
    search () {
      console.log('obj', this.queryObj)
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    updateRow(row) {
      this.row = JSON.parse(JSON.stringify(row))
      this.row.patientName = this.row.name
      this.row.residentId = this.row.chargeDoctorId
      this.row.residentName = this.row.chargeDoctorName
      delete this.row.name
      delete this.row.chargeDoctorId
      delete this.row.chargeDoctorName
    },
    apply (row) {
      this.dialogVisible = true
      this.updateRow(row)
    }
  }
}
</script>

