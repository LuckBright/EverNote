<template>
  <el-dialog 
    :title="title" 
    :visible="value" 
    class="ui_dialog_02 inpatient_base_dialog"
    :close-on-click-modal='false'
    width='650px'
    @close="close">
    <div class="diloag_patient_info">
      <p class="name">{{patient.curNeonateName || patient.patientName || "--"}}<span></span></p>
      <p>{{patient.curNeonateSex || patient.sex | formatSex}}</p>
      <p>{{patient.curNeonateBirthday || patient.birthday | formatDateByExp("YYYY-MM-DD")}}</p>
      <p class="width"><span>保险机构：</span>
       <el-tooltip effect="dark" :content="patient.insuranceCompany || '--'" placement="top">
         <span style="color: #2B333D;">{{patient.insuranceCompany || '--'}}</span>
        </el-tooltip>
      </p>
      <p ><span>病案号：</span>{{patient.inpatientNumber}}</p>
    </div>
    <slot></slot>
    <div slot="footer" class="dialog-footer" v-if='showbtn'>
      <el-button  @click="close">取消</el-button>
      <el-button type="primary" :disabled="dis || disabled" @click="$emit('save')"   
        v-ever-click-once="disabled"
        >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/inpatient/store/resident.js'
export default {
  props: {
    title: String,
    value: Boolean,
    hospitalizedNumber: String,
    patientId: String,
    showbtn: {
      type: Boolean,
      default: true
    },
    dis: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      api,
      patient: {
        iconList: {}
      },
      disabled: false,
      needGetInpatientIconsbyHosNumber: true
    }
  },
  computed: {
    curKeys () {
      return this.patientId || this.hospitalizedNumber || ''
    }
  },
  watch: {
    curKeys: {
      handler (val) {
        this.open()
      },
      immediate: true,
      deep: true
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    patientinfo (data) {
      data = JSON.parse(JSON.stringify(data))
      this.needGetInpatientIconsbyHosNumber = false
      data.patientVO = data.patientVO || {}
      this.patient.patientName = data.patientName
      this.patient.sex = data.sex
      this.patient.birthday = data.birthday || data.birthDay
      this.patient.insuranceCompany = data.insuranceCompany || data.insuranceCompanyName
      this.patient.admitPaymentMethod = data.admitPaymentMethod
      this.patient.inpatientNumber = data.patientVO.inpatientNumber
    },
    save () {

    },
    close () {
      this.$emit('input', false)
    },
    async open () {
      if (!this.hospitalizedNumber) return
      let res = await api.getInpatientIconsbyHosNumber({
        hospitalizedNumber: this.hospitalizedNumber
      })
      // 患者在院状态 -1 已取消入科 1 已入科 2 待出科 3 已出科 4 已转科 5 已转病区 6 历史出科（曾经出科的）
        // 已取消入科
        // Integer PATIENT_STATUS_CANCEL = -1;
        // // 已入科
        // Integer PATIENT_STATUS_IN = 1;
        // // 待出科
        // Integer PATIENT_STATUS_WATITING_OUT = 2;
        // // 已出科
        // Integer PATIENT_STATUS_OUT = 3;
        // // 已转科
        // Integer PATIENT_STATUS_OUT_PROVIDER = 4;
        // // 已转病区
        // Integer PATIENT_STATUS_OUT_AREA = 5;
        // // 历史出科
        // Integer PATIENT_STATUS_OUT_HISTORY = 6;
      if (!this.needGetInpatientIconsbyHosNumber || res.data === null) return
      this.patient = res.data || {}
      let curNeonate = res.data.neonateList && res.data.neonateList.filter(v => {
        return v.patientId === this.patientId
      })[0] || {}
      this.patient.curNeonateName = curNeonate.patientName
      this.patient.curNeonateSex = curNeonate.sex
      this.patient.curNeonateBirthday = curNeonate.birth
      this.patient.iconList = this.patient.iconList || {}
      this.patient.insuranceCompany = this.patient.iconList.insuranceCompany || '--'
      this.patient.admitPaymentMethod = this.patient.iconList.admitPaymentMethod
      this.patient.nursinglevel = this.patient.iconList.nursinglevel
      this.$emit('info', JSON.parse(JSON.stringify(res.data)))
    },
    beforeClose () {

    }
  }
}
</script>
<style lang='scss' scoped>
.inpatient_base_dialog{
  /deep/ .el-dialog__footer{
    border-top:none;
  }
  button {
    padding-left: 15px;
    padding-right: 15px;
  }
  .diloag_patient_info{
    background-color: #F0F5FA;
    padding: 0 10px;
    font-size: 14px;
    color: #2B333D;
    line-height: 36px;
    text-align: center;
    display: flex;
    justify-content:space-between;
    p{
      margin: 0;
      span{
        color: #999;
      }  
    }
    .width{
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name{
      font-weight: 700;
      span{
        float: right;
        width: 1px;
        padding: 8px 0;
        margin-top: 10px;
        margin-left: 10px;
        background-color: #979797;
        opacity: .3;
      }
    }
  }
  /deep/ .el-form{
      padding-top:15px;
      .el-form-item{
          margin-bottom: 15px;
      }
      .el-form-item__content{
          line-height: 32px;
          .el-input__inner{
              height: 32px;
              line-height: 32px;
          }
      }

  }
  /deep/ .back{
      padding-left: 15px;
      padding-bottom: 15px;
      span{
          color: #1C7BEF;
          text-decoration: underline;
          cursor: pointer;
          padding-left: 10px;
      }
  }
  /deep/ .wb100{
    width: 100%;
  }
    
}
</style>
