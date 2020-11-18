<template>
  <div class="deblock_apply flex_layout_full">
    <div class="layout_inner">
      <template v-if="isLock">
        <div class="query">
          <ever-form2
            :schema="schema"
            v-model="queryObj"
            :gutter="20"
            :is-query="true"
            :inline="true"
            label-position="right"
            @query="search"
          >
            <template slot="default">
              <el-form-item>
                <el-button type="primary" @click="search()">查询</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </div>
        <div class="table">
          <ever-table
            :key="uuid"
            ref="table"
            border
            :columns="columns"
            :url="url"
            :params.sync="queryObj"
            is-auto-height
            :fixed-height="60"
            :spanMethod="mergeRow"
            @eventChange="eventChange"
            @afterSearch="afterSearch"
          ></ever-table>
        </div>
      </template>
      <ever-no-data tipTxt="未开启加锁功能，如有需要请联系管理员" v-else></ever-no-data>
    </div>
  </div>
</template>
<script>
import uuid from 'uuid/v4'
import { request } from '@/util/req'
import urls from '@/emr/urls'
import {
  applyDeblockSchema,
  applyDeblockColumns,
} from '@/inpatient/page/medicalrecord/deblock.config.js'
import mergeRow from '@/medrecmanage/page/recordmanage/mergerow.js'
export default{
  name: 'deblock_apply',
  mixins: [mergeRow],
  data () {
    let queryObj = this.$ever.createObjFromSchema(applyDeblockSchema)
    queryObj.lockStatus = '1'
    queryObj.medicalType = this.$route.matched[0].meta.medicalType // 1住院医生，3，护理
    return {
      queryObj,
      isLock: this.$ever.getClinicConfig().MEDICAL_RECORD_IS_LOCK === '1',
      schema: applyDeblockSchema,
      columns: applyDeblockColumns,
      url: urls.unlock.searchApplyUnLock,
      uuid: uuid(),
      mergeRowRule: {}
    }
  },
  methods: {
    search () {
      this.uuid = uuid()
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    applyUnLock (row) {
      request(urls.unlock.applyUnlock, {id: row.id}).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '申请解锁提交成功！', '提示')
          this.search()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.layout_inner {
  width: 100%;
}
</style>
