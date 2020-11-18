<template>
  <el-row type="flex" id="register">
    <el-col class="left">
      <el-form>
        <el-form-item>
          <ever-patient-select v-model="patientName" :allow-create="true" @select="selectPatient"></ever-patient-select>
        </el-form-item>
      </el-form>
      <appointlist :patient="patient" @appoint="setAppoint"></appointlist>
      <patientinfo :patient="patient" @changepatient="setNewPatient"></patientinfo>
    </el-col>
    <el-col class="center">
      <ul>
        <li
          v-if="hnFlag === '2'"
          @click="currentShow = currentShow !== 'HnMemberadd' ? 'HnMemberadd' : ''"
          :class="{on: currentShow === 'HnMemberadd'}"
        >
          <i class="iconfont icon-jiandang"></i>
          <label>建档</label>
        </li>
        <li
          v-else
          @click="currentShow = currentShow !== 'memberAdd' ? 'memberAdd' : ''"
          :class="{on: currentShow === 'memberAdd'}"
        >
          <i class="iconfont icon-jiandang"></i>
          <label>建档</label>
        </li>
        <li @click="currentShow = currentShow !== 'bindCard' ? 'bindCard' : ''">
          <i class="iconfont icon-buhuanzhenqia"></i>
          <label>补卡换卡</label>
        </li>
        <li @click="printPatient">
          <i class="iconfont icon-biaoqian"></i>
          <label>打印条码</label>
        </li>
      </ul>
      <ul>
        <li
          @click="currentShow = currentShow !== 'appointList' ? 'appointList' : ''"
          :class="{on: currentShow === 'appointList'}"
        >
          <i class="iconfont icon-yuyuejilu"></i>
          <label>预约记录</label>
        </li>
        <li
          @click="currentShow = currentShow !== 'numberList' ? 'numberList' : ''"
          :class="{on: currentShow === 'numberList'}"
        >
          <i class="iconfont icon-guahaojilu"></i>
          <label>挂号记录</label>
        </li>
        <li
          @click="currentShow = currentShow !== 'cardList' ? 'cardList' : ''"
          :class="{on: currentShow === 'cardList'}"
        >
          <i class="iconfont icon-buqiajilu"></i>
          <label>补卡补本</label>
        </li>
      </ul>
    </el-col>
    <el-col class="right">
      <numbersource
        v-model="source"
        :appoint="selectAppoint"
        @success="showSendMessage"
        @arrange="showArrangeDialog"
      ></numbersource>
      <numberform :appoint="selectAppoint" :source="source" :use-appoint="selectAppoint.useAppoint"></numberform>
      <medical-insurance
        :settlement-id="settlementId"
        :key="settlementId"
        :visible.sync="insuranceVisible"
        :refund="false"
        @confirmFun="rcmVisible = true"
      ></medical-insurance>
      <rcm :visible.sync="rcmVisible" :settlement-id="settlementId"></rcm>
      <send-message ref="sendmessage" :users="sendPatient" :disabled="true"></send-message>
      <dialog-arrange :value="{deptId: selectDept.deptId}" :show.sync="showArrange"></dialog-arrange>
      <transition name="everslide" mode="out-in">
        <div
          key="appointList"
          class="slide"
          v-if="currentShow === 'appointList'"
          @click="closeDialog($event)"
        >
          <dialog-appoint class="slide-content" :show="true" :type="1"></dialog-appoint>
        </div>
        <div
          key="numberList"
          class="slide"
          v-if="currentShow === 'numberList'"
          @click="closeDialog($event)"
        >
          <dialog-number class="slide-content" :show="true"></dialog-number>
        </div>
        <div
          key="cardList"
          class="slide"
          v-if="currentShow === 'cardList'"
          @click="closeDialog($event)"
        >
          <dialog-card class="slide-content" :show="true"></dialog-card>
        </div>
        <div
          key="bindCard"
          class="slide"
          v-if="currentShow === 'bindCard'"
          @click="closeDialog($event)"
        >
          <dialog-bindcard class="slide-content" @success="currentShow=''"></dialog-bindcard>
        </div>
        <div
          key="memberAdd"
          class="slide"
          v-if="currentShow === 'memberAdd'"
          @click="closeDialog($event)"
        >
          <dialog-memberadd
            class="slide-content"
            :patient="editPatient"
            @success="memberAddSuccess"
            :is-component="true"
          ></dialog-memberadd>
        </div>
        <div
          key="HnMemberadd"
          class="slide"
          v-if="currentShow === 'HnMemberadd'"
          @click="closeDialog($event)"
        >
          <dialog-hnmemberadd
            class="slide-content"
            :patient="editPatient"
            @success="memberAddSuccess"
            :is-component="true"
          ></dialog-hnmemberadd>
        </div>
      </transition>
    </el-col>
  </el-row>
</template>
<script>

import appointlist from '@/arrange/page/register/appointlist.vue'
import patientinfo from '@/arrange/page/register/patientinfo.vue'
import numbersource from '@/arrange/page/register/numbersource.vue'
import numberform from '@/arrange/page/register/numberinfo.vue'
import dialogAppoint from '@/arrange/page/register/dialog-registerlist.vue'
import dialogNumber from '@/arrange/page/register/dialog-numberlist.vue'
import dialogArrange from '@/arrange/page/register/dialog-arrange.vue'
import dialogCard from '@/arrange/page/register/dialog-cardlist.vue'
import dialogBindcard from '@/arrange/page/register/dialog-bindcard.vue'

import rcm from '@/workspace/page/reservation/rcm.vue'
import medicalInsurance from '@/workspace/page/reservation/paymentinfo'
import sendMessage from '@/crm/page/sendmessage'
import dialogMemberadd from '@/crm/page/memberadd'
import dialogHnmemberadd from '@/crm/page/hn/memberadd'
import { frPrint } from '@/util/common'
export default {
  data () {
    return {
      baseCode: 'thc_uo.patient_LNN_20180522',
      rcmVisible: false,
      insuranceVisible: false,
      showArrange: false,
      showBindCard: false,
      showBindList: false,
      selectDept: '',
      isMedicalInsurance: false,
      currentShow: '',
      settlementId: '',
      patientName: '',
      patient: '',
      newPatient: '',
      selectAppoint: {},
      source: '',
      sendPatient: [],
      editPatient: '',
      hnFlag: this.$ever.getClinicConfig().memberModel
    }
  },
  watch: {
    patient (val) {
      this.patientName = val.name
      if (!val.isSave) {
        this.editPatient = JSON.parse(JSON.stringify(val))
      }
      if ((!val.patientOrg || !val.patientOrg.outpatientNumber) && !val.isSave) {
        if (this.hnFlag === '2') {
          this.currentShow = 'HnMemberadd'
        } else {
          this.currentShow = 'memberAdd'
        }
      }
    }
  },
  created () {
    this.$bus.$off('appoint:settlementId')
    this.$bus.$off('appoint:rcmVisible')
    this.$bus.$on('appoint:settlementId', val => {
      this.settlementId = val.settlementId
      this.isMedicalInsurance = val.isMedicalInsurance
    })
    this.$bus.$on('appoint:rcmVisible', val => {
      if (this.isMedicalInsurance === 1) { // 判断是否医保卡
        this.insuranceVisible = true
      } else {
        this.rcmVisible = true
      }
    })
  },
  methods: {
    selectPatient (val) {
      this.patient = val
    },
    setAppoint (val) {
      this.selectAppoint = Object.assign({}, this.source, val)
    },
    setNewPatient (val) {
      this.$set(this.selectAppoint, 'patientName', val.name)
      this.$set(this.selectAppoint, 'patientId', val.id)
      this.$set(this.selectAppoint, 'patientSex', val.sex)
      this.$set(this.selectAppoint, 'patientAge', val.age)
      this.$set(this.selectAppoint, 'patientPhone', val.mobile)
      this.$set(this.selectAppoint, 'patient', val)
    },
    showSendMessage (val) {
      if (val.sendMessage) {
        this.sendPatient = val.patient
        this.$refs.sendmessage.sendVisible = true
      }
    },
    closeDialog (e) {
      if (e.target && e.target.className === 'slide') {
        this.currentShow = ''
      }
    },
    showArrangeDialog (val) {
      this.selectDept = val
      this.showArrange = true
    },
    memberAddSuccess (val) {
      if (val) {
        val.agebirthday = { age: val.age, birthday: val.birthday }
        this.patient = val
        this.patientName = val.name
      }
      this.currentShow = ''
      this.editPatient = ''
    },
    printPatient () {
      if (!this.patient) {
        this.$message('请选择患者')
        return false
      }
      frPrint(this.baseCode, { id: this.patient.id })
    }
  },
  components: {
    appointlist,
    patientinfo,
    numbersource,
    numberform,
    dialogAppoint,
    dialogNumber,
    dialogArrange,
    dialogCard,
    sendMessage,
    dialogBindcard,
    rcm,
    medicalInsurance,
    dialogMemberadd,
    dialogHnmemberadd
  }
}
</script>

<style scoped>
#register {
  height: calc(100vh - 95px);
  margin-top: 15px;
}
#register .el-form .el-form-item {
  margin-bottom: 0;
}
#register .left {
  width: 600px;
  overflow: auto;
  background: #fff;
  height: 100%;
  padding: 10px;
  border-radius: 3px;
}
#register .center {
  width: 60px;
  height: 100%;
  background: #f8f8f8;
  margin: 0 10px;
}
#register .center ul {
  list-style: none;
  padding: 20px 0;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #ddd;
}
#register .center ul li {
  cursor: pointer;
  margin-bottom: 5px;
}
#register .center ul li i.iconfont {
  font-size: 24px;
  color: #aaa;
}
#register .center ul li a {
  display: block;
  color: #666;
}
#register .center ul li label {
  display: block;
  padding: 8px;
  line-height: 1.5;
  font-size: 12px;
  cursor: pointer;
}
#register .center ul li:hover label,
#register .center ul li:hover i {
  color: #1c7bef;
}
#register .center ul li.on label,
#register .center ul li.on i {
  color: #1c7bef;
}
#register .right {
  height: 100%;
  overflow: auto;
  position: relative;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.slide-content {
  position: relative;
  height: calc(100% - 40px);
  background-color: #fff;
  overflow-y: auto;
  z-index: 999;
  padding: 20px;
  margin-right: 100px;
}
.everslide-enter,
.everslide-leave-to {
  transform: translateX(-100%);
}
.everslide-leave {
  transform: translateX(0);
}
.everslide-enter-active {
  transition: all 0.3s linear;
  transition-delay: 100ms;
}
.everslide-leave-active {
  transition: all 0.3s ease-in-out;
  transition-delay: 100ms;
}
</style>
