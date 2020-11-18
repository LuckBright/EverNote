<template>
  <el-dialog
    :title="'快速接诊'"
    :visible.sync="dialogVisible"
    class="rapid"
    width="395px"
    height="375px"
    :before-close="closeEvent"
    :show-close="false"
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      ref="rapid"
      :label-width="'71px'"
    >
      <div slot="default"></div>
      <template slot="deptId">
        <el-select v-model="obj.deptId" filterable placeholder="请选择">
          <el-option
            v-for="item in dptOptions"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </template>
      <template slot="resourceId">
        <el-select v-model="obj.resourceId" filterable placeholder="请选择">
          <el-option
            v-for="item in doctorOptions"
            :key="item.resourceId"
            :label="item.resourceName"
            :value="item.resourceId"
          ></el-option>
        </el-select>
      </template>
      <template slot="serviceId">
        <el-select v-model="obj.serviceId" placeholder="请选择">
          <el-option
            v-for="item in serviceOptions"
            :key="item.serviceId"
            :label="item.serviceName"
            :value="item.serviceId"
          ></el-option>
        </el-select>
      </template>
    </ever-form2>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save" :disabled="disabled">到诊</el-button>
      <el-button plain @click="closeEvent">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/sob/store/service.panel'
let schema = [
  {
    name: 'patientId',
    comp: 'everPatientSelect',
    label: '患者姓名:',
    filterable: true,
    props: {
      width: '280px'
    }
  },
  {
    name: 'deptId',
    comp: 'custom',
    label: '接诊科室:'
  },
  {
    name: 'resourceId',
    comp: 'custom',
    label: '接诊医生:'
  },
  {
    name: 'serviceId',
    comp: 'custom',
    label: '接诊服务:'
  }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    triggerType: {
      type: String,
      default: 'asst'
    }
  },
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.deptId = ''
    obj.deptName = ''
    obj.resourceId = ''
    return {
      obj,
      api,
      schema,
      dptOptions: [],
      doctorOptions: [],
      serviceOptions: [],
      dialogVisible: false,
      disabled: false,
      isPush: false,
      rules: {
        patientId: [
          { required: true, message: '请输入患者姓名', trigger: 'change' },
          { min: 2, max: 32, message: '长度为2-32位字符', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择接诊科室', trigger: 'change' }
        ],
        resourceId: [
          { required: true, message: '请选择接诊医生', trigger: 'change' }
        ],
        serviceId: [
          { required: true, message: '请选择接诊服务', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        this.dialogVisible = val
      },
      deep: true
    },
    'obj.deptId': {
      handler: function (val) {
        if (val) {
          this.obj.resourceId = ''
          this.obj.serviceId = ''
          this.getDoctors()
        }
      },
      deep: true
    },
    'obj.resourceId': {
      handler: function (val) {
        if (val) {
          this.obj.serviceId = ''
          this.getService()
        }
      }
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.disabled = false
      this.getDpt()
      this.$nextTick(() => {
        this.reset()
      })
    },
    closeEvent () {
      this.dialogVisible = false
    },
    reset () {
      this.$refs.rapid.$refs.form.resetFields()
    },
    save () {
      const res = api.quickArrival
      this.dptOptions.map(item => {
        if (item.deptId === this.obj.deptId) {
          this.obj.deptName = item.deptName
        }
      })
      this.$refs.rapid.$refs.form.validate(valid => {
        valid && res(this.obj).then(rs => {
          this.disabled = true
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '创建到诊任务成功')
            this.dialogVisible = false
            this.$emit('update')
            this.disabled = false
          } else {
            this.disabled = false
          }
        })
      })
    },
    getCategorydetail (id) {
      api.getCategorydetail({ 'id': id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.id = rs.data.id
          this.obj.name = rs.data.name
        }
      })
    },
    getDpt () {
      api.getArrival({
        scene: this.triggerType
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.dptOptions = rs.data
        }
      })
    },
    getDoctors () {
      let userId = this.$store.state.currentUser.userId
      api.getDoctors({
        'deptId': this.obj.deptId,
        'scene': this.triggerType
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.doctorOptions = rs.data
          rs.data.map(item => {
            if (item.resourceId === userId) {
              this.obj.resourceId = item.resourceId
              this.isPush = true
            }
          })
        }
      })
    },
    getService () {
      api.getService({
        deptId: this.obj.deptId,
        resourceId: this.obj.resourceId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.serviceOptions = rs.data
          if (this.isPush) {
            this.obj.serviceId = rs.data && rs.data[0].serviceId
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.rapid /deep/ .el-dialog__header {
  padding-top: 20px;
  padding-left: 20px;
}
.rapid /deep/ .el-dialog__body {
  padding-left: 20px;
}
.rapid /deep/ .el-select {
  width: 280px;
}
.rapid /deep/ .el-input__inner {
  background: #fef5be;
}
</style>
