<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
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
      :params="params"
      @update:params="changeParams"
      is-auto-height
    >
    </ever-table>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'
  import list from '@/components/evertablesearch'

  const querySchema = [
    {
      name: 'displayName',
      label: '账号姓名',
      placeholder: '输入账号姓名',
    },
  ]
  export default {
    mixins: [list],
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        // notAutoSearch: true, // 关闭自动查询
        url: urlMap.demo.remote,
        allColumns: [
          {
            prop: 'id',
            label: '编号',
          },
          {
            prop: 'name',
            label: '姓名',
          },
        ],
        querySchema,
        queryObj,
        params: {},
      }
    },
  }
</script>

<style scoped lang="less">
</style>
