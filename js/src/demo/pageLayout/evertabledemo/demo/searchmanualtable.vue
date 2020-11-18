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
  import {GENERATE_UUID as U} from '@/bi/util/reportsetuuid'

  const querySchema = [
    {
      name: 'displayName',
      label: '账号姓名',
      placeholder: '输入账号姓名',
    },
  ]
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
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
    created () {
    },
    mounted () {
    },
    watch: {
    },
    methods: {
      // 查询方法
      list (searchFirstPage = true) {
        // 查询条件改变时触发查询
        this.params = {
          ...this.queryObj,
          _uuid: U(), // 当没有条件改变时也触发查询
          searchFirstPage, // 控制是否查询第一页
        }
      },
      // 此方法会在页面初始化时执行
      changeParams (params) {
        // 给表单赋值
        this.queryObj = {...this.queryObj, ...params}
        // 此时需要按照url地址栏的页码进行查询 (即不按照第一页去查)
        this.list(false)
        // 开始侦听queryObj的变化，当queryObj变化时，进行查询
        // this.$watch('queryObj', function () {
        //   this.list()
        // }, {deep: true})
      },
    },
  }
</script>

<style scoped lang="less">
</style>
