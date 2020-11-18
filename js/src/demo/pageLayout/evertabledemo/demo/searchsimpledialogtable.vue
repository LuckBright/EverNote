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
      :columns="columns"
      :url="url"
      :params.sync="queryObj"
      is-auto-height
      @eventChange="eventChange"
    >
    </ever-table>
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <span slot="title">
        弹出层中的表格不使用url中的参数
      </span>
      <ever-table
        :url="url"
        :params.sync="dialogParams"
        :columns="columns"
        :is-record-url-params="false"
      ></ever-table>
    </el-dialog>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'

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
        columns: [
          {
            prop: 'id',
            label: '编号',
          },
          {
            prop: 'name',
            label: '姓名',
          },
          {
            prop: 'name',
            label: '姓名',
          },
          {
            prop: 'ever-op', // 该列的唯一标示
            type: 'btns',
            label: '操作',
            btns: [{
              prop: 'edit2',
              label: '弹出一个表格',
            },
            {
              prop: 'edit3',
              label: '编辑3',
            },
            ]
          }
        ],
        querySchema,
        queryObj,
        dialogVisible: false,
        dialogParams: {id: '1'},
      }
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      eventChange ({prop, row, col}) {
        this[prop](row)
      },
      edit2 (row) {
        this.dialogVisible = true
        // this.$nextTick(() => {
        //   this.dialogParams.id = row.id
        // })
      },
    },
  }
</script>

<style scoped lang="less">
</style>
