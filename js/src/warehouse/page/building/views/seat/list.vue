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
  import {bedColumns} from '@/warehouse/page/building/views/bed/model'

  const querySchema = [
    {
      name: 'bedName',
      label: '座位编号',
    }
  ]
  export default {
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      return {
        querySchema,
        queryObj,
        url: urlMap.bed.pageList,
        columns: bedColumns,
      }
    },
    created () {
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      toPage () {
        this.$router.push({name: 'building-bed-detail', params: {type: 'create', id: '-1'}})
      },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      del ({id}) {
        request(urlMap.bed.delete, {id}).then(res => {
          if (res.head.errCode === 0) {
            this.list()
            this.$messageTips(this, 'success', '删除成功')
          }
        })
      },
      edit ({id}) {
        this.$router.push({name: 'building-bed-detail', params: {id, type: 'edit'}})
      },
    },
  }
</script>
