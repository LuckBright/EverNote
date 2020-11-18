<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        @query="list(true)">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <ever-export-sql :exp-url="expUrl" :select-arr="selectArr" file-prefix="角色"></ever-export-sql>
            <el-button
              @click="$router.push({ name: 'roleAdd', params: { id: '-1' }})"
              type="primary"
            >新建</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      row-key="id"
      show-checkbox
      :not-select-checkbox="true"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :maxBtnCount="6"
      @eventChange="eventChange"
      @selection-change="handleSelectionChange">
    </ever-table>
    <el-dialog
      :title="roleNameStr"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="ui_dialog_02">
      <div style="height:300px;overflow-y:auto;padding:5px 15px;line-height:25px">
        <div class="addUser">
          <ever-form2
            v-model="obj"
            ref="form"
            :schema="schema"
            :inline="true"
            :is-query="true"
            @query="list(true)">
            <template slot="keyword">
              <el-autocomplete
                v-model="obj.selectUserName"
                :fetch-suggestions="querySearch"
                clearable
                placeholder="请输入用户名"
                @select="handleSelect"
                @clear="handleClear">
                <template slot-scope="{ item }">
                  <span class="name">{{ item.displayName }}</span>
                  <span class="addr">{{ item.telephoneNumber }}</span>
                </template>
              </el-autocomplete>
            </template>
            <template slot="default">
              <el-form-item>
                <el-button type="primary" @click="giveRoleUsers()" :disabled="addUserForRoleFlag">添加用户</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </div>
        <el-table :data="userArr" :border="false" :stripe="false">
          <el-table-column prop="displayName" label="用户名"></el-table-column>
          <el-table-column prop="telephoneNumber" label="电话"></el-table-column>
          <el-table-column prop="telephoneNumber" label="操作">
            <template slot-scope="scope">
              <ever-confirm
                :msg="'确定移除 '+scope.row.displayName+' ？'"
                action="移除用户"
                @confirm="removeUser(scope.row)"
              ></ever-confirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>
    <authreport :visible.sync="showReport" :role="role" v-if="showReport"></authreport>
  </div>
</template>

<script>
import api from '@/auth/store/roleapi'
import storage from '@/util/storage'
import urlMap, { prefix } from '@/systemset/urls'
import authreport from '@/auth/page/authreport'
var querySchema = [
  {
    name: 'roleName',
    label: '角色名称',
    placeholder: '输入角色名称'
  }
]

var schema = [
  {
    name: 'keyword',
    comp: 'custom',
    label: '添加用户',
    placeholder: '输入用户名'
  }
]

export default {
  components: {
    authreport
  },
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      showReport: false,
      role: {},
      querySchema,
      queryObj,
      schema,
      obj,
      dialogVisible: false,
      userArr: [],
      roleNameStr: '',
      selectUser: {},
      roleId: '',
      currentRole: {},
      addUserForRoleFlag: true,
      expUrl: prefix.core + urlMap.sys.exportRole.url,
      selectArr: [],
      url: urlMap.sys.getRoleInfos,
      allColumns: [
        {
          prop: 'name',
          label: '名称',
        },
        {
          prop: 'isValid',
          label: '状态',
          formatter: ({ value }) => {
            return value ? '已禁用' : '正常'
          }
        },
        {
          prop: 'type',
          label: '角色类型',
          customCellSpanClassFormatter ({ value }) {
            return value === 1 ? 'cRed' : ''
          },
          formatter: ({ value }) => {
            if (value === 1) {
              return '系统角色'
            } else if (value === 2) {
              return '用户角色'
            }
          },
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '权限',
          width: '280',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'goAuthRow',
                label: '行权限',
              },
              {
                prop: 'goAuthCol',
                label: '列权限',
              },
              {
                prop: 'goAuthRep',
                label: '报表权限',
              },
            ]
            return baseBtns
          }
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '350',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'showAllUser',
                label: '查看人员',
              },
              {
                prop: 'editRole',
                label: '编辑',
              },
              {
                prop: 'copyRole',
                label: '复制',
              },
              'del'
            ]
            if (row.type === 2) {
              baseBtns.length = 4
            } else {
              baseBtns.length = 2
            }
            return baseBtns
          }
        },
      ]
    }
  },
  beforeCreate () {
    this.api = api
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    eventChange ({ prop, row, col }) {
      this[prop] && this[prop](row)
    },
    goAuthRep (row) {
      this.role = row
      this.showReport = true
    },
    // 设置数据列权限
    goAuthRow (row) {
      this.$router.push({
        name: 'roleDataaccess',
        params: {
          id: row.roleId,
          type: '1'
        }
      })
    },
    // 设置数据行权限
    goAuthCol (row) {
      this.$router.push({
        name: 'roleDataaccess',
        params: {
          id: row.roleId,
          type: '2'
        }
      })
    },
    handleSelectionChange (items) {
      if (items.length !== 0) {
        items.forEach(element => {
          this.selectArr.push(element.roleId)
        })
      } else {
        this.selectArr = []
      }
    },
    // 修改角色
    editRole (row) {
      this.$router.push({
        name: 'roleAdd', params: { id: row.roleId }
      })
    },
    // 复制角色
    copyRole (row) {
      this.$router.push({
        name: 'roleAdd', params: { id: row.roleId, num: 2 }
      })
    },
    // 清空输入框，取消选择用户
    handleClear (item) {
      this.addUserForRoleFlag = true
    },
    // 搜索列表选中人
    handleSelect (item) {
      this.selectUser = item
      this.obj.selectUserName = item.displayName
      this.addUserForRoleFlag = false
    },
    async querySearch (queryString, cb) {
      let res = await api.getUserInfoByNameOrPhone({
        nameInfo: queryString
      }).catch(() => {
        cb([])
      })
      let arr = []
      if (res.head.errCode === 0) {
        arr = res.data
      }
      // 调用 callback 返回建议列表的数据
      cb(arr)
    },
    // 把人挂到角色上面
    giveRoleUsers (row) {
      let params = {
        roleId: this.currentRole.roleId,
        userIds: [this.selectUser.userId]
      }
      api.giveRoleUsers(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '添加成功')
          this.showAllUser(this.currentRole)
        }
      })
    },
    // 角色下面删除一个人
    removeUser (row) {
      let params = {
        roleId: this.currentRole.roleId,
        userIds: [row.userId]
      }
      api.deleteUserRole(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.showAllUser(this.currentRole)
        }
      })
    },
    del (row) {
      api.del(row.roleId).then(result => {
        if (result.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.list({ type: 2 })
        }
      })
    },
    handleClose () {
      this.dialogVisible = false
      this.userArr = []
    },
    showAllUser (row) {
      this.currentRole = row
      this.userArr = []
      this.dialogVisible = true
      this.roleNameStr = '角色【' + row.name + '】详情'
      this.roleId = row.id
      api.listAllUser([{
        roleId: row.roleId,
        orgId: storage.getStorageByClinic('CLINICID') || ''
      }]).then(rs => {
        if (rs.head.errCode === 0) {
          this.userArr = rs.data
        }
      })
    },
  }
}
</script>
