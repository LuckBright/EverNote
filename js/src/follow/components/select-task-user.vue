<template>
  <div>
    <el-row :gutter="10" style="width: 100%">
      <el-col :span="24">
        <el-radio-group v-model="form.executeTypeId">
          <el-radio :label="2">患者</el-radio>
          <el-radio :label="1">医生</el-radio>
        </el-radio-group>
         <span class="ml10" style="color: #ff4444;" v-if="form.executeTypeId === 1">（选择医生前请先选择医生角色）</span>
      </el-col>
    </el-row>
    <template v-if="form.executeTypeId === 1">
      <el-row :gutter="10" style="width: 100%">
        <el-col :span="8">
          <el-select v-model="selectRole" size="small" filterable clearable placeholder="请选择角色" value-key="roleId" @change="item => changeRole(item)">
            <el-option v-for="(item, i) in roleList" :key="i" :label="item.roleName" :value="item"></el-option>
          </el-select>
          
        </el-col>
        <el-col :span="12" v-if="resourceList">
          <el-select v-model="form.executorId" size="small" filterable clearable style="width:100%" placeholder="请选择医生">
            <el-option v-for="item in resourceList" :key="item.userId" :value="item.userId" :label="item.displayName"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { request } from '@/util/req'
import storage from '@/util/storage'
export default {
  props: ['value'],
  data () {
    return {
      request,
      roleList: [],
      resourceList: [],
      selectRole: '',
      form: {
        orgId: storage.getLocalStorage('CLINICID'),
        executeTypeId: 2,
        executorId: null,
        executorName: ''
      }
    }
  },
  watch: {
    'selectRole': {
      handler (val) {
        this.form.executorId = null
        this.getResourceList(this.form.orgId, val.roleId)
      },
      deep: true
    },
    'value' (val) {
      this.form.executeTypeId = val.executeTypeId
    },
    'form.executeTypeId': {
      handler (val) {
        this.selectRole = ''
        this.form.executorId = null
      },
      deep: true
    },
    'form.executorId': {
      handler (val) {
        if (val) {
          this.resourceList.filter(item => {
            if (val === item.userId) this.form.executorName = item.displayName
          })
        } else {
          this.form.executorName = ''
        }
      },
      deep: true
    },
    'form': {
      handler (val) {
        this.$emit('update:value', Object.assign({}, val))
      },
      deep: true
    }
  },
  created () {
    this.getRoleList()
    if (this.value) {
      this.form.executeTypeId = this.value.executeTypeId
    }
  },
  methods: {
    changeRole (item) {
      this.selectDoctor = ''
    },
    getRoleList () {
      this.request('/thc-platform-core/sys/role/getRoleInfos/').then(rs => {
        this.roleList = rs.data
      })
    },
    getResourceList (orgId, roleId, index) {
      this.request('/thc-platform-core/unify/getUserInfosByRoleIds/', [{roleId, orgId}]).then(rs => {
        this.resourceList = rs.data
      })
    },
    reset () {
      this.form = {
        orgId: storage.getLocalStorage('CLINICID'),
        executeTypeId: 1,
        executorId: null,
        executorName: ''
      }
    }
  }
}
</script>
