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
  import add from './write.add'
  import edit from './write.edit'
  import list from './list'
  import openDialog from './mixins/dialog.mixin'
  import { request } from '@/util/req'
  import urlMap from '@/form/urls'
  import moment from 'moment'
  import {FONT_PT_SIZES, FONT_TYPE_NAMES} from './font.config.js'
  import {commandLog} from '@/phr/mixin/operationLog.js'
  export default {
    name: 'WriteConfig',
    components: {
      add,
      edit,
      list
    },
    mixins: [openDialog],
    data () {
      return {
        pageName: '病历书写配置',
        url: urlMap.writeConfig.query,
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
            label: '字体',
            showOverflowTooltip: true,
            formatter ({ value }) {
              return FONT_TYPE_NAMES.find((v, k) => { return v.fontFamily === value }) && FONT_TYPE_NAMES.find((v, k) => { return v.fontFamily === value }).name || ''
            }
          },
          {
            prop: 'data1',
            label: '字号',
            showOverflowTooltip: true,
            formatter ({ value }) {
              return FONT_PT_SIZES.find((v, k) => { return String(v.pt) === value }) && FONT_PT_SIZES.find((v, k) => { return String(v.pt) === value }).name || ''
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
            let hasFontsize = false
            let hasFontfamily = false
            res.data.list.forEach(item => {
              switch (item.code) {
                case 'FONTSIZE':
                  res.data['fontsize'] = Number(item.value)
                  hasFontsize = true
                  break
                case 'TYPEFACE':
                  res.data['fontfamily'] = item.value
                  hasFontfamily = true
                  break
                case 'COPY_AND_PASTE':
                  res.data['copyset'] = JSON.parse(item.value).map(v => {
                    v = String(v)
                    return v
                  })
                  break
              }
            })
            if (!hasFontsize) res.data['fontsize'] = ''
            if (!hasFontfamily) res.data['fontfamily'] = ''
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
