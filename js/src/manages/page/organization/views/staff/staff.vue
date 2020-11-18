<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item class="fr">
            <el-button v-if="!isConfig" type="primary" @click="toPage">新建</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :url="url"
      :params.sync="queryObj"
      :columns="columns"
      is-auto-height
      :beauty-params="{excludes: ['tenantSubjectList']}"
      :before-list="beforeList"
      @eventChange="eventChange"
      :handle-result="handleResult"
    >
      <template slot="name" slot-scope="{row}">
        {{row.name}}<span class="danger">{{row.status === 'N' ? '(已禁用)' : ''}}</span>
      </template>
    </ever-table>
    <el-dialog :visible.sync="dialog" :title="dialogTitle">
      <detail-user v-if="staffId" :key="dialogKey" type="edit" :id="staffId" :staff-info="staff" is-dialog @close="close" @save="saved"></detail-user>
    </el-dialog>
    <el-dialog :visible.sync="dochelpDialog" title="医助信息">
      <dochelp v-if="dochelpDialog"  :id="docHelpStaffId" :currentUser="docHelpStaff" @close="closeHelp"></dochelp>
    </el-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/manages/page/organization/utils/urls'
import configUrlMap from '@/manages/page/configure/urls'
import { isManages, isWarehouse } from '@/manages/page/organization/utils/fns'
import '@/manages/page/organization/assets/less/index.less'
import { simpleList, staffColumns } from '@/manages/page/organization/views/staff/model'
import DetailUser from '@/manages/page/organization/views/staff/detail-user'
import storage from '@/util/storage'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import dochelp from '@/manages/page/organization/views/staff/dochelp'

const querySchema = [
  {
    name: 'name',
    label: '姓名',
  },
  {
    name: 'webHospitalDoctor',
    label: '是否开通互联网医院',
    comp: 'select',
    parentClass: 'common-short-select',
    props: {
      options: simpleList,
      clearable: true,
      placeholder: '请选择',
    }
  },
  {
    name: 'outpatientDoctor',
    label: '是否外院医生',
    comp: 'select',
    parentClass: 'common-short-select',
    props: {
      options: simpleList,
      clearable: true,
      placeholder: '请选择',
    }
  },
  {
    name: 'orgId',
    label: '组织机构',
    comp: 'ever-org-select',
    props: {
      type: 'cascader',
      fields: 'id',
      isOrg: false,
    }
  },
  {
    name: 'tenantSubjectList',
    label: '执业科室',
    comp: 'ever-subject-select',
    // parentClass: 'common-multiple',
    props: {
      multiple: true,
      isManage: true,
      type: 'select'
    }
  },
]
export default {
  components: { DetailUser, dochelp },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.orgId = ''
    queryObj.dataFlag = ''
    queryObj.tenantSubjectIdList = []
    return {
      dochelpDialog: false,
      querySchema,
      queryObj,
      url: urlMap.staff.pageList,
      columns: staffColumns,
      dialog: false,
      dialogTitle: '',
      staffId: null,
      staff: null,
      dialogKey: U(),
      isConfig: false,
      docHelpStaffId: '',
      docHelpStaff: ''
    }
  },
  watch: {
    'queryObj.tenantSubjectList': {
      handler (v) {
        if (v && v.length) {
          this.queryObj.tenantSubjectIdList = v.map(item => item.id)
        } else {
          this.queryObj.tenantSubjectIdList = []
        }
      },
      deep: true
    }
  },
  created () {
    this.columns.find(item => item.prop === 'op').btns = ({row}) => [
      // {prop: 'viewDetail', label: '查看'},
      'edit',
      { prop: 'account', label: row.username ? '修改账号' : '开通账号' },
      ...(isManages() ? [{ prop: 'webh', label: '互联网信息' }] : []),
      ...(isManages() ? [{ prop: 'punish', label: '奖惩信息' }] : []),
      { prop: 'unlock', label: '解锁账号' },
      { prop: 'dochelp', label: '医助信息' },
      ...this.getOperationDelBtn({row}),
    ]
    if (isWarehouse()) {
      this.queryObj.orgId = storage.getStorageByClinic('CLINICID')
      // 在机构设置工作站下：判断是否集中管控，若是集中管控，则隐藏新建按钮
      request(configUrlMap.list).then(res => {
        // 参照 @/util/warehouseconfig
        this.isConfig = res.data.find(item => item.type === 103).isConfig === 1
        if (this.isConfig) {
          this.columns.find(item => item.prop === 'op').btns = [{ prop: 'edit', label: '查看' }]
        } else {
          this.columns.find(item => item.prop === 'op').btns = ({ row }) => {
            return row.orgId === storage.getStorageByClinic('CLINICID') ? [
              // {prop: 'viewDetail', label: '查看'},
              'edit',
              { prop: 'account', label: row.username ? '修改账号' : '开通账号' },
              ...(isManages() ? [{ prop: 'webh', label: '互联网信息' }] : []),
              ...(isManages() ? [{ prop: 'punish', label: '奖惩信息' }] : []),
              // 'del',
              ...this.getOperationDelBtn({row})
            ] : [{ prop: 'edit', label: '查看' }]
          }
        }
      })
      // 隐藏查询条件
      this.querySchema.find(item => item.name === 'orgId').parentClass = 'dni'
    } else {
      this.isConfig = false
    }
    this.queryObj.dataFlag = isWarehouse() ? '1' : '0'
  },
  methods: {
    getOperationDelBtn ({row}) {
      // return this.$hasPermission('auth_button_manages_staff_manages_del') || this.$hasPermission('auth_button_warehouse_staff_manages_del') ? ['del'] : []
      return []
    },
    handleResult (res) {
      return res.data.pageList.map(item => ({
        ...item,
        webHospitalDoctor: item.webHospitalDoctor || '0',
        outpatientDoctor: item.outpatientDoctor || '0',
      }))
    },
    beforeList () {
      if (isManages()) {
        return true
      } else if (isWarehouse()) {
        return this.queryObj.orgId
      }
    },
    list (first = true) {
      this.$refs.table.list(first)
    },
    toPage () {
      this.$router.push({ name: 'org-staff-detail', params: { type: 'create', id: '-1' } })
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    del ({ id }) {
      request(urlMap.staff.delete, { id }).then(res => {
        if (res.head.errCode === 0) {
          this.list()
          this.$messageTips(this, 'success', '删除成功')
        }
      })
    },
    edit ({ id }) {
      this.$router.push({ name: 'org-staff-detail', params: { id, type: 'edit' } })
    },
    viewDetail ({ id }) {
      this.$router.push({ name: 'org-staff-detail', params: { id, type: 'view' } })
    },
    webh ({ id }) {
      this.$router.push({ name: 'org-staff-webh-detail', params: { id } })
    },
    punish ({ id }) {
      this.$router.push({ name: 'org-staff-punish-list', params: { id } })
    },
    // 账号解锁 releaseType=1 全部解锁，=2指定账号解锁
    unlock (row, releaseType = 2) {
      let params = {
        releaseType
      }
      if (releaseType === 2) {
        params.loginName = row.username
      }
      request(urlMap.unify.releaseUserLock, params, 'get').then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '解锁成功')
          this.list()
        }
      })
    },
    dochelp (row) {
      this.dochelpDialog = true
      this.docHelpStaffId = row.id
      this.docHelpStaff = row
    },
    closeHelp () {
      this.dochelpDialog = false
      this.docHelpStaffId = ''
      this.docHelpStaff = ''
    },
    close () {
      this.dialog = false
      this.staffId = ''
    },
    account (row) {
      this.dialog = true
      this.dialogTitle = row.username ? '修改账号' : '开通账号'
      this.staffId = row.id
      this.staff = row
      this.dialogKey = U()
    },
    saved () {
      this.dialog = false
      this.staffId = ''
      this.list(false)
    },
  },
}
</script>
