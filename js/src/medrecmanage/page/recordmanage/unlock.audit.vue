<template>
  <div class="layout_inner flex_column_full_hidden" style="box-sizing: border-box;">
    <template v-if="isLock">
    <div class="main-head">
      <ever-form2
          :schema="schema"
          v-model="queryObj"
          :gutter="20"
          :is-query="true"
          :inline="true"
          label-position="right"
          @query="search"
        >
          <template slot="subjectId">
            <ever-subject-select
              ref="dept"
              v-model="queryObj.subjectId"
              type="select"
              placeholder="科室名称"
              fields="orgSubjectCode">
            </ever-subject-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
    </div>
    <ever-table
      :key="uuid"
      ref="table"
      border
      :columns="columns"
      :url="url"
      :params.sync="queryObj"
      is-auto-height
      :fixed-height="50"
      :spanMethod="mergeRow"
      @afterSearch="afterSearch"
      @eventChange="eventChange">
      <!-- <template slot="sex">
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
      </template> -->
    </ever-table>
    </template>
    <ever-no-data tipTxt="未开启加锁功能，如有需要请联系管理员" v-else></ever-no-data>
  </div>
</template>

<script>
  import { request } from '@/util/req'
  import urls from '@/emr/urls'
  import {
  unlockAuditSchema,
  unlockAuditColumns
} from '@/inpatient/page/medicalrecord/deblock.config.js'
import mergeRow from '@/medrecmanage/page/recordmanage/mergerow.js'
import uuid from 'uuid/v4'
  export default {
    name: 'unlock_audit',
    mixins: [mergeRow],
    data () {
      let queryObj = this.$ever.createObjFromSchema(unlockAuditSchema)
      queryObj.lockStatus = '2'
      return {
        queryObj,
        isLock: this.$ever.getClinicConfig().MEDICAL_RECORD_IS_LOCK === '1',
        uuid: uuid(),
        schema: unlockAuditSchema,
        url: urls.unlock.searchLock,
        columns: unlockAuditColumns,
        mergeRowRule: {}
  
      }
    },
    mounted() {
    },
    methods: {
      // 查询
      search () { // 点击查询按钮的时候更新一下table
        this.uuid = uuid()
      },
      eventChange ({ prop, row }) {
        this[prop](row)
      },
      // 查看病历
      agree (row) {
        this.$confirm('请确认是否要解锁！如果非异常情况解锁成功，可能导致病历数据多人编辑情况，以致内容丢失情况！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request(urls.unlock.relieveLock, {id: row.id}).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '解锁成功', '提示')
              this.search()
            }
          })
        })
      }
    }
  }
</script>
