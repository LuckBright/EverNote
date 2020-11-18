<template>
  <div class="spe" id="Medtriage">
    <div class="medform">
      <el-form :model="form" size="small" label-width="80px" label-position="right" ref="form" class="triageForm">
        <el-row class="">
          <el-col :span="2">
            <dept-cascader v-model="form.deptIdObj" :template-type="2" :show-first-dept="true"></dept-cascader>
          </el-col>
          <el-col :span="4" class="ml10 mt2">
            <el-form-item label="" prop="patient.name" style="margin-left:-80px;">
              <ever-patient-select v-if="show" v-model="form.patient.name" @select="selectPatient" :allow-create="true" @newuser="resetPatient"></ever-patient-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="ml10">
            <el-button size="small" @click="resetform">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <medical-triage-tab class="layout_inner flex_column_1_hidden mt10" ref='medicaltriagetab' :diagnosisAreaId="form.diagnosisAreaId" :form="form"></medical-triage-tab>
    <changeroom ref="changeroom" @reload="reload"></changeroom>
  </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
import medicalapi from '@/arrange/store/medicaltriagetabapi'
import MedicalTriageTab from '@/arrange/page/triage/medicaltriagetab'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import changeroom from '@/arrange/page/triage/dialog-changeroom'
export default {
  data () {
    return {
      api,
      medicalapi,
      show: true,
      deptList: [],
      loading: '',
      radio: '',
      waitTime1: null,
      waitTime: '',
      form: {
        deptIdObj: null,
        waitTime: '',
        diagnosisAreaId: '',
        selectDept: '',
        patientId: '',
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      },
      tableData: [],
      isNew: '',
      qrcodeData: {
        url: ''
      },
      qrcodeUrl: '',
      diagnosisOption: [],
      imgFlag: false,
      id: this.$store.state.currentUser.userId,
      isQueue: false,
      patientId: '',
      deptId: ''
    }
  },
  watch: {
    form: {
      handler (val) {
      },
      deep: true
    },
    'form.patient.name' (val) {
      if (!val) {
        this.form.patientId = ''
        this.patientId = ''
      }
    },
    'form.deptIdObj': {
      handler (val) {
        if (val && val.deptId) {
          this.deptId = val.deptId
          if (this.patientId) {
            this.getTriagemessage(val.deptId, this.patientId)
          }
        }
      }
    }
  },
  methods: {
    reload () {
      this.$refs.medicaltriagetab.list()
    },
    changeroom (val) {
      if (val) {
        this.$refs.changeroom.open(val)
      }
    },
    setClass () {
      this.imgFlag = !this.imgFlag
    },
    resetform () {
      this.form.patient = {
        agebirthday: '',
        name: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    },
    selectPatient (val) {
      if (val && val.id) {
        this.patientId = val.id
        if (this.deptId) {
          this.getTriagemessage(this.deptId, val.id)
        }
      }
    },
    resetPatient () {
      this.form.patient = {
        agebirthday: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    getTriagemessage (deptId, id) {
      this.medicalapi.getTriagemessage({deptId: deptId, patientId: id}).then(rs => {
        if (rs && rs.data && rs.data.queueNum) {
          //  在排队了不显示弹窗
          this.form.patientId = id
        } else if (rs && rs.data && !rs.data.queueNum) {
          //  未排队显示弹窗给号
          rs.data.deptNew = this.deptId
          this.changeroom(rs.data)
        }
      })
    }
  },
  components: {
    MedicalTriageTab,
    deptCascader,
    changeroom
  }
}
</script>
<style scoped>
.layout_box.spe{margin-top: 0;}
.layout_box .layout_inner.spe .main-wrap{padding:20px 20px;}
.layout_box .layout_inner.spe .main-wrap.spe {padding-top: 0;}
.layout_box .layout_inner .main-expand {padding: 20px;}
.lh40{height:40px;line-height: 40px;}
.mt2{margin-top: 2px;}
.ml40{line-height: 10px;}
.fr{float:right;}
a.result{text-decoration:underline;margin-left:10px;}
.fz14{font-size: 14px;}
.el-form-item__content{line-height: 36px!important;}
#Medtriage .qrcodeDiv{width:20px;height:20px;position:relative;}
#Medtriage .qrcodeDiv img:first-child{width:40px;height:40px;position:absolute;top:0px;left:58px;}
#Medtriage .qrcodeDiv img.specialImg{width:300px;height:300px;position:fixed;right:20px;top:120px;z-index:900;}
#Medtriage .medform{height:36px;line-height:36px;}
#Medtriage .p10{padding:10px;}
#Medtriage /deep/ .el-cascader{width:100%;}
 </style>
