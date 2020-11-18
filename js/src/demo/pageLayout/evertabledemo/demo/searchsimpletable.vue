<template>
  <div class="layout_inner bg-black">
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
            <el-button type="primary" plain @click="resetConfigOption">重置ConfigOption</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="container-width">
      <ever-table
        class="light-theme-table"
        :border="false"
        ref="table"
        :columns="columns"
        :url="url"
        :params.sync="queryObj"
        :table-page-size="10"
        :is-auto-height="false"
        :is-pagination="false"
      >
      </ever-table>
    </div>
  </div>
</template>

<script>
  import urlMap from '@/util/urls'
  import {request} from '@/util/req'

  const querySchema = [
    {
      name: 'displayName',
      label: '需要重置的表格id',
      placeholder: '需要重置的id，点击重置按钮，可以重置表格',
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
            // width: 100,
          },
          {
            prop: 'name',
            label: '姓名',
            // width: 100,
          },
          {
            prop: 'id',
            label: '编号动态表头',
            // width: 100,
          },
          {
            prop: 'name',
            label: '编号动态表头',
            // width: 100,
          },
          // {
          //   prop: 'id',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'name',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'id',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'name',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'id',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'name',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'id',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          // {
          //   prop: 'name',
          //   label: '编号动态表头',
          //   width: 100,
          // },
          {
            prop: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
            type: 'btns',
            label: '操作',
            btns: ({ row }) => {
              return [
                {
                  prop: 'check',
                  label: '查看',
                },
                {
                  prop: 'edit',
                  label: '编辑'
                },
                {
                  prop: 'del',
                  label: '删除'
                }
              ]
            },
            // width: 160,
            // fixed: 'right'
          },
        ],
        querySchema,
        queryObj,
      }
    },
    methods: {
      list () {
        this.$refs.table.list(true)
      },
      async resetConfigOption () {
        if (!this.queryObj.displayName) {
          this.$messageTips(this, 'error', '表格id必填')
          return
        }
        const {data} = await request(urlMap.getTableConfig, {
          tableId: this.queryObj.displayName,
        }, 'get')
        if (data && data.config) {
          request(urlMap.saveTableConfig, {
            tableId: this.queryObj.displayName,
            config: '',
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '重置成功')
            }
          })
        } else {
          this.$messageTips(this, 'error', '该id无需重置')
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .container-width {
    width: 1400px;
  }
  .bg-black {
    background-color: #d0d6df;
  }
</style>
