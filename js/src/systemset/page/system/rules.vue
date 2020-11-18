<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        :has-ext="true"
        :ext-btn-string="'新建'"
        :ext-class-name="'fr'"
        @extAction="toNew"
      >
        <template slot="default">
          <el-form-item>
<!--            <el-button size="small" type="primary" @click="list()">查询</el-button>-->
<!--            <el-button size="small" @click="resetForm()">重置</el-button>-->
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      border
      method="get"
      :columns="columns"
      :url="url"
      fixed-elements="js-main-head"
      :params.sync="queryObj"
      @eventChange="eventChange"
    >
    </ever-table>
  </div>
</template>
<script>
  import urlMap from '@/systemset/urls'
  import {request} from '@/util/req'
  import './index.less'
  import {tableColWidth} from '@/util/table-config'
  const querySchema = [
  ]
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        columns: [
          {
            prop: 'id',
            label: 'id',
          },
          {
            prop: 'sn',
            label: 'sn',
          },
          {
            prop: 'name',
            label: '名称',
          },
          {
            prop: 'updator',
            label: '操作人',
            minWidth: tableColWidth.name7W120,
          },
          {
            prop: 'createTime',
            label: '操作时间',
            minWidth: tableColWidth.datetimeAllW160,
          },
          {
            type: 'btns',
            label: '操作',
            btns: [
              'edit',
              'del'
            ]
          }
        ],
        querySchema,
        queryObj,
        url: urlMap.rules.search,
      }
    },
    methods: {
      toNew () {
        this.$router.push('/systemset/rules/detail/create')
      },
      list () {
        this.$refs.table.list(true)
      },
      // resetForm () {
      //   this.$refs.form.resetForm()
      //   this.list()
      // },
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      edit (row) {
        this.$router.push('/systemset/rules/detail/edit/' + row.id)
      },
      del (row) {
        request(urlMap.rules.delete, {id: row.id}).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
            this.list()
          }
        })
      },
    },
  }
</script>
<style scoped lang="less">
</style>
