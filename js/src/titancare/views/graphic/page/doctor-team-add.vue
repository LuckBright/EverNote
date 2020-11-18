<template>
  <el-dialog
    title="医生团队设置"
    :visible.sync="dialogVisible"
    width="600px">
    <el-form :model="form" ref="form" label-position="right" label-width="120px">
      <el-form-item prop="name" label="专家团队名称：" :rules="rules.name">
        <el-input size="small" v-model="form.name" :minlength="2" :maxlength="10" placeholder="请填写团队名称"></el-input>
      </el-form-item>
      <el-form-item prop="mark" label="专家团队介绍：" :rules="rules.content">
        <el-input type="textarea" v-model="form.mark" :minlength="2" :maxlength="150" placeholder="请填写团队介绍"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="serviceId" label="收费项：" :rules="rules.required">
        <el-select v-model="form.serviceId" size="small" style="width:100%">
          <el-option v-for="(item, i) in adviceList" :key="i" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="医生团队：" :rules="rules.doctor">
        <el-select v-model="selectDoctor" multiple filterable size="small" value-key="id" style="width:100%">
          <el-option v-for="(item, i) in doctorList" :key="i" :value="item" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" v-if="selectDoctor[0]">
        <el-table border :data="selectDoctor" style="width:100%">
          <el-table-column label="医生" width="100" prop="name"></el-table-column>
          <el-table-column label="人员类型" width="100" prop="typeName"></el-table-column>
          <el-table-column label="职称" width="80" prop="skillsTitle2Name"></el-table-column>
          <el-table-column label="执业机构" prop="orgName"></el-table-column>
          <el-table-column label="执业科室" width="120" prop="deptName"></el-table-column>
          <el-table-column label="聊天" width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isIm" size="mini" :active-value="1" :inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="团队带头人" width="120">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isLeader" :active-value="1" :inactive-value="0" size="mini" @change="setIsLeader(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" plain @click="delDoctorItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveTeam">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/titancare/api/team/teamapi'
export default {
  props: ['isShow', 'teamId'],
  data () {
    return {
      api,
      dialogVisible: false,
      selectDoctor: [],
      adviceList: [],
      doctorList: [],
      form: {
        name: '',
        mark: '',
        members: []
      },
      rules: {
        optional: [
          { required: false }
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        name: [
          { required: true, message: '必填项', trigger: ['change'] },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        content: [
          { required: false },
          { min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'blur' }
        ],
        doctor: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
      }
    }
  },
  watch: {
    'isShow' (val) {
      this.dialogVisible = val
      if (val) {
        this.selectDoctor = []
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        this.getServiceList()
        this.getDoctorList()
        if (this.teamId) {
          this.getTeamById()
        }
      }
    },
    'dialogVisible' (val) {
      this.$emit('update:isShow', val)
    },
    'selectDoctor': {
      handler (val) {
        this.form.members = val.map((item, i) => {
          return {
            memberId: item.id,
            memberName: item.name,
            isIm: item.isIm,
            isLeader: item.isLeader
          }
        })
      },
      deep: true
    },
    'teamId' (val) {
      if (val) {
        this.getTeamById()
      } else {
        this.resetForm()
      }
    }
  },
  methods: {
    getServiceList () {
      this.api.getServiceList({ id: this.teamId }).then(rs => {
        this.adviceList = rs.data
      })
    },
    getDoctorList () {
      this.api.getDoctorList().then(rs => {
        this.doctorList = rs.data.map((item, i) => {
          item.isIm = 0
          item.isLeader = 0
          return item
        })
      })
    },
    delDoctorItem (val) {
      this.selectDoctor.splice(this.selectDoctor.findIndex(item => item.id === val.id), 1)
    },
    setIsLeader (val) {
      this.selectDoctor.map(item => {
        if (item.id !== val.id) {
          item.isLeader = 0
        }
      })
    },
    saveTeam () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        let request = this.form.id ? this.api.update : this.api.create
        request(this.form).then(rs => {
          if (rs.data.errCode) {
            return false
          }
          this.$notify({ type: 'success', message: '保存成功' })
          this.dialogVisible = false
          this.$emit('success', true)
        })
      })
    },
    getTeamById () {
      this.api.getById({ id: this.teamId }).then(rs => {
        this.form = rs.data
        this.selectDoctor = rs.data.members.map(item => {
          item.id = item.memberId
          item.name = item.memberName
          return item
        })
      })
    },
    resetForm () {
      this.form = {
        name: '',
        mark: '',
        members: []
      }
      this.selectDoctor = []
    }
  }
}
</script>
