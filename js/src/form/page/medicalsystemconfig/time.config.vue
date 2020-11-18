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
      :page-type="pageType"
      :show-add="org"
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
  import add from './time.add'
  import edit from './time.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import urlMap from '@/form/urls'
  import moment from 'moment'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    name: 'TimeConfig',
    components: {
      add,
      edit,
      list
    },
    mixins: [openDialog],
    data () {
      return {
        pageName: '时限性质控配置',
        url: urlMap.timeConfig.query,
        deleteUrl: urlMap.timeConfig.delete,
        columns: [
          {
            prop: 'ever-op',
            label: '操作',
            width: 130,
            type: 'btns',
            btns: ({ row }) => {
              let baseBtns = ['edit', 'del']
              // 集团类型不显示删除
              if (row.scope === 1) {
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
            prop: 'desc',
            label: '事件时效描述',
            showOverflowTooltip: true
          },
          {
            prop: 'eventName',
            label: '发生事件',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'expValue',
            label: '时效值',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'categoryName',
            label: '应写文件类别',
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
            prop: 'comment',
            label: '备注',
            showOverflowTooltip: true
          }
        ],
        // 集团类型值
        tenantScope: 1,
        // 机构类型值
        orgScope: 2,
        // 页面类型
        pageType: 'time'
      }
    },
    methods: {
      openEdit (row) {
        commandLog({
          content: `修改了${row.orgName || row.tenantName}的${this.pageName}`,
          opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
          opType: 'CLICK_EDIT'
        })
        this.editForm = Object.assign({}, this.editForm, row)
        this.$nextTick(() => {
          this.editVisible = true
          this.reset('edit')
        })
      }
    }
  }
</script>
