<template>
  <div class="layout_inner flex_column_full_hidden">
    <div class="main-head">
      <el-row>
        <el-col :span="24">
          <ever-form2
            v-model="queryObj"
            ref="form"
            :schema="querySchema"
            :inline="true"
            :is-query="true"
          >
            <template slot="default">
              <el-form-item class="fr">
                <!--                <el-checkbox v-model="isAutoSave">改变权限之后自动保存</el-checkbox>-->
                <span v-if="changedList.length" class="danger">权限已更改 {{changedList.length}} 条，请点击按钮进行保存</span>
                <el-button :disabled="isConfig" class="ml10" type="primary" @click="saveAuth" title="若对权限进行了更改，请点击该按钮保存，否则不生效">保存权限更改
                </el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" class="flex-row">
      <el-col :span="10">
        <!--         人员列表-->
        <ever-table
          :table-class="hasData ? '' : 'org-staff-auth'"
          ref="table"
          :url="url"
          :params.sync="queryObj"
          table-height-strategy="2"
          :columns="columns"
          is-auto-height
          :fixed-height="hasData ? 6 : -10"
          is-single-table
          :row-class-name="rowClassName"
          :before-list="beforeList"
          @row-click="rowClick"
          @eventChange="eventChange"
          @afterSearch="afterSearch"
        ></ever-table>
      </el-col>
      <el-col :span="14">
        <!--        机构树-->
        <tree-table v-show="hasData" :tree-props="treeProps" :header-columns="orgHeaderColumns" :content-class="contentClass">
          <template slot-scope="{node, data}">
            <div>{{node.label}}</div>
            <div class="content-col-manage">
              <el-checkbox :disabled="isConfig" :value="data.manage" @change="doCheck(data, $event, 'manage', true)"></el-checkbox>
            </div>
            <div class="content-col-use">
              <el-checkbox :disabled="isConfig" :value="data.use" @change="doCheck(data, $event, 'use', false)"></el-checkbox>
            </div>
            <div class="content-col-auth">
              <el-button :disabled="isConfig" v-if="data.accountOpened && data.roleList.length === 0" type="text" @click="authorize(data)">授权</el-button>
              <el-tooltip v-else-if="data.accountOpened && data.roleList.length" class="item" effect="dark" :content="getRoleContent(data)" placement="bottom-end">
                <el-button :disabled="isConfig" type="text" @click="authorize(data)">{{'已授权（' + data.roleList.length + '）'}}</el-button>
              </el-tooltip>
              <span v-else>账号未开通</span>
            </div>
          </template>
          <template slot="manage">
            <el-checkbox :disabled="isConfig" v-model="allRelation" :indeterminate="relationIndeterminate"
                         @change="checkAll('manage', true)"></el-checkbox>
            <span class="ml10">管理权</span>
          </template>
          <template slot="use">
            <el-checkbox :disabled="isConfig" v-model="allIndependent" :indeterminate="independentIndeterminate"
                         @change="checkAll('use', false)"></el-checkbox>
            <span class="ml10">使用权</span>
          </template>
        </tree-table>
      </el-col>
    </el-row>
    <user-authorize
      :user-obj="dialogUser"
      :key="dialogKey"
      :visible.sync="dialogVisible"
      hide-user-info
      @success="afterSaveDialogAuth"
    ></user-authorize>
  </div>
</template>
<script>
  import TreeTable from '@/manages/page/organization/components/tree-table'
  import { request } from '@/util/req'
  import storage from '@/util/storage'
  import urlMap from '@/manages/page/organization/utils/urls'
  import configUrlMap from '@/manages/page/configure/urls'
  import authTree from '@/manages/page/organization/views/subject/authtree'
  import { convertListToTree, changeToTreeList, isManages, isWarehouse } from '@/manages/page/organization/utils/fns'
  import userAuthorize from '@/auth/components/userauthorize'
  import '@/manages/page/organization/assets/less/index.less'
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

  const querySchema = [
    {
      name: 'name',
      label: '姓名',
    },
  ]
  export default {
    components: { TreeTable, userAuthorize },
    mixins: [ authTree ],
    data () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.orgId = ''
      queryObj.dataFlag = ''
      queryObj.orgManageStaffPermission = '1'
      return {
        querySchema,
        queryObj,
        url: urlMap.staff.loadStaffListByOrgId,
        columns: [
          {
            prop: 'name',
            label: '姓名',
          },
          {
            prop: 'jobNumber',
            label: '工号',
          },
          {
            prop: 'username',
            label: '登录账号',
            width: 115,
            formatter ({ value }) {
              return value || '未开通'
            },
          },
          {
            prop: 'genderName',
            label: '性别',
          },
          {
            prop: 'typeName',
            label: '类型',
          },
          {
            prop: 'statusName',
            label: '状态',
          },
          {
            prop: 'op',
            label: '操作',
            type: 'btns',
            btns: [ { prop: 'view', label: '编辑' } ],
          }
        ],
        tenantId: null,
        orgId: null,
        // isAutoSave: false,
        treeProps: {
          props: {
            data: [],
            defaultExpandAll: true,
            draggable: true,
            expandOnClickNode: false,
          },
        },
        orgHeaderColumns: [
          {
            label: '机构名称',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'manage',
          },
          {
            width: '80px', // 调整宽度时需要将css中对应的宽度调整一下
            slot: 'use',
          },
          {
            width: '100px',
            label: '权限管理',
          },
        ],
        contentClass: 'staff-org-content',
        originOrgList: [],
        crtStaff: null,
        originList: null,
        hasData: false,
        dialogUser: null,
        dialogVisible: false,
        dialogKey: U(),
        isConfig: false,
      }
    },
    created () {
      this.tenantId = storage.getLocalStorage('TENANTID')
      this.orgId = this.$route.params.orgId || '-1'
      if (isManages()) {
        if (this.orgId === '-1') {
          this.orgId = this.tenantId
        }
      } else if (isWarehouse()) {
        if (this.orgId === '-1') {
          this.orgId = storage.getStorageByClinic('CLINICID')
        }
        request(configUrlMap.list).then(res => {
          // 参照 @/util/warehouseconfig
          this.isConfig = (res.data.find(item => item.type === 103) || {}).isConfig === 1
          if (this.isConfig) {
            this.columns.find(item => item.prop === 'op').btns = [{ prop: 'view', label: '查看' }]
          } else {
            this.columns.find(item => item.prop === 'op').btns = ({ row }) => {
              return row.orgId === storage.getStorageByClinic('CLINICID') ? [
                { prop: 'view', label: '编辑' },
              ] : [{ prop: 'view', label: '查看' }]
            }
          }
        })
      }
      this.queryObj.dataFlag = isWarehouse() ? '1' : '0'
      this.queryObj.orgId = this.orgId
    },
    methods: {
      afterSearch ({ result }) {
        this.hasData = result.length
        if (this.hasData) {
          // 判断当前查询条件中 _s 的值是否存在，是否在result中存在，
          const rs = result.find(item => item.id === this.$route.query._s)
          if (rs && this.$route.query._s) {
            this.crtStaff = rs
          } else {
            this.crtStaff = result[0]
          }
        }
        if (this.crtStaff && this.crtStaff.id) {
          this.searchOrg()
        }
        // if (!this.crtStaff) {
        //   // 查询当前登录人拥有权限的所有机构
        //   this.crtStaff = result[0]
        // }
        // if (this.crtStaff && this.crtStaff.id) {
        //   this.searchOrg()
        // }
      },
      beforeList () {
        return this.queryObj.orgId
      },
      list (first = true) {
        this.$refs.table.list(first)
      },
      changeUrlQuery (id) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            _s: id,
          }
        })
      },
      rowClick ({ row }) {
        if (this.changedList.length) {
          this.$messageTips(this, 'success', '切换时未保存，已取消选中的修改')
        }
        this.changeUrlQuery(row.id)
        this.changedList = []
        this.crtStaff = row
        this.searchOrg()
      },
      eventChange ({ prop, row }) {
        this[prop] && this[prop](row)
      },
      view ({ id }) {
        this.changeUrlQuery(id)
        this.$router.push({ name: 'org-staff-detail', params: { id, type: 'edit', from: '2' } })
      },
      async getOrgList () {
        if (!this.originList) {
          const res = await request(urlMap.org.loadWithChildsById, { id: this.orgId })
          this.originList = res.data.pageList
        }
      },
      async searchOrg () {
        const userRes = await request(urlMap.unify.getUserDetails, {userId: this.crtStaff.id})
        // 查询机构数据 （不会根据人的变化而变化）
        await this.getOrgList()
        const userRoleList = await request(urlMap.role.loadByStaffId, { staffId: this.crtStaff.id })
        const permissionList = await request(urlMap.tsOrganizationStaffPermission.loadByStaffId, { staffId: this.crtStaff.id })
        const list = this.originList.map(item => {
          const permissionObj = {
            manage: false,
            use: false,
            roleList: userRoleList.data.pageList.filter(role => role.orgId === item.id),
            accountOpened: !!userRes.data
          }
          const permission = permissionList.data.pageList.find(p => p.orgId === item.id)
          let changedPermission = null
          if (this.changedList && this.changedList.length) {
            changedPermission = this.changedList.find(p => p.orgId === item.id)
          }
          if (permission) {
            if (permission.orgManageStaffPermission === '1') {
              permissionObj.manage = true
            }
            if (permission.staffLoginOrgPermission === '1') {
              permissionObj.use = true
            }
          }
          if (changedPermission) {
            permissionObj.manage = changedPermission.orgManageStaffPermission === '1'
            permissionObj.use = changedPermission.staffLoginOrgPermission === '1'
          }
          return { ...item, ...permissionObj }
        })
        this.originOrgList = JSON.parse(JSON.stringify(list))
        this.originTreeList = changeToTreeList(list)
        // todo 给all checkbox 赋值
        this.allRelation = this.originTreeList.every(item => !!item.manage)
        const allUn = this.originTreeList.every(item => !item.manage)
        this.relationIndeterminate = !this.allRelation && !allUn
        this.allIndependent = this.originTreeList.every(item => !!item.use)
        const allUnIndependent = this.originTreeList.every(item => !item.use)
        this.independentIndeterminate = !this.allIndependent && !allUnIndependent
        this.treeProps.props.data = convertListToTree(this.originTreeList)
      },
      saveAuth () {
        if (this.changedList && this.changedList.length) {
          request(urlMap.tsOrganizationStaffPermission.insertList, {
            tsOrganizationStaffPermissionDTOList: this.changedList,
          }).then(res => {
            if (res.head.errCode === 0) {
              // 重置改变过的项
              this.changedList = []
              // 重新查询数据
              this.list()
              this.$messageTips(this, 'success', '权限已经更改成功')
            }
          })
        } else {
          this.$messageTips(this, 'error', '请改变权限之后再点击此按钮')
        }
      },
      getChangedList () {
        this.changedList = []
        for (let i = 0; i < this.originTreeList.length; i++) {
          const newItem = this.originTreeList[i]
          const oldItem = this.originOrgList[i]
          if (newItem.manage !== oldItem.manage || newItem.use !== oldItem.use) {
            this.changedList.push({
              orgId: newItem._id,
              staffId: this.crtStaff.id,
              orgManageStaffPermission: newItem.manage ? '1' : '0',
              staffLoginOrgPermission: newItem.use ? '1' : '0',
            })
          }
        }
      },
      afterCheck () {
        // if (this.changedList && this.changedList.length) {
        //   if (this.isAutoSave) {
        //     this.saveAuth()
        //   } else {
        //     this.$messageTips(this, 'success', '请点击保存按钮使更改生效')
        //   }
        // }
      },
      rowClassName ({ row }) {
        if (this.crtStaff && row.id === this.crtStaff.id) {
          return 'current-row'
        } else {
          return ''
        }
      },
      // 授权
      authorize (data) {
        this.dialogVisible = true
        this.dialogUser = {
          userId: this.crtStaff.id,
          organizationId: data._id,
        }
        // this.dialogKey = U()
      },
      afterSaveDialogAuth () {
        this.list(false)
      },
      getRoleContent (data) {
        if (data.roleList && data.roleList.length) {
          return data.roleList.map(item => {
            return item.roleName
          }).join('，')
        } else {
          return ''
        }
      }
    },
  }
</script>
