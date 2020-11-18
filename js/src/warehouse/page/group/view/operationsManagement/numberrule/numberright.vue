<template>
  <div class="right">
    <div class="head" v-show="newcreate">{{!chakan?'查看':'修改'}}号别</div>
    <div class="head" v-show="!newcreate">新建号别</div>
    <div v-show="firstcom" class="please">请从左侧选择规则，以查看详情或修改。</div>
    <el-form
      v-show="!firstcom"
      id="workform"
      :rules="rules"
      label-width="80px"
      label-position="right"
      :model="form"
      ref="timeTrunkform"
    >
      <el-row>
        <el-form-item label></el-form-item>
      </el-row>
      <el-row v-show="chakan">
        <el-col :span="24">
          <el-form-item label>
            <el-button type="primary" @click="submitEvent" :disabled="isDisabled">保存</el-button>
            <el-button type="primary" plain @click="cancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="!chakan">
          <el-form-item label>
            <el-button type="primary" plain @click="canEdit">修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="启用">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="2"
              :disabled="edit"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="w350" label="科室" prop="deptId">
        <el-select v-model="form.deptId" style="width:100%" :disabled="edit">
          <el-option v-for="item in deptList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-form-item class="w350" label="看诊医生">
          <el-select v-model="form.resourceId" clearable style="width:100%" :disabled="edit" filterable>
            <el-option :value="tong" label="科室通用"></el-option>
            <el-option
              v-for="item in arrangeResource"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="看诊服务" class="w350" prop="serviceId">
          <el-select
            v-model="form.serviceId"
            multiple
            value-key="id"
            style="width:100%"
            :disabled="edit"
          >
            <el-option v-for="item in serviceList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="看诊规则">
            <el-row>
              <el-col :span="4">
                <el-select v-model="form.serviceFrequency.type" style="width:100%;" :disabled="edit">
                  <el-option label="按频次" :value="1"></el-option>
                  <el-option label="按数量" :value="2" disabled></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" class="center">全天</el-col>
              <el-col :span="4">
                <el-form-item prop="amount">
                  <el-input
                    style="width:100%"
                    v-model="form.amount"
                    placeholder="分钟"
                    :disabled="edit"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="center">分钟/人</el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import api from '@/arrange/store/settingapi'
import arrangeapi from '@/arrange/store/schedulingapi'
import arrange from '@/warehouse/page/group/store/arrange.js'
import storage from '@/util/storage'
export default {
  props: ['onfirst', 'onchoose', 'choosewhatparams', 'currentStatus'],
  watch: {
    'onfirst' (v) {
      this.getdpt()
      this.firstcom = false
      this.edit = false
      this.chakan = true
      this.newcreate = false
      this.clear++
      this.getResourceService()
      this.resetForm(false)
    },
    'onchoose' (v) {
      if (v) {
        this.resetForm(true)
        this.newcreate = true
        this.firstcom = false
        this.chakan = false
        this.edit = true
        this.cleardoctorbol = false
        this.getResourceService()
        this.getById(v)
      }
    },
    'choosewhatparams': {
      handler (newVal, oldVal) {
        this.choosewhat = newVal
      },
      deep: true
    },
    'form.deptId': {
      handler (v) {
        if (v) {
          this.deptList.filter(item => {
            if (item.id === v) this.form.deptName = item.name
          })
          if (!this.edit) this.form.resourceId = ''
          this.searchChilds()
          this.getResourceService()
        }
      },
      deep: true
    },
    'form.resourceId': {
      handler (val) {
        this.arrangeResource.map(item => {
          if (item.id === val) {
            this.form.resourceName = item.name
          }
        })
      },
      deep: true
    },
    'form.serviceId': {
      handler (val) {
        if (val) {
          this.form.serviceRules = []
          this.serviceList.map(item => {
            val.map((el, index) => {
              let obj = {
                serviceId: '',
                serviceName: ''
              }
              if (item.id === el) {
                obj['serviceId'] = item.id
                obj['serviceName'] = item.name
                this.form.serviceRules.push(obj)
              }
            })
          })
        }
      },
      deep: true
    },
    'form.amount': {
      handler (val) {
        if (val) {
          this.form.serviceFrequency.amount = val || null
          this.form.volume = 1
        }
      },
      deep: true
    }
  },
  data () {
    return {
      api,
      storage,
      arrange,
      arrangeapi,
      isDisabled: false,
      initprovinceCode: [new Date().getTime()],
      newcreate: true,
      tong: -1,
      deptList: [],
      clear: 0,
      arrangeResource: [],
      serviceList: [],
      ids: [],
      firstcom: true,
      chakan: false,
      edit: true,
      cleardoctorbol: false,
      choosewhat: '',
      detaillist: '',
      submittime: '',
      form: {
        id: '',
        status: 1,
        currentStatus: null,
        categoryCode: 'OUTPATIENT_DOCTOR', // 1门诊、2检查、3手术
        deptId: '',
        deptName: '',
        resourceId: -1,
        name: '',
        serviceId: [],
        serviceFrequency: {
          type: '',
          amount: null,
          volume: 1
        },
        serviceRules: [],
        amount: ''
      },
      rules: {
        deptId: [{ required: true, message: '必填项', trigger: ['blur'] }],
        serviceId: [{ required: true, message: '必填项', trigger: ['blur'] }],
        amount: [
          { required: true, message: '必填项', trigger: 'blur' },
          { max: 1440, pattern: /^[1-9][0-9]{0,3}$/, message: '请输入正确的看诊规则' }
        ],
        volume: [{ required: true, message: '必填项', trigger: ['blur'] }]
      }
    }
  },
  async created () {
    await this.getdpt()
  },
  methods: {
    getdpt () {
      let params = {
        type1CodeList: ['01'],
        type2CodeList: ['01.02'],
        // webHospitalDoctor: '0',
      }
      this.arrange.getTenantSubjectListByCondition(params).then(rs => {
        if (rs.head.errCode === 0 && rs.data.resultList) {
          this.deptList = rs.data.resultList.map(item => {
            return {
              id: item.tenantSubjectCode,
              name: item.tenantSubjectName
            }
          })
        }
      })
    },
    getById (val) {
      this.api.getById(
        {
          'deptId': val.deptId,
          'resourceId': val.resourceId,
          'status': val.currentStatus
        }
      ).then(rs => {
        if (rs.head.errCode === 0) {
          this.form.status = rs.data.status
          this.form.deptId = rs.data.deptId
          this.form.deptName = rs.data.deptName
          this.form.id = rs.data.id
          this.form.currentStatus = val.currentStatus
          this.form.resourceId = rs.data.resourceId === '-1' ? Number(rs.data.resourceId) : rs.data.resourceId
          this.form.serviceId = [...rs.data.serviceId]
          this.form.serviceFrequency = rs.data.serviceFrequency ? rs.data.serviceFrequency : {}
          this.form.amount = rs.data.serviceFrequency.amount
          this.ids = rs.data.serviceRules.map(item => {
            return item.id
          })
        }
      })
    },
    searchChilds () {
      let params = {
        outStaffGetStaffListByConditionReqDTO: {
          tenantSubjectIdList: [this.form.deptId],
          orgIdList: [this.storage.getLocalStorage('CLINICID')],
          typeCodeList: ['DOCTOR']
        }
      }
      this.api.getStaff(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.arrangeResource = rs.data.resultList || []
        }
      })
    },
    getResourceService () {
      let params = {
        orgId: this.storage.getLocalStorage('CLINICID'),
        searchType: 2,
        serviceClassification: '799',
        finType: 1
      }
      this.arrangeapi.getArrangeService(params).then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.serviceList = []
          return false
        }
        this.serviceList = rs.data.map(item => {
          return {
            id: item.id,
            name: item.name
          }
        })
        this.serviceList = rs.data
      })
    },
    canEdit () {
      this.edit = false
      this.chakan = true
      this.getById(this.form)
    },
    cancel () {
      if (this.newcreate === false) {
        this.edit = true
        this.resetForm(true)
        this.$refs.timeTrunkform.resetFields()
      } else {
        this.edit = true
        this.chakan = false
        this.getById(this.form)
      }
    },
    submitEvent () {
      this.$refs.timeTrunkform.validate(valid => {
        if (!valid) {
          return false
        }
        // console.log('this.params.status:', this.form.status)
        this.form.currentStatus = this.currentStatus
        this.form.ids = this.ids
        this.isDisabled = true
        this.api.createOrmodify(this.form).then(rs => {
          if (rs.head.errCode) return false
          this.$notify({
            title: '提示',
            type: 'success',
            message: '保存成功',
            duration: 2000
          })
          this.chakan = false
          this.edit = true
          this.$emit('success')
          this.newcreate = true
          this.firstcom = true
        })
        setTimeout(() => {
          this.isDisabled = false
        }, 1000)
      })
    },
    resetForm (bol) {
      this.form = {
        id: '',
        status: 1,
        currentStatus: null,
        categoryCode: 'OUTPATIENT_DOCTOR',
        deptId: '',
        deptName: '',
        resourceId: '',
        name: '',
        serviceId: [],
        serviceFrequency: {
          type: '',
          amount: null,
          volume: 1
        },
        serviceRules: [],
        amount: ''
      }
    },
  },
}
</script>
<style scoped>
.right {
  margin-left: 50px;
  margin-top: 20px;
}
.head {
  font-family: PingFangSC-Medium;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0.86px;
  line-height: 36px;
  border-bottom: 1px solid #98aec3;
  padding-bottom: 15px;
}
.wid {
  width: 180px;
}
.center {
  text-align: center;
}
.please {
  margin-top: 18px;
}
.w350 {
  width: 350px;
}
.graywrap {
  position: relative;
  min-height: 300px;
}
.gray {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 99;
}
.warnmsg {
  position: absolute;
  padding: 6px 8px 6px 24px !important;
  border: 1px solid #ee4433;
  background-color: #ffdede;
  border-radius: 2px;
  color: #000 !important;
  font-size: 14px;
  line-height: 1;
  top: auto !important;
  margin-top: 4px;
  right: 0;
  left: auto !important;
  z-index: 999;
}
.warnmsg::after {
  font-family: "iconfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\E7B2";
  color: #ee4433;
  position: absolute;
  left: 6px;
  top: 6px;
}
.warnmsg::before {
  content: "";
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  background-color: #ffdede;
  top: -5px;
  right: 30px;
  border: 1px solid #ee4433;
  transform: rotate(45deg);
  border-right: 0;
  border-bottom: 0;
  z-index: 1;
}
</style>
