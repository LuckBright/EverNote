<template>
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
              <span class="name">{{ item.name }}</span>
              <span class="addr">{{ item.mobile }}</span>
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
      <el-table-column prop="assistantStaffName" label="用户名"></el-table-column>
      <el-table-column prop="assistantVideoPermissionStatus" label="聊天权限">
        <template slot-scope="scope">
          <el-switch
            @change="(val) => { changeVideoPower(scope.row, val) }"
            :value="scope.row.assistantVideoPermissionStatus === 'Y' ? true : false"
            active-text="开"
            inactive-text="关">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="telephoneNumber" label="操作">
        <template slot-scope="scope">
          <ever-confirm
            :msg="'确定移除 ？'"
            action="移除用户"
            @confirm="removeUser(scope.row)"
          ></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import api from '@/auth/store/roleapi'
import storage from '@/util/storage'
import {request} from '@/util/req'

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
  props: ['currentUser'],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      selectUser: {},
      userArr: [],
      addUserForRoleFlag: true,
      querySchema,
      queryObj,
      schema,
      obj,
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 清空输入框，取消选择用户
    handleClear (item) {
      this.addUserForRoleFlag = true
    },
    handleSelect (item) {
      this.selectUser = item
      this.obj.selectUserName = item.name
      this.addUserForRoleFlag = false
    },
    async querySearch (queryString, cb) {
      let res = await request({ url: '/thc-platform-core/tsStaff/loadStaffListByOrgId/', isStatic: false },
        {
          'name': queryString,
          'orgId': storage.getStorageByClinic('CLINICID'),
          'dataFlag': '0',
          'orgManageStaffPermission': '1',
          'currentPage': 1,
          'page': 1,
          'pagesize': 1000,
          'offset': 0
        }).catch(() => {
          cb([])
        })
      let arr = []
      if (res.head.errCode === 0) {
        arr = res.data.pageList
      }
      // 调用 callback 返回建议列表的数据
      cb(arr)
    },
    list () {
      this.$refs.table.list(true)
    },
    changeVideoPower (item, assistantVideoPermissionStatus) {
      let params = {
        id: item.id,
        assistantStaffId: item.assistantStaffId,
        assistantVideoPermissionStatus: assistantVideoPermissionStatus ? 'Y' : 'N',
        staffId: this.currentUser.id,
        staffOrgId: this.currentUser.orgId
      }
      request({ url: '/thc-platform-core/tsStaffAssistant/update', isStatic: false }, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '更新成功')
          this.getList()
        }
      })
    },
    // 把人挂到角色上面
    giveRoleUsers (row) {
      console.log('this.selectUser---', this.selectUser)
      let isRepeat = this.userArr.find((item, index) => {
        return item.assistantStaffId === this.selectUser.id
      })
      if (isRepeat) {
        this.$messageTips(this, 'warning', '该用户已经存在')
        return
      }
      let params = {
        assistantStaffId: this.selectUser.id,
        assistantVideoPermissionStatus: 'N',
        staffId: this.currentUser.id,
        staffOrgId: this.currentUser.orgId
      }
      request({ url: '/thc-platform-core/tsStaffAssistant/insert', isStatic: false }, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '添加成功')
          this.getList()
        }
      })
    },
    getList () {
      request({ url: '/thc-platform-core/tsStaffAssistant/loadByStaffId', isStatic: false }, {staffId: this.currentUser.id}).then(res => {
        if (res.head.errCode === 0) {
          this.userArr = res.data
        }
      })
    },
    // 角色下面删除一个人
    removeUser (row) {
      let params = {
        id: row.id,
      }
      request({ url: '/thc-platform-core/tsStaffAssistant/delete', isStatic: false }, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.getList()
        }
      })
    },
    showAllUser (row) {
      this.currentRole = row
      this.userArr = []
      this.dialogVisible = true
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

