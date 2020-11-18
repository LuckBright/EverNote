<template>
  <div class="workspace_top_bar">
    <div class="top_bar clearfix">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item
          v-if="$hasPermission('Auth_menu_outdoctor_fast_file')"
          @click="fastFile"
          index="4"
        >{{$t('快速建档')}}</el-menu-item>
        <el-menu-item
          @click="intersectionAppointment"
          v-if="$hasPermission('Auth_menu_outdoctor_zjyy')"
          index="3"
        >{{$t('诊间预约')}}</el-menu-item>
        <el-menu-item
          @click="fastRegister"
          v-if="$hasPermission('Auth_menu_outdoctor_fast_register')"
          index="4"
        >{{$t('快速挂号')}}</el-menu-item>
        <el-submenu index="9" v-if="$hasPermission('Auth_menu_outdoctor_yjyy')">
          <template slot="title">{{$t('医技预约')}}</template>
          <el-menu-item
            index="9-1"
            @click="command('mzssyy')"
            :disabled="!$route.query || !$route.query.patientId"
            v-if="$hasPermission('Auth_menu_outdoctor_yjyy_mzssyy')"
          >{{$t('手术预约')}}</el-menu-item>
          <el-menu-item
            index="9-2"
            @click="command('jcyy')"
            v-if="$hasPermission('Auth_menu_outdoctor_yjyy_jcyy')"
          >{{$t('检查预约')}}</el-menu-item>
          <el-menu-item
            index="9-3"
            @click="command('zlyy')"
            v-if="$hasPermission('Auth_menu_outdoctor_yjyy_zlyy')"
          >{{$t('治疗预约')}}</el-menu-item>
        </el-submenu>
        <el-menu-item
          @click="command('xgyjxx')"
          v-if="$hasPermission('Auth_menu_outdoctor_xgyjxx')"
          index="3"
        >{{$t('修改预检')}}</el-menu-item>
        <el-submenu index="4" v-if="$hasPermission('Auth_menu_outdoctor_mjzrysq')">
          <template slot="title">{{$t('门急诊入院')}}</template>
          <el-menu-item :disabled="!$route.query || !$route.query.patientId" index="4-1" @click="command('intersectionAppointment')">{{$t('入院申请')}}</el-menu-item>
          <el-menu-item index="4-2" @click="command('admissionApplication')">{{$t('入院患者管理')}}</el-menu-item>
        </el-submenu>
        <el-submenu index="5" v-if="$hasPermission('Auth_menu_outdoctor_crbsb')" :disabled="!$route.query || !$route.query.patientId">
          <template slot="title">{{$t('传染病上报')}}</template>
          <el-menu-item index="5-1" @click="command('crbsbk')">{{$t('传染病上报卡')}}</el-menu-item>
          <el-menu-item index="5-2" @click="command('crbsbgl')">{{$t('传染病上报管理')}}</el-menu-item>
        </el-submenu>
        <el-menu-item index="10" v-if="$hasPermission('Auth_menu_outdoctor_zmjl')">
          <el-popover
            popper-class="wid13"
            ref="popproof"
            placement="bottom"
            trigger="click"
            @show="openProofRecord"
          >
            <proof-record ref="proofRecord" @handle-click="handleClick"></proof-record>
            <div slot="reference" v-if="$hasPermission('Auth_menu_outdoctor_zmjl')">{{$t('证明记录')}}</div>
          </el-popover>
        </el-menu-item>
        <el-submenu index="6" v-if="$hasPermission('Auth_menu_outdoctor_pgdsb')">
          <template slot="title">{{$t('评估单上报')}}</template>
          <el-submenu index="6-3" :disabled="!$route.query || !$route.query.patientId">
            <template slot="title">{{$t('评估单上报卡')}}</template>
            <el-menu-item index="6-3-1" @click="command('sndsqspgd')">{{$t('受虐待受歧视评估单')}}</el-menu-item>
            <el-menu-item index="6-3-2" @click="command('xdpgd')">{{$t('吸毒评估单')}}</el-menu-item>
            <el-menu-item index="6-3-3" @click="command('xjpgd')">{{$t('酗酒评估单')}}</el-menu-item>
            <el-menu-item index="6-3-4" @click="command('etpgd')">{{$t('儿童评估单')}}</el-menu-item>
            <el-menu-item index="6-3-5" @click="command('crpgd')">{{$t('成人评估单')}}</el-menu-item>
          </el-submenu>
          <el-menu-item index="6-2" @click="command('pgdsbgl')">{{$t('评估单上报管理')}}</el-menu-item>
        </el-submenu>
        <el-menu-item
          v-if="$hasPermission('Auth_menu_outdoctor_tcxs')"
          @click="establish"
          index="7"
        >{{$t('套餐下单')}}</el-menu-item>
        <el-menu-item
          v-if="$hasPermission('Auth_menu_outdoctor_wckz')"
          :disabled="!$route.query || !$route.query.patientId"
          @click="completeDiagnose"
          index="3"
        >{{$t('完成看诊')}}</el-menu-item>
        <el-menu-item
          v-if="$hasPermission('Auth_menu_outdoctor_addflolow')"
          :disabled="!$route.query || !$route.query.patientId"
          @click="addflolow"
          index="3"
        >{{$t('添加随访')}}</el-menu-item>
        <el-menu-item
          :disabled="!jiezhenPatientObj.patientId"
          v-if="$hasPermission('Auth_menu_outdoctor_jiezhen')"
          @click="jiezhen"
          index="3"
        >{{$t('接诊')}}</el-menu-item>
        <el-menu-item
          v-if="$hasPermission('Auth_menu_outdoctor_cancel_admission')"
         :disabled="!$route.query || !$route.query.patientId"
          @click="cancelAdmission"
          index="3"
        >{{$t('取消接诊')}}</el-menu-item>
      </el-menu>
    </div>
    <dialog-visit-plus ref="VisitPlus"></dialog-visit-plus>
    <dialog-admission-application ref="admissionApplication" @modify="modifyAdmissionApplication"></dialog-admission-application>
    <dialog-inhospital ref="inhospitalref_modify" :key="keys + 'inhospital'" @establish="establish"></dialog-inhospital>
    <add-appoint
      ref="addappoint"
      :key="addAppointKey"
      @numberList="numberList"
      :show.sync="showAddAppoint"
      :init="addAppointInit"
      :customer-service="false"
    ></add-appoint>
    <send-message ref="sendmessage" :users="sendPatient" :disabled="true" :allparams="allparams"></send-message>
    <el-dialog title="传染病上报管理" :visible.sync="infectedquerydislog" width="1240px" class="crbsb">
      <infectedquery :differentSelect="true" :noStoreQuery="true"></infectedquery>
    </el-dialog>
    <phrform-dialog
      :dataId="dataId"
      :title="phrform.title"
      :tplCode="phrform.code"
      ref="phrformdialog"
      @success="success"
      class="dialog-force-1000"
      :nosubmit="true"
    >
      <div slot="dialogFooter" class="pr20">
        <el-checkbox v-if="phrform.code != 'yu_jian_bing_li'" v-model="checkprint" label="打印"></el-checkbox>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </phrform-dialog>
    <eform-mgt ref="eformmgt"></eform-mgt>
    <addfollowup
      ref="addfollowup"
      :patientIds="this.patientIds"
      :visible="addfollowupVisible"
      @update="addfollowupVisible = false"
      @close="addfollowupVisible = false"
    ></addfollowup>
    <establish-package-order
      :dialogVisible.sync="paydialogVisible"
      :isNoPay="true"
      :schemaVal="schemaVal"
      :initoptions="options"
      :isDelivery="isDelivery"
      @establishCallback="establishCallback"
      :patient="userBase"
      :key="keys + 'order'"
    ></establish-package-order>
    <dialog-inspect  v-if='openName =="inspect"' :show.sync="isShowAddInspect" :type="appointType" :scene="1" :patient="userBase"></dialog-inspect>
    <dialog-addfollow ref="Addfollow" :isInterclinic="true" :isMember="false"></dialog-addfollow>
    <dialog-register-fast
    :show.sync="isFastRegister"
    :dept="{deptId: currentParams.deptId, deptName: currentParams.deptName}"
    :resource="{resourceId: currentParams.resourceId, resourceName: currentParams.resourceName}"
    :service="{serviceId: currentParams.serviceId, serviceName: currentParams.serviceName}"
    >
    </dialog-register-fast>
    <addcsa ref='addcsa'></addcsa>
    <createarchivesdialog ref='createarchivesdialog' pageType='2'></createarchivesdialog>
  </div>
</template>

<script>
import createarchivesdialog from '@/crm/components/createarchivesdialog.vue'
import recipeapi from '@/workspace/store/recipeapi'
import triageapi from '@/arrange/store/triageapi'
import api from '../store/mainheaderapi'
import addAppoint from '@/arrange/page/register/addappoint.vue'
import addcsa from '@/csa/components/addcsa.vue'
import sendMessage from '@/crm/page/sendmessage'
import phrapi from '@/inpatient/store/phr.js'
import storage from '@/util/storage.js'
import dialogInhospital from './dialog-inhospital'
import dialogAdmissionApplication from '@/workspace/components/dialog-admission-application'
import dialogVisitPlus from '@/workspace/components/dialog-visit-plus'
import infectedquery from '@/inpatient/page/infectedquery.vue'
import phrformDialog from '@/form/components/phrform.dialog.vue'
import establishPackageOrder from '@/crm/page/packagesale/establishpackageorder'
import { everprint } from '@/util/print'
import eformMgt from '@/workspace/components/eform.mgt.vue'
import followapi from '@/crm/store/healthy/followapi.js'
import addfollowup from '@/crm/page/healthy/dialog.addfollowup.vue'
import { setTimeout } from 'timers'
import dialogInspect from '@/arrange/page/appoint/dialog-addinspect.vue'
import proofRecord from '@/workspace/components/proofrecord'
import { on, off } from '@/util/dom'
import dialogAddfollow from '@/follow/page/template/dialog-addfollow.vue'
import dialogRegisterFast from '@/arrange/page/appoint/dialog-register-fast'
export default {
  props: ['width'],
  components: {
    dialogRegisterFast,
    dialogAddfollow,
    dialogInhospital,
    dialogInspect,
    dialogAdmissionApplication,
    dialogVisitPlus,
    addAppoint,
    sendMessage,
    infectedquery,
    phrformDialog,
    eformMgt,
    addfollowup,
    establishPackageOrder,
    proofRecord,
    createarchivesdialog,
    addcsa
  },
  destroyed () {
    this.$bus.$off('global:patientInfo_to_top_bar', this.patient)
  },
  created () {
    this.$bus.$off('global:workspace_top_bar')
    this.$bus.$on('global:workspace_top_bar', val => {
      this.fullObj = val
    })
    this.$bus.$off('queuecall')
    this.$bus.$on('queuecall', val => {
      this.jiezhenPatientObj = val
    })
    this.$bus.$on('menzhen:crg', patient => {
      this.checkprint = false
      this.phrform.code = 'CHUAN_RAN_BING_BAO_GAO_KA_MEN'
      this.phrform.title = '传染病上报卡'
      this.$refs.phrformdialog.open()
    })
    this.$bus.$on('form:handMessage', v => {
      this.allparams = v
      this.allparams.msgType = 108
      if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
        this.$refs.sendmessage.sendVisible = true
      }
    })
    this.$bus.$on('workspace:checkIsEncounterByVisitNumber', this.checkIsEncounterByVisitNumber)
  },
  mounted () {
    this.$bus.$on('global:patientInfo_to_top_bar', this.patient)
  },
  data () {
    return {
      openName: '',
      establishuserBase: {},
      triageapi,
      fullObj: {},
      followapi,
      saoma_input: '',
      allparams: '',
      establishPatient: {},
      userBaseModify: {},
      appointType: 2,
      addAppointInit: {
        patient: {
          id: this.$route.query.patientId
        }
      },
      userBase: {
        id: (this.$route.query && this.$route.query.patientId) || '',
        name: (this.$route.query && this.$route.query.patientName) || ''
      },
      showAddAppoint: false,
      sendPatient: '',
      infectedquerydislog: false,
      phrform: {
        code: '',
        title: ''
      },
      keys: 0,
      checkprint: false,
      paydialogVisible: false,
      options: {
        zfzt: [
          { id: '', name: '全部' },
          { id: '1', name: '已付' },
          { id: '2', name: '未付' },
          { id: '3', name: '部分支付' }
        ],
        tf: [
          { id: '', name: '全部' },
          { id: '1', name: '未退费' },
          { id: '2', name: '全部退费' },
          { id: '3', name: '部分退费' }
        ],
        xsbm: [],
        xsy: []
      },
      zenjianyuyue: false,
      addAppointKey: '',
      dataId: '',
      schemaVal: {
        channelType: '1',
        saleMan: window.localStorage.getItem('USERID')
      },
      addfollowupVisible: false,
      patientIds: {},
      patientObj: {},
      isEncounterByVisitNumber: true,
      popover: false,
      getPatientDisabled: false,
      jzPatientObj: {},
      jzShow: false,
      nextDisabled: false,
      isDelivery: false,
      dptId: this.$route.query.dptId || this.$route.query.providerId,
      jiezhenPatientObj: {},
      isShowAddInspect: false,
      isFastRegister: false,
      currentParams: {},
    }
  },
  watch: {
    '$route.query': {
      handler (val) {
        this.dptId = this.$route.query.dptId || this.$route.query.providerId
        this.jzShow = false
        this.checkIsEncounterByVisitNumber()
        this.userBase.id = this.$route.query && this.$route.query.patientId || ''
        this.userBase.name = this.$route.query && this.$route.query.patientName || ''
      },
      immediate: true
    }
  },
  methods: {
    fastFile () {
      this.$refs.createarchivesdialog.open()
    },
    async checkCancelAdmission () {
      // 查询已提交打印数据
      let res = await recipeapi.queryHasValidAdvice({ visitNumber: this.$route.query.visitSn })
      return res && res.data
    },
    async cancelAdmission () {
      if (!(await this.checkCancelAdmission())) {
        let res = await api.cancelTreatment({visitNumber: this.$route.query.visitSn})
        if (res && res.head && res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '取消接诊成功',
            type: 'success'
          })
          storage.removeSessionStorage('outpatientUrlParams')
          this.$router.push({
            path: this.$route.path
          })
        }
      } else {
        this.cancleStatus = false
        this.$notify({
          title: '提示',
          message: '存在尚未处理医嘱，暂时无法取消接诊',
          type: 'info'
        })
      }
    },
    fastRegister () {
      let str = localStorage.getItem('workspaceKey')
      let arr = str.split(',')
      this.currentParams = {
        deptId: arr[0],
        deptName: arr[1],
        resourceId: this.$store.state.currentUser.userId,
        resourceName: this.$store.state.currentUser.name,
      }
      this.isFastRegister = true
    },
    patient (patient) {
      if (patient && patient.id && patient.name) {
        patient.birthday = this.$moment(patient.birthday).format('YYYY-MM-DD')
        this.userBase = JSON.parse(JSON.stringify(patient))
      }
    },
    async jiezhen () {
      if (!this.jiezhenPatientObj.patientId) return
      let res = await api.treatment({
        'tenantDeptId': this.jiezhenPatientObj.tenantDeptId,
        'resourceType': 'register',
        'resourceId': this.$store.state.currentUser.userId,
        'callType': 'waiting',
        'triageId': this.jiezhenPatientObj.triageId,
        'apptId': this.jiezhenPatientObj.appointmentId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.isEncounterByVisitNumber = true
        this.$notify({
          title: '成功',
          message: '接诊成功',
          type: 'success'
        })
        this.$bus.$emit('refresh_hois_list', 'jiezhen')
        this.jiezhenPatientObj.tabIndex = 0 // 接诊患者是从候诊队列来
        this.$bus.$emit('todayClick', this.jiezhenPatientObj)
        this.jiezhenPatientObj = {}
      }
    },
    addflolow () {
      this.$refs.Addfollow.open({
        providerId: this.$route.query.dptId,
        providerName: this.$route.query.dptName,
        visitNumber: this.$route.query.visitSn,
        patientId: this.$route.query.patientId
      })
    },
    async completeDiagnose () {
      if (this.$route.query.patientId) {
        let res = await api.completeDiagnose({
          visitNumber: this.$route.query.visitSn
        })
        if (res && res.data && res.data.checkResultVO) { // http://doc.everjiankang.com/pages/viewpage.action?pageId=32670611
          res.data.checkResultVO = res.data.checkResultVO || {}
          let result = res.data.checkResultVO
          if (!result.passed) {
            this.$messageTips(this, 'error', this.$t(result.message))
          } else {
            if (res && res.head && res.head.errCode === 0) {
              this.$router.push({
                path: this.$route.path,
                query: {}
              })
              this.$messageTips(this, 'success', this.$t('完成看诊成功'), this.$t('成功'))
            }
          }
        }
      }
    },
    off () {
      off(document, 'click', this.$refs.popproof.handleDocumentClick)
    },
    on (e) {
      on(document, 'click', this.$refs.popproof.handleDocumentClick)
    },
    handleClick (type = 'off') {
      this[type]()
    },
    ls800 (adviceType) {
      let obj = { 'serviceType': adviceType, 'provider': { 'id': '1', 'name': '1' }, 'section': { 'id': '1', 'name': '1' }, doctorId: this.$store.state.currentUser.userId }
      localStorage.setItem('tech_value', JSON.stringify(obj))
      let router = `${this.$ever.infusionIndex}/tech/main/${adviceType}?patientId=${this.$route.query.patientId}&visitNumber=${this.$route.query.visitSn}`
      window.open(router, '_blank')
    },
    openProofRecord () {
      this.$refs.proofRecord.refresh()
    },
    async medicalServiceFee () {
      let rr = await phrapi.getSobConfigDetailById({ 'id': '89' })
      if (rr.value === '1') {
        let res = await api.queryHospitalAdviceByHospitalNumber({
          visitSn: this.$route.query.visitSn,
          adviceType: ['799'],
          status: 1,
          visitType: 1
        })
        if (res.data && res.data.length === 0) {
          this.$confirm('看诊中需包含医事服务费，请开具医事服务费后进行结诊！', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          })
        } else {
          // this.gameover()
        }
      } else {
        // this.gameover()
      }
    },

    async checkIsEncounterByVisitNumber () {
      if (!this.$route.query.triageId) return
      let res = await api.checkIsEncounterByVisitNumber({
        triageId: this.$route.query.triageId
      })
      this.isEncounterByVisitNumber = res.data.isEncounter === 1
    },
    eopSendMessage (val, startTimeStr) {
      this.allparams = {
        msgType: 108,
        hosName: val.patient.orgName,
        appointTime: this.$moment(val.appointmentDate + ' ' + startTimeStr).format('YYYY年MM月DD日 HH:mm'),
        phoneNumber: val.patient.mobile,
        patientName: val.patient.name
      }
      if (val.isSendMessage) {
        this.$refs.sendmessage.sendVisible = true
      }
    },
    success (val) {
      if (this.checkprint) {
        everprint(this.phrform.code, {
          id: val.id,
          visitId: this.$route.query.visitSn,
          patientId: this.$route.query.patientId
        }, {preview: true})
      }
    },
    save () {
      this.$refs.phrformdialog.$refs.form.save()
      if (this.phrform.code === 'yu_jian_bing_li') {
        setTimeout(_ => {
          this.$bus.$emit('commenHeadRefresh')
        }, 1000)
      }
    },
    appointmentBoard () {
      let router = this.$ever.kanbanIndex + '/kanban/service'
      window.open(router, '_blank')
    },

    visitPlus () { // 诊间加号
      this.$refs.VisitPlus.open()
    },
    numberList ({ patient }) {
      if (!this.zenjianyuyue) {
        return
      }
      this.zenjianyuyue = false
      this.$refs.addappoint.handleCurrentChange({
        patient
      })
    },
    intersectionAppointment () { // 诊间预约
      let params = this.$route.query
      let arrStr = []
      for (let key in params) {
        if (params[key]) {
          arrStr.push(key + '=' + params[key])
        }
      }
      let urlParams = arrStr.length > 0 ? '?' + arrStr.join('&') : ''
      window.open(this.$ever.kanbanIndex + '/kanban/appointpanel' + urlParams, '_blank')
    },
    openAdmissionApplication () { // 入院患者管理
      this.$refs.admissionApplication.open()
    },
    openNameFn (name, cb) {
      this.openName = name
      this.$nextTick(_ => {
        if (cb)cb()
      })
    },
    command (command) {
      let code, title
      this.dataId = '-1'
      if (command === 'intersectionAppointment') this.modifyAdmissionApplication()
      if (command === 'mzssyy') {
        // this.appointType = 4
        this.$refs.addcsa.open(this.$route.query, 'yihu')
        // this.openNameFn('inspect', _ => { this.isShowAddInspect = true })
      }
      if (command === 'admissionApplication') this.openAdmissionApplication()
      if (command === 'pgdsbgl') this.$refs.eformmgt.open()
      if (command === 'jcyy') {
        this.appointType = 2
        this.openNameFn('inspect', _ => { this.isShowAddInspect = true })
      }
      if (command === 'zlyy') {
        this.appointType = 3
        this.openNameFn('inspect', _ => { this.isShowAddInspect = true })
      }
      if (!this.dptId) return
      if (command === 'crbsbgl') this.infectedquerydislog = true
      if (command === 'crbsbk') { code = 'CHUAN_RAN_BING_BAO_GAO_KA_MEN'; title = '传染病上报卡' } // 传染病上报卡
      if (command === 'sndsqspgd') { code = 'SHOU_NUE_DAI_SHOU_QI_SHI_REN_QUN'; title = '受虐待受歧视评估单' } // 受虐待受歧视评估单
      if (command === 'xdpgd') { code = 'XI_DU_PING_GU_DAN'; title = '吸毒评估单' } // 吸毒评估单
      if (command === 'xjpgd') { code = 'XU_JIU_PING_GU_DAN'; title = '酗酒评估单' } // 酗酒评估单
      if (command === 'etpgd') { code = 'ER_TONG_HUAN_ZHE_PING_GU_DAN'; title = '儿童评估单' } // 儿童评估单
      if (command === 'crpgd') { code = 'CHENG_REN_HUAN_ZHE_PING_GU_DAN'; title = '成人评估单' } // 成人评估单
      if (command === 'xgyjxx') { code = 'yu_jian_bing_li'; title = '修改预检信息'; this.dataId = '' } // 修改预检信息
      if (code && title) {
        this.checkprint = false
        this.phrform.code = code
        this.phrform.title = title
        this.$refs.phrformdialog.open()
      }
    },
    modifyAdmissionApplication (data = {}) { // 入院患者修改信息
      // this.keys++
      this.$refs.inhospitalref_modify.opens({
        patientId: data.patientId || this.$route.query.patientId,
        visitSn: data.visitSn || data.visitNumber || this.$route.query.visitSn,
        id: data.id
      })
    },
    establish (inhospital, obj) {
      this.isDelivery = false
      // let obj = this.fullObj.patient || {}
      if (inhospital === 'inhospital') {
        obj = obj || {}
        this.isDelivery = true
        Object.assign(this.userBase, obj)
      }
      this.$nextTick(_ => {
        this.paydialogVisible = true
      })
    },
    establishCallback () {
      this.paydialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.phrform-bottom {
  border-top: 1px solid #ccc;
  padding: 6px 0;
  .elcol {
    float: right;
  }
}
.el-popover {
  padding: 10px;
}
.nextcontent {
  font-size: 14px;
  min-width: 250px;
  padding: 0px 20px 0px 10px;
  .callCustomer {
    color: #333;
    font-weight: 800;
    line-height: 30px;
    span {
      font-size: 12px;
    }
  }
  .noCustomer {
    color: #666;
    line-height: 35px;
  }
  .active {
    height: 30px;
    line-height: 30px;
    width: 40px;
    position: relative;
    right: 0px;
  }
}
.workspace_top_bar {
  position: relative;
  // line-height: 40px;
  background: #fff;
  margin: -10px -10px 5px;
  .top_bar {
    line-height: 40px;
    .gamestart {
      &:focus {
        outline: none;
      }
      .is-disabled {
        background: #ccc;
        color: #333;
        cursor: not-allowed;
        border-color: #ccc;
      }
    }
    .gamestart,
    .next {
      float: right;
      margin-right: 10px;
    }
    .next {
      margin: 10px 10px 8px 0;
      height: 24px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      .el-dropdown {
        float: left;
        background: #1c7bef;
        height: 25px;
        line-height: 23px;
        .el-button {
          padding: 5px 6px;
        }
      }
      .call {
        font-size: 12px;
        color: #fff;
        text-indent: 11px;
        width: 40px;
        line-height: 25px;
        cursor: pointer;
      }
      .disabled {
        background: #ccc;
        color: #333;
        cursor: not-allowed;
      }
      & > span {
        height: 25px;
        line-height: 23px;
        background: #1c7bef;
        float: left;
      }
      b {
        height: 12px;
        width: 1px;
        background: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: 6px;
        left: 60%;
        z-index: 2;
      }
    }
    .changeType {
      float: right;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
      outline: none;
      i {
        font-size: 14px;
        vertical-align: middle;
      }
    }
    .el-menu {
      .el-submenu__icon-arrow .el-icon-arrow-down {
        margin-left: 5px;
      }
      /deep/ .el-menu-item,
      /deep/ .el-submenu__title {
        padding: 0 10px !important;
        color: #000 !important;
        &:hover {
          color: #1c7bef !important;
        }
        // font-size: 12px;
      }
      /deep/ .el-submenu{
        /deep/ .el-submenu__title{
          &:hover {
            color: #000 !important;
          }
        }
      }
    }
    padding: 0 10px;
    .el-menu-demo {
      background: #fff;
      width: calc(100% - 210px);
      float: left;

      li,
      .el-submenu__title {
        height: 40px;
        line-height: 40px;
      }
      .is-active {
        border-bottom-color: transparent;
        .el-submenu__title {
          border-bottom-color: transparent;
        }
      }
    }
    .el-menu--horizontal {
      border-bottom: none;
    }
    .el-input__inner {
      background: #fff;
    }
    .el-input {
      font-size: 12px;
    }
    .input {
      width: 210px;
      float: left;
      &::placeholder {
        font-size: 12px;
      }
    }
    .el-input__inner {
      height: 30px;
    }
  }
}
.crbsb {
  .el-dialog__body {
    max-height: 650px;
    overflow-y: scroll;
  }
}
.wid13 {
  width: 1300px;
}
.workspace_top_bar /deep/ .el-menu--horizontal {
  > .el-submenu {
    .el-submenu__title {
      height: 40px !important;
      line-height: 40px !important;
    }
  }
  .el-menu-item{
    &:hover {
      color: #1c7bef !important;
    }
  }
}
.el-menu--horizontal {
  .el-menu{
    .el-menu-item{
      &:hover {
        color: #1c7bef !important;
      }
    }
  }
}
</style>
