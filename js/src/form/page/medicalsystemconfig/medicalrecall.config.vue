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
  import add from './medicalrecall.add'
  import edit from './medicalrecall.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import {request} from '@/util/req'
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
        pageName: '病历召回配置',
        url: urlMap.recallConfig.query,
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
            label: '病历召回流程',
            showOverflowTooltip: true,
            formatter ({ value }) {
              let process = {
                'level2': '二级召回审核流程',
                'level3': '三级召回审核流程'
              }
              return process[value]
            }
          },
          {
            prop: 'data1',
            label: '病历召回时限',
            showOverflowTooltip: true,
            formatter ({ value }) {
              return value + '天'
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
    methods: {
      async openEdit (row) {
        commandLog({
          content: `修改了${row.orgName || row.tenantName}的${this.pageName}`,
          opModuleOne: `${this.levelOneName}-${this.levelTwoName}-${this.pageName}`,
          opType: 'CLICK_EDIT'
        })
        let res = await request(this.detailUrl, {id: row.id})
        if (res.head && res.head.errCode === 0) {
          if (res.data.list && res.data.list.length) {
            res.data.list.forEach(item => {
              switch (item.code) {
                case 'AUDIT_PROCESS':
                  res.data['AUDIT_PROCESS'] = item.value
                  break
                case 'AUDIT_TIME':
                  res.data['AUDIT_TIME'] = item.value
                  break
              }
            })
          }
          this.editForm = Object.assign({}, this.editForm, res.data)
          this.$nextTick(() => {
            this.editVisible = true
            this.reset('edit')
          })
        }
      }
    }
  }
</script>
