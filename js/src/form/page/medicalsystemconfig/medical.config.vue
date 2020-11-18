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
  import add from './medical.add'
  import edit from './medical.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import urlMap from '@/form/urls'
  import moment from 'moment'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    name: 'MedicalConfig',
    components: {
      add,
      edit,
      list
    },
    mixins: [openDialog],
    data () {
      return {
        pageName: '病案首页配置',
        url: urlMap.medicalConfig.query,
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
            label: '病案首页类别',
            showOverflowTooltip: true,
            formatter ({ value }) {
              return value === 'beijing' ? '住院病案首页' : '中医住院病案首页'
            }
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
      commandLog({
        content: '登录病历系统配置',
        opModuleOne: '病历管理-病历系统配置',
        opType: 'LOGIN'
      })
    }
  }
</script>
