<template>
  <div>
  <ever-bread-crumb path="/manages/org/staff"></ever-bread-crumb>
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
        max-btn-count="5"
        :before-list="beforeList"
        @eventChange="eventChange"
      ></ever-table>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import '@/manages/page/organization/assets/less/index.less'
  import {staffWebCreditColumns} from '@/manages/page/organization/views/staff/model'

  const querySchema = [
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.staffWebCredit.loadByThcStaffId,
        columns: staffWebCreditColumns,
        staffId: null,
      }
    },
    created () {
      this.queryObj.thcStaffId = this.$route.params.id
      this.staffId = this.$route.params.id
    },
    methods: {
      beforeList () {
        return this.queryObj.thcStaffId
      },
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'org-staff-punish-detail', params: {type: 'create', id: '-1', staffId: this.staffId}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.staffWebCredit.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'org-staff-punish-detail', params: {id, type: 'edit', staffId: this.staffId}})
      },
    },
  }
</script>
