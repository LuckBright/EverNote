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
      :showAdd="showAdd"
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
      :visible.sync="editVisible"
      :page-name="pageName"
      :form="editForm"
      @close="close('editVisible')"></edit>
  </div>
</template>

<script>
  import add from './temperature.add'
  import edit from './temperature.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import urlMap from '@/form/urls'
  import { request } from '@/util/req'
  import emrUrl from '@/emr/urls.js'
  import moment from 'moment'
  export default {
    name: 'Temperature',
    components: {
      add,
      edit,
      list
    },
    mixins: [openDialog],
    data () {
      return {
        pageName: '体温单配置',
        showAdd: true,
        url: urlMap.temperatureConfig.query,
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
            label: '体温单类型',
            showOverflowTooltip: true,
            formatter ({ value }) {
              return value === '1' ? '体温单' : '体温疼痛单'
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
    // 获取是否可添加体温单配置权限，如果本机构有用过体温单，那就不能再添加了
      request(emrUrl.templateManage.getsystemConfigDisabled, {type: 3}).then(res => {
        if (res.head.errCode === 0) {
          if (this.$route.meta.workshopTag === 'orgSetting') {
            this.showAdd = !res.data
          }
        }
      })
    }
  }
</script>
