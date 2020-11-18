<template>
  <el-dialog
    :visible.sync="dialogFlag"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog_inhospital ui_dialog_02 spe"
    :append-to-body='true'
    :class="!obj.status || obj.status < 1 ? 'langs' : 'short'"
    :key='key'
  >
    <div slot="title">
      <div class="t1">
        入院申请
        <i>(已住院&nbsp;{{count}}次)</i>
      </div>
      <div class="t2" v-if="text">
        <i class="icon iconfont icon-beibohui"></i>
        <el-tooltip content="Top right" placement="right" effect="light">
          <div slot="content" style="width:500px">
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">姓名：</el-col>
              <el-col :span="4">{{old.patient.name}}</el-col>
              <el-col :span="4" style="textAlign:right">性别：</el-col>
              <el-col :span="4">{{old.patient.sex | formatSex}}</el-col>
              <el-col :span="4" style="textAlign:right">年龄：</el-col>
              <el-col :span="4">{{old.patient.birthday | birthdayComputed}}</el-col>
            </el-row>
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">入院方式：</el-col>
              <el-col :span="4">
                 <sys-value type="THC_RYFS" :code="old.admitMethod"></sys-value>
              </el-col>
              <el-col :span="4" style="textAlign:right">入院途径：</el-col>
              <el-col :span="4">
                <sys-value type="CV09.00.403" :code="old.admitRoute"></sys-value>
              </el-col>
              <el-col :span="4" style="textAlign:right">入院科室：</el-col>
              <el-col :span="4">{{old.admitDeptName || '--'}}</el-col>
            </el-row>
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">主治医师：</el-col>
              <el-col :span="4">{{old.chargeDoctorName|| '--'}}</el-col>
              <el-col :span="4" style="textAlign:right">住院医师：</el-col>
              <el-col :span="4">{{old.admitDoctorName|| '--'}}</el-col>
              <el-col :span="4" style="textAlign:right">押金：</el-col>
              <el-col :span="4">{{old.admitDeposit|| '--'}}元</el-col>
            </el-row>
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">入院时间：</el-col>
              <el-col
                :span="5"
              >{{old.adviseAdmitTime | formatDateByExp('YYYY-MM-DD HH:mm')}}</el-col>
              <el-col :span="3" style="textAlign:right">手机号：</el-col>
              <el-col :span="4">{{old.mobile|| '--'}}</el-col>
            </el-row>
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">入院诊断：</el-col>
              <el-col :span="20">
                <template v-for="item in old.diagnosis">
                  {{item.diseaseName}}
                  <template v-if="item.diagnoseType == 2">：待查</template>,
                </template>
              </el-col>
            </el-row>
            <el-row style='lineHeight:25px'>
              <el-col :span="4" style="textAlign:right">备注：</el-col>
              <el-col :span="20">{{old.remark || '--'}}</el-col>
            </el-row>
            <br>
          </div>
          <span>{{text}}</span>
        </el-tooltip>
      </div>
    </div>
    <template>
      <div style="font-size: 14px;color:#666; overflow:hidden">
        <ever-form2
          :schema="schema"
          v-model="obj"
          ref="inHospitalForm"
          :span="12"
          :rules="rules"
          labelWidth="96px"
          :allDisabled="result.status != 1"
        >
          <template slot="diagnosis">
             <ever-diagnosis :disabled="result.status != 1" v-model="obj.diagnosis" :norule="true" type='1' class="zdd"></ever-diagnosis>
          </template>
          <template slot="familyMember">
            <div>
              <div style="width:125%;">
                <contacts :add='false' :disabled="result.status != 1"  ref='familyMember' v-model="obj.familyMember" othersShowType='down' class="familyMember"></contacts>
              </div>
            </div>
          </template>
          <template slot="adviseAdmitTime">
              <el-date-picker
                v-model="obj.adviseAdmitTime"
                type="datetime"
                :pickerOptions='{
                  disabledDate (time) {
                    return time.getTime() < new Date().setDate(new Date().getDate() - 1)
                  }
                }'
                format='yyyy-MM-dd HH:mm'
                value-format='yyyy-MM-dd HH:mm:ss'
                placeholder="请选择建议入院时间">
              </el-date-picker>
          </template>
          <div slot="default"></div>
        </ever-form2>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="print" v-if="result.status != 1">补打入院申请</el-button>
        <el-button v-else-if="old.id || result.id" style="float:left" @click="callback()">取消入院申请</el-button>
        <el-checkbox
        v-if="result.status == 1"
          v-model="isPrint"
          label="false"
          style="margin-left:10px"
        >打印入院申请</el-checkbox>
        <el-button @click="close" v-if="result.status == 1">取消</el-button>
        <el-button
          @click="submit"
          type="primary"
          v-ever-click-once="disabled"
          v-if="result.status == 1"
          :disabled="disabled"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import api from '../store/medicalapi'
import everContact from './contact'
import { isJsonString } from '@/util/common'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import inhospital from '@/workspace/store/inhospital'
import phrapi from '@/form/store/phrapi.js'
import resident from '@/inpatient/store/resident.js'
// import userbaseapi from '@/workspace/store/userbaseapi'
import mainheaderapi from '@/workspace/store/mainheaderapi'
import moment from 'moment'
import contacts from '@/crm/components/contacts'

let schema = [
  {
    name: 'name',
    label: '姓名',
    span: 24,
    props: {
      placeholder: '请输入',
      disabled: true
    }
  },
  {
    name: 'mobile',
    span: 12,
    label: '手机号'
  },
  {
    name: 'sex',
    label: '性别',
    comp: 'sys-type',
    span: 12,
    props: {
      code: 'GBT.2261.1',
      disabled: true
    }
  },
  {
    span: 24,
    name: 'familyMember',
    label: '联系人类型',
    comp: 'custom'
  },
  {
    name: 'diagnosis',
    label: '门诊诊断',
    span: 24,
    comp: 'custom',
    props: {
      placeholder: '请输入'
    }
  },
  {
    label: '建议入院时间',
    span: 12,
    name: 'adviseAdmitTime',
    comp: 'custom'
  },
  {
    name: 'admitDeptId',
    span: 12,
    label: '入院科室',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'chargeDoctorId',
    placeholder: '主治医师',
    span: 12,
    label: '主治医师',
    comp: 'ever-select',
    props: {
      filterable: true,
      options: []
    }
  },
  {
    name: 'admitDoctorId',
    placeholder: '住院医师',
    span: 12,
    label: '住院医师',
    comp: 'ever-select',
    props: {
      filterable: true,
      options: []
    }
  },
  {
    name: 'admitRoute',
    label: '入院途径',
    comp: 'sys-type',
    span: 12,
    props: {
      code: 'CV09.00.403'
    }
  },
  {
    name: 'admitDeposit',
    label: '押金',
    span: 12,
    comp: 'ever-price',
    props: {
      placeholder: '请输入',
      append: '元'
    }
  },
  {
    name: 'admitMethod',
    label: '入院方式',
    span: 12,
    comp: 'sys-type',
    props: {
      code: 'THC_RYFS'
    }
  },
  {
    name: 'remark',
    label: '备注',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入',
      maxlength: 200
    }
  }
]
export default {
  props: ['applicationFormSource'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.familyMember = []
    obj.diagnosis = [{ diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', comment: '', diagnoseList: [] }]
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('必填项'))
      } else if (value && value.length !== 11) {
        return callback(new Error('格式有误'))
      }
      callback()
    }
    let checkNumber = (rule, value, callback) => {
      if (!value || isNaN(Number(value))) {
        return callback(new Error('必填项'))
      } else {
        callback()
      }
    }
    return {
      text: '',
      disabled: false,
      dialogFlag: false,
      count: 0,
      schema,
      obj,
      api,
      isPrint: true,
      providerName: [],
      doctorName: [],
      moment,
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        sex: [{ required: false, message: '必填项', trigger: 'blur' }],
        mobile: [{ required: true, trigger: 'blur', validator: checkPhone }],
        // diagnosis: [{ required: false, message: ' ', trigger: 'blur', type: 'array', validator: checkResult }],
        admitDeptId: [{ required: true, message: '必填项', trigger: 'change' }],
        admitRoute: [{ required: true, message: '必填项', trigger: 'blur', type: 'string' }],
        admitDeposit: [{ required: true, message: '必填项', trigger: 'blur', validator: checkNumber }]
      },
      hisReportCode: 'ZY_CPOE_RU_YUAN_SHEN_QING_DAN',
      id: '',
      result: {
        patient: {}
      },
      old: {
        patient: {}
      },
      visitSn: '',
      patientId: this.$route.query.patientId || '',
      isNeonate: '0',
      key: 0
    }
  },
  watch: { // 选择科室，清空医师
    'obj.admitDeptId': {
      handler (val) {
        this.obj.chargeDoctorId = ''
        this.obj.admitDoctorId = ''
        this.$ever.getFieldFromSchema(schema, 'chargeDoctorId').props.options = []
        this.$ever.getFieldFromSchema(schema, 'admitDoctorId').props.options = []
        if (val) this.getDoctors(val)
      },
      immediate: true
    },
    'obj.diagnosis': {
      handler (val) {
        if (val.length === 0) {
          this.obj.diagnosis = [{ diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', comment: '', diagnoseList: [] }]
        }
      },
      immediate: true
    },
    'obj.familyMember': {
      handler (val) {
        if (val.length > 1) {
          this.obj.familyMember = [this.obj.familyMember.shift()]
        }
      },
      immediate: true
    },
  },
  methods: {
    async callback () {
      let result = await mainheaderapi.cancel({
        id: this.old.id || this.result.id
      })
      if (result.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '取消入院申请成功',
          type: 'success'
        })
        this.dialogFlag = false
      }
    },
    async getMedicalRecord () { // 获取诊断
      if (this.visitSn || this.$route.query.visitSn) { // 没有visitSn就不默认诊断
        let res = await phrapi.getZhenduan(this.visitSn || this.$route.query.visitSn)
        res = res || []
        let obj = res[0] || {}
        obj.diagList = obj.diagList || [{ diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', comment: '', diagnoseList: [] }]
        this.$set(this.obj, 'diagnosis', obj.diagList)
      }
    },
    async getDoctors (providerId) { // 获取医师列表
      let res = await resident.getTenantSubjectListHasStaffByCondition({
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          idList: [providerId]
        },
        outStaffGetStaffListByConditionReqDTO: {
          typeCodeList: ['DOCTOR'],
          orgIdList: [this.$store.state.currentUser.organizationId + '']
        }
      })
      if (res.data && res.data.resultList) {
        let doctorIdOptions = []
        let data = res.data.resultList || []
        data.forEach(element => {
          element.tsStaffList.forEach(ele => {
            doctorIdOptions.push(ele)
          })
        })
        this.doctorName = doctorIdOptions
        if (!this.obj.id) {
          doctorIdOptions.forEach(element => {
            if (element.id === this.$store.state.currentUser.userId) {
              this.obj.chargeDoctorId = this.$store.state.currentUser.userId
            }
          })
        }
        this.$ever.getFieldFromSchema(schema, 'admitDoctorId').props.options = doctorIdOptions
        this.$ever.getFieldFromSchema(schema, 'chargeDoctorId').props.options = doctorIdOptions
      }
      //   if (rs.data && rs.data.resultList) {
      //     let arr = []
      //     let obj = {}
      //     rs.data.resultList.map(v => {
      //       obj.id = v.id
      //       obj.name = v.name
      //       arr.push(obj)
      //       obj = []
      //     })
      //     this.doctorName = arr
      //     this.$ever.getFieldFromSchema(schema, 'chargeDoctorId').props.options = arr
      //     this.$ever.getFieldFromSchema(schema, 'admitDoctorId').props.options = arr
      //   }
    },
    close () {
      this.dialogFlag = false
      this.$refs.inHospitalForm.$refs.form.resetFields()
    },
    defultProvider (id, name) {
      inhospital.getTenantSubjectListByCondition({
        type2CodeList: ['01.01'],
        orgIdList: [this.$store.state.currentUser.organizationId],
        usePermissionStatus: 'Y'
      }).then(result => {
        result = result.data
        this.providerName = []
        if (result.resultList && result.resultList.length > 0) {
          this.providerName = result.resultList
        }
        let insert = true
        this.providerName.forEach(ele => {
          ele.id = ele.tenantSubjectCode
          ele.name = ele.tenantSubjectName
          if (ele.id === id) {
            insert = false
          }
        })
        if (insert && id) {
          this.providerName.push({
            id: id,
            name: name
          })
        }
        this.$ever.getFieldFromSchema(schema, 'admitDeptId').props.options = this.providerName
      })
    },
    commendShow (data) {
      this.patient = data.patientVO || {}
      this.obj.name = this.patient.name
      this.obj.mobile = data.mobile
      this.obj.patientId = this.patient.id
      this.obj.sex = this.patient.sex
      this.obj.age = this.patient.age
      this.obj.familyMember = isJsonString(data.familyMember) ? JSON.parse(data.familyMember) : []
      this.$nextTick(_ => {
        this.$refs.familyMember.setObj()
      })
    },
    openedApplicationShow (data) {
      this.obj.id = data.id
      this.obj.admitDeptId = data.admitDeptId
      this.obj.admitDeptName = data.admitDeptName
      this.defultProvider(data.admitDeptId, data.admitDeptName)
      this.obj.chargeDoctorName = data.chargeDoctorName
      this.obj.admitDoctorName = data.admitDoctorName
      this.obj.admitDeposit = Number(data.admitDeposit)
      this.obj.remark = data.remark
      this.obj.admitRoute = data.admitRoute
      this.obj.admitMethod = data.admitMethod
      this.$set(this.obj, 'diagnosis', data.diagnosis)
      setTimeout(() => {
        this.obj.chargeDoctorId = data.chargeDoctorId
        this.obj.admitDoctorId = data.admitDoctorId
      }, 20)
      if (data.adviseAdmitTime) {
        this.obj.adviseAdmitTime = this.moment(data.adviseAdmitTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    async opens ({patientId, visitSn, id}, isNeonate) {
      this.isNeonate = isNeonate || '0'
      if (!patientId && !id) return // 后台将visitSn改为非必填（由于新生儿没有visitSn）
      this.key++
      this.dialogFlag = true
      this.$nextTick(() => {
        this.$refs.inHospitalForm.$refs.form.resetFields()
        this.obj.admitDeptId = ''
        this.obj.admitDoctorId = ''
        this.obj.admitMethod = ''
        this.obj.admitRoute = ''
        this.obj.adviseAdmitTime = ''
        this.obj.age = ''
        this.obj.chargeDoctorId = ''
        this.obj.diagnosis = []
        this.obj.familyMember = []
        this.obj.mobile = ''
        this.obj.name = ''
        this.obj.patientId = ''
        this.obj.remark = ''
        this.obj.admitDeposit = ''
        this.obj.sex = ''
      })
      this.text = ''
      this.visitSn = visitSn
      this.patientId = patientId
      // this.providerId = providerId
      // inhospital.getLocalSectionVoListForService().then(result => {
        // inhospital.getLocalSectionVoListForService({ categoryIds: [1972] }).then(result => {
      // 获取科室列表 -- 并行不需要await
      // 获取住院次数
      this.api.admitNumberByPatientId({
        patientId: this.patientId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.count = rs.data
        }
      })
      let res = {}
      if (!id) {
        res = await this.api.existRecordByPatientId({
          patientId: this.patientId,
          visitNumber: this.visitSn
        })
        res.data = res.data || {}
        this.old = res.data.old || {}
        this.old.patient = this.old.patientVO || {}
        this.result = res.data.novel || {}
        this.visitSn = this.result.visitNumber
        this.id = this.result.id
        this.result.diagnosis = isJsonString(this.result.diagnosis) ? JSON.parse(this.result.diagnosis) : []
        this.old.diagnosis = isJsonString(this.old.diagnosis) ? JSON.parse(this.old.diagnosis) : []
        if (this.old.id) {
          if (this.result.status === 1) {
            this.text = `${this.old.createName || '--'}为患者于${this.old.applyTime}开立入院申请，重新开立会作废已有申请`
          } else {
            this.text = '该患者已于' + this.result.applyTime + '办理入院登记，无法重新开立'
          }
        } else {
          this.text = ''
        }
        if (this.result.id) {
          this.openedApplicationShow(this.result)
        } else {
          if (this.$route.path.indexOf('outpatient') > -1) this.obj.admitRoute = '1'
          this.defultProvider() // 默认科室
          this.getMedicalRecord() // 默认诊断
        }
        // 默认科室
        // this.obj.providerId = this.$route.query.providerId || ''
        // 默认医师
        // resident.getCurrentUser().then(res => {
        //   this.obj.chargeDoctorId = res.data.userId
        // })
        //
      } else { // 修改申请
        this.id = id
        res = await this.api.applyGetById({id})
        this.result = res.data
        this.visitSn = this.result.visitNumber
        this.result.diagnosis = isJsonString(this.result.diagnosis) ? JSON.parse(this.result.diagnosis) : []
        this.openedApplicationShow(this.result)
      }
      // 基本信息回显
      this.commendShow(this.result)
    },
    async create () {
      let option = {
        id: this.id,
        visitNumber: this.visitSn,
        sex: this.obj.sex,
        admitDeptId: this.obj.admitDeptId, // 入院科室
        mobile: this.obj.mobile, // 手机号
        familyMember: JSON.stringify(this.obj.familyMember), // 联系人
        admitDeposit: this.obj.admitDeposit, // 押金
        diagnosis: JSON.stringify(this.obj.diagnosis),  // 入院诊断
        adviseAdmitTime: this.obj.adviseAdmitTime ? this.$moment(this.obj.adviseAdmitTime).format('YYYY-MM-DD HH:mm:ss') : '', // 建议入院时间
        remark: this.obj.remark, // 备注
        admitMethod: this.obj.admitMethod, // 入院方式
        admitRoute: this.obj.admitRoute, // 入院情况
        patientId: this.patientId,
        patientName: this.obj.name,
        chargeDoctorId: this.obj.chargeDoctorId,
        admitDoctorId: this.obj.admitDoctorId,
        isNeonate: this.isNeonate
      }
      let diagnosisArr = JSON.parse(option.diagnosis)
      let arr = diagnosisArr.filter(item => {
        return !!item.diseaseCode
      })
      option.diagnosis = JSON.stringify(arr)
      this.providerName.map(v => { // 科室ID -》 科室名字
        if (v.id === option.admitDeptId) {
          option.admitDeptName = v.name
          this.obj.admitDeptName = v.name
        }
      })
      this.doctorName.map(v => { // 医师ID -》 医师名字
        if (v.id === this.obj.chargeDoctorId) {
          option.chargeDoctorName = v.name
          this.obj.chargeDoctorName = v.name
        }
        if (v.id === this.obj.admitDoctorId) {
          option.admitDoctorName = v.name
          this.obj.admitDoctorName = v.name
        }
      })
      option.applicationFormSource = this.applicationFormSource || '1'
      let res = await inhospital.create(option)
      if (!res.head || res.head.errCode !== 0) {
        return false
      }
      this.id = res.data.id
      let str = this.isNeonate === '0' ? '提交入院申请成功!' : '新生儿提交入院申请成功!'
      this.$notify({
        title: '成功',
        message: str,
        type: 'success'
      })
      if (this.isPrint) {
        this.print()
      }
      this.dialogFlag = false
    },
    submits () {
      this.$refs.inHospitalForm.$refs.form.validate((valid) => {
        if (valid) {
          this.create()
        } else {
          this.$refs.inHospitalForm.autofocus()
        }
      })
    },
    async submit () {
      if (this.text) {
        this.$confirm('新提交入院申请会作废之前的入院申请，是否继续提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submits()
        }).catch(() => {
        })
      } else {
        this.submits()
      }
    },
    print () {
      singlePrint(
          this.hisReportCode,
        {
          patientId: this.obj.patientId,
          visitNumber: this.visitSn,
          orgId: this.$store.state.currentUser.organizationId,
          tenantId: this.$store.state.currentUser.tenantId
        })
    },
    getByPatientId () {
      if (!this.patientId) {
        return false
      }
      let params = {
        patientId: this.patientId
      }
      this.api.getByPatientId(params).then(rs => {
        if (rs.head.errCode || !rs.data) {
          return false
        }
        this.id = rs.data.id
        rs.data.result = [{
          diseaseName: rs.data.diagnosis,
          diseaseOrigId: rs.data.diagnosisId,
          comment: '',
          position: rs.data.position
        }]
        Object.assign(this.obj, rs.data)
      })
    }
  },
  components: {
    everContact,
    contacts
  }
}
</script>
<style lang='scss' scoped>
 /deep/ .langs {
  .el-dialog {
    width: 753px;
  }
}
 /deep/ .short {
  .el-dialog {
    width: 680px;
  }
  .el-row {
    line-height: 40px;
    p {
      display: inline-block;
    }
  }
}
.dialog_inhospital {
  /deep/ .el-dialog__body {
    max-height: 600px;
    padding: 0px 20px 10px;
  }
   /deep/.el-form-item {
    // padding-bottom:15px;
     /deep/ .el-form-item {
      margin-bottom: 0px !important;
    }
  }
  .shows{
    line-height: 30px;
  }
  .t1 {
    line-height: 30px;
  }
  .t2 {
    line-height: 20px;
    font-size: 13px;
    color: #ee4433;
    i {
      vertical-align: middle;
      padding-right: 2px;
    }
  }
  .contactList{
    width: 125%;
  }
}
.readylyShow {
   /deep/ .el-row {
    line-height: 40px;
  }
}
</style>
