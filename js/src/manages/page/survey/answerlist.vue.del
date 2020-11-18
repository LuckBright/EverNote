<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="true"
        :ext-btn-string="'新建'"
        :ext-class-name="'fr'"
        @extAction="toPage"
      >
        <template slot="default">
          <el-form-item>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :params.sync="queryObj"
      :columns="columns"
      is-auto-height
      :before-list="beforeList"
      @eventChange="eventChange"
    ></ever-table>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import { isManages, isWarehouse } from '@/manages/page/organization/utils/fns'
  import '@/manages/page/organization/assets/less/index.less'
  import {staffColumns} from '@/manages/page/organization/views/staff/model'
  import storage from '@/util/storage'

  const querySchema = [
    {
      name: 'name',
      label: '姓名',
    }
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.staff.pageList,
        columns: staffColumns,
      }
    },
    created () {
      if (isWarehouse()) {
        this.queryObj.orgId = storage.getStorageByClinic('CLINICID')
      }
    },
    methods: {
      beforeList () {
        if (isManages()) {
          return true
        } else if (isWarehouse()) {
          return this.queryObj.orgId
        }
      },
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'surveyDetail', params: {surveyId: '-1'}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.staff.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'org-staff-detail', params: {id, type: 'edit'}})
      },
    },
  }
</script>
