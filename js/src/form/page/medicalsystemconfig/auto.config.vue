<template>
  <div>
    <list
      ref="list"
      :org="org"
      :url="url"
      :page-name="pageName"
      :delete-url="deleteUrl"
      :all-columns="columns"
      :tenant-scope="tenantScope"
      :org-scope="orgScope"
      @openAdd="openAdd"
      @openEdit="openEdit">
    </list>

    <add
      ref="add"
      :org="org"
      :page-name="pageName"
      :visible.sync="addVisible"
      @close="close('addVisible')"></add>
    <edit
      ref="edit"
      :org="org"
      :page-name="pageName"
      :visible.sync="editVisible"
      :form="editForm"
      @close="close('editVisible')"></edit>
  </div>
</template>

<script>
  import add from './auto.add'
  import edit from './auto.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import urlMap from '@/form/urls'
  import moment from 'moment'
  // import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    name: 'AutoConfig',
    components: {
      add,
      edit,
      list
    },
    mixins: [openDialog],
    data () {
      return {
        pageName: '自动归档配置',
        url: urlMap.autoConfig.query,
        deleteUrl: urlMap.commonConfig.delete,
        detailUrl: urlMap.commonConfig.detail,
        columns: [
          {
            prop: 'ever-op',
            label: '操作',
            width: 130,
            type: 'btns',
            btns: ({ row }) => {
              let baseBtns = ['edit', 'del']
              // 集团类型不显示删除
              if (row.scope === 0) {
                baseBtns.splice(1, 1)
              }
              return baseBtns
            }
          },
          {
            prop: 'tenantName',
            label: '集团名称',
            showOverflowTooltip: true
          },
          {
            prop: 'orgName',
            label: '机构名称',
            showOverflowTooltip: true
          },
          {
            prop: 'data',
            label: '自动归档时效内容',
            showOverflowTooltip: true
          },
          {
            prop: 'updaterName',
            label: '操作人',
            width: 130
          },
          {
            prop: 'updateTime',
            label: '时间',
            width: 100,
            formatter ({ value }) {
              return value ? moment(value).format('YYYY-MM-DD') : ''
            }
          },
          {
            prop: 'remarks',
            label: '备注',
            showOverflowTooltip: true
          }
        ]
      }
    },
    created () {
      // commandLog({
      //   content: '',
      //   opModuleOne: '自动归档配置',
      //   opType: 200
      // })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-flow: column;
    height: 100%;
    .form {
      height: 43px;
    }
    .table {
      margin-top: -10px;
      flex: 1;
      overflow: auto;
      clear: both
    }
    .page {
      height: 50px;
    }
  }
</style>
