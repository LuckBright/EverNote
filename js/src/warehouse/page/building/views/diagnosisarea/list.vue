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
      @eventChange="eventChange"
    ></ever-table>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import '@/warehouse/page/building/assets/index.less'
  import {diagnosisAreaColumns} from '@/warehouse/page/building/views/diagnosisarea/model'

  const querySchema = [
    {
      name: 'diagnosisAreaName',
      label: '诊区名称',
    }
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.diagnosisArea.pageList,
        columns: diagnosisAreaColumns,
      }
    },
    created () {
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'building-diagnosisArea-detail', params: {type: 'create', id: '-1'}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.diagnosisArea.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'building-diagnosisArea-detail', params: {id, type: 'edit'}})
      },
    },
  }
</script>
