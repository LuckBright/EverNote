<template>
  <div>
    <el-alert
      v-if="patient && $route.query.patientId"
      :title="'为客户  ' + patient.name + '  预约下次服务'"
      center
      type="warning"
      style="font-size: 16px;"
      @close="resetPannel"
      effect="dark">
    </el-alert>
    <div id="appointheader" class="clearfix">
      <div class="fl">
        <el-date-picker
          :editable="false"
          :clearable="false"
          :disabled="isEditMessage"
          v-model="params.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="fl">
        <div class="datepicker hide">
          <span :class="{today: item.value === $moment().format('YYYY-MM-DD'), on: item.value === params.date}" v-for="(item, i) in datePicker" :key="i" @click="setCurrentDate(item.value)">{{item.value === $moment().format('YYYY-MM-DD') ? '今天': item.date}}<br>{{item.week}}</span>
        </div>
      </div>
      <div class="fl">
        <el-select v-model="selectCity" @change="changeCity" placeholder="城市" value-key="cityCode" style="width:100px">
          <el-option
            v-for="(item, i) in orgCityList"
            :key="i"
            :value="item"
            :label="item.cityName"
          ></el-option>
        </el-select>
        <el-select v-model="selectOrgan" placeholder="机构" value-key="id" :disabled="isEditMessage" @change="changeOrgan" style="width:200px">
          <el-option
            v-for="(item, i) in orgItemList"
            :key="i"
            :value="item"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-select v-model="params.deptIds" multiple collapse-tags placeholder="所有科室" @change="changeDept" filterable  style="width:220px">
          <el-option
            v-for="(item, i) in deptList"
            :key="i"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="params.resourceIds" multiple collapse-tags placeholder="所有医生" filterable  style="width:220px">
          <el-option
            v-for="item in doctorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="fr">
        <div style="width:300px; position: relative; z-index: 1000">
          <todo-editor style="position: absolute; right: 0; top: 0;" @updateEditor="setIsEditMessage" :listDate="params.date" :is-open="false" :clinic="{'id': selectOrgan.id, 'name':  selectOrgan.name}" :pageType="2"></todo-editor>  
        </div>
      </div>
    </div>
    <div id="appointpanel" class="mainbox">
      <div class="lefttop">
        <table>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="mainheader" ref="header">
        <table>
          <tr>
            <template v-for="(days, i) in appointList">
              <td :key="i" v-if="days.deptDayApptsVOS[0]" align="center" :class="{deepblue: days.dateStr === params.date}" :colspan="getDaysSpanLen(days.deptDayApptsVOS)"><span>{{days.dateStr}}</span></td>
            </template>
          </tr>
          <tr>
            <template v-for="(days, i) in appointList">
              <td v-for="(item, j) in days.deptDayApptsVOS" :key="i+'-'+j" :class="{gray: i % 2 === 0}" :colspan="getDeptSpanLen(item.everyDoctorDayApptsVOS)">
                <div class="block">
                  <span>{{item.deptName}}</span>
                  <dialog-dept :id="item.deptId" :name="item.deptName" :icon="true"></dialog-dept>
                </div>
              </td>
            </template>
          </tr>
          <tr>
            <td :class="{gray: j % 2 > 0}" v-for="(doctor, j) in appointServiceList" :key="j">
              <div class="block">
                <span v-if="doctor.resourceId">{{doctor.resourceName || '科室号'}}</span>
                <span>({{doctor.serviceName}})</span>
                <dialog-doctor v-if="doctor.resourceName" :params="{date: doctor.dateStr, organId: doctor.organId, deptId: doctor.deptId, resourceId: doctor.resourceId, serviceId: doctor.serviceId}"></dialog-doctor>                
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="maintable" @scroll="handleScroll" id="main">
        <div class="blackarea" ref="blackarea">
          <table ref="blacktable">
            <tr v-for="row of 102" :key="row" :class="{line: row % 6 === 0}">
              <td
                v-for="(doctor, j) in appointServiceList"
                :class="{white: doctor.timeTrunkTimeIndexs.includes(row -1)}"
                :key="j">
              </td>
            </tr>
            <tr>
              <td v-for="(doctor, j) in appointServiceList" :key="j"></td>
            </tr>
          </table>
          <div class="current-time-line" :style="redLineStyle" v-if="params.date === $moment().format('YYYY-MM-DD')"></div>
        </div>
        <div class="drawarea" style="z-index: 100">
          <table>
            <tr>
              <td v-for="(doctor, j) in appointServiceList" :key="j">
                <div class="drawcol">
                  <div class="drawblock" :style="selectPoint[j]" v-if="isDown"></div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="drawarea" style="z-index: 101">
          <table>
            <tr>
              <td v-for="(doctor, j) in appointServiceList" :key="j" class="drawtd">
                <div class="drawcol" v-select="j">
                  <template v-for="(appoints, a) in doctor.overlapAppointmentList">
                    <template v-if="appoints.appointmentVOList.length < 10">
                      <div
                        v-for="(appoint, b) in appoints.appointmentVOList"
                        class="appoint"
                        :class="'style-' + appoint.showStyle"
                        :style="Object.assign({}, appoint.point)"
                        :key="j + '-'+ a + '-' + b">
                          <div class="info confirm">
                            <strong>{{appoint.startTimeStr}} {{appoint.patientName}}</strong>
                            <p>{{appoint.symptom}}</p>
                            <i>{{appoint.apptType === 1 ? '约' : '挂'}}</i>
                            <i class="bao" v-if="appoint.insuranceType">保</i>
                          </div>
                          <appointinfo class="appointhack" :appoint-id="appoint.id" :patient="patient" @patient="checkPatient"></appointinfo>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="appoint"
                        :style="appoints.point"
                        :key="j + '-'+ a + '-' + 1">
                          <div class="info confirm">
                            <strong>{{appoints.minStartTimeStr}} 共 {{appoints.appointmentVOList.length}} 人</strong>
                          </div>
                          <div class="appointhack" @click="setCurrentMore(appoints.appointmentVOList, 'more')"></div>
                      </div>
                    </template>
                  </template>
                  <template v-if="doctor.resourceLockingVOList">
                    <div class="appointlock" :style="getlockPoint(lock, i)" v-for="(lock, i) in doctor.resourceLockingVOList" :key="'lock-' + j + '-' + i ">
                      <div class="info">
                        <strong v-if="!lock.asstAppoint"><i class="iconfont icon-password"></i><label class="ml5">{{lock.lockStartTimeStr + ' 需 ' + lock.timeLength + ' min'}}</label></strong>
                        <p v-if="!lock.asstAppoint">{{lock.description}}</p>
                      </div>
                      <lockinfo :data="lock" class="appointhack"></lockinfo>
                    </div>
                  </template>
                  <template v-if="doctor.cancelAppointmentList">
                    <div class="appointcannel" :style="getCannelPoint(data, i)" v-for="(data, i) in doctor.cancelAppointmentList" :key="'cancel-' + j + '-' + i" @click="setCurrentMore(data.appointmentVOList, 'cancel')"></div>
                  </template>
                  <div class="drawblock" :style="selectPoint[j]" v-show="!isDown" v-drag="j" :key="j">
                    <div class="head" v-drawhead="j" v-if="parseInt(selectPoint[j].top) > 0"></div>
                    <addappoint
                      @patient="checkPatient"
                      @hide="hidePopover"
                      @close="closePopover"
                      @reset="resetPatient"
                      @timeupdate="resetDrawArea"
                      :open-scene="isOpenScene"
                      :patient="patient"
                      :edit-appoint="currentAppoint"
                      :is-show="selectPoint[j].display"
                      :is-click="isClick"
                      :show-type="selectPoint[j].type"
                      :organ="{organId: doctor.organId, organName: doctor.organName}"
                      :dept="{deptId: doctor.deptId, deptName: doctor.deptName}"
                      :resource="{resourceId: doctor.resourceId, resourceName: doctor.resourceName}"
                      :service="{serviceId: doctor.serviceId, serviceName: doctor.serviceName}"
                      :date="doctor.dateStr"
                      :start-time="selectPoint[j].startTime"
                      :time-length="selectPoint[j].timeLen">
                    </addappoint>
                    <div class="foot" v-drawfoot="j" v-if="parseInt(selectPoint[j].top) + parseInt(selectPoint[j].height) < 2038"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="lefttime" ref="left">
        <table>
          <tr>
            <td><span>07:00</span></td>
          </tr>
          <tr v-for="i of 102" :key="i">
            <td>
              <span :class="{small: !timeLine[i-1].isIntNumber}">{{timeLine[i-1].time}}</span>
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </table>
      </div>
      <select-patient :show.sync="isShowSelectPaitent" :name="patientName" @select="selectPatient"></select-patient>
      <send-message2
        ref="sendmessage"
        :data="allparams"
      ></send-message2>
    </div>
    <div class="editmodel" v-if="currentAppoint && currentAppoint.patient">
      <span>为患者{{currentAppoint.patient.name}} {{$moment(currentAppoint.dateStr).format('MM月DD日')}} {{currentAppoint.startTimeStr}}分 在 {{currentAppoint.deptName}} {{currentAppoint.resourceName}}医生 的预约 选择新的预约</span>
      <el-button size="small" @click="cannelEditModel">取消编辑</el-button>
    </div>
    <appointmore :data="currentMore" :visible.sync="isShowMore" :type="moreType"></appointmore>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="yzsobj"
      @payStatus="payStatus"
      @closedialog="closePayDialog"
    ></paymethodstwo>
  </div>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import addappoint from '@/arrange/page/appoint/addappoint.vue'
import appointinfo from '@/arrange/page/appoint/appointinfo.vue'
import appointmore from '@/arrange/page/appoint/appointmore.vue'
import lockinfo from '@/arrange/page/appoint/lockinfo.vue'
import selectPatient from '@/arrange/page/appoint/selectpatient.vue'
import dialogDoctor from '@/arrange/page/appoint/dialog-doctor.vue'
import dialogDept from '@/arrange/page/reservation/deptinfo.vue'
import storage from '@/util/storage'
import todoEditor from '@/components/todoeditor/todoeditor'
import sendMessage2 from '@/crm/page/sendmessage2'
import { everprint } from '@/util/print'
export default {
  data () {
    return {
      api,
      storage,
      weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datePicker: [],
      list: '',
      appointList: [],
      appointDeptList: [],
      appointServiceList: [],
      allDoctorList: [],
      doctorList: [],
      selectPoint: [],
      timeLine: [],
      orgItemList: [],
      orgCityList: [],
      deptList: [],
      isOpenScene: true,
      isClick: false,
      isDown: false,
      isShowSelectPaitent: false,
      isShowDraw: true,
      isShowMore: false,
      isEditMessage: false,
      payVisible: false,
      currentAppoint: '',
      currentPatient: '',
      currentMore: '',
      currentTarget: '',
      moreType: '',
      startPoint: '',
      currentPoint: {x: 0, y: 0, show: false},
      selectCity: '',
      selectOrgan: '',
      drwaBlockStyle: '',
      patientName: '',
      patient: '',
      redLineStyle: '',
      servicePrice: 0,
      allparams: {},
      params: {
        organId: '',
        date: this.$moment().format('YYYY-MM-DD'),
        deptIds: [],
        resourceIds: []
      },
      colHeight: 0,
      yzsobj: {
        iscallback: true, // 外层loading
        loading: false,
        patientid: '', // 患者id
        id: '', // 结算单id
        orderId: '', // 订单ID
        settleCode: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '4', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
        paymethodArr: [], // 支付方式
        isValited: false, // 押金是false,费用为true
        isDeposit: 0, // 是否押金(押金传1)
        isRefund: false,  // 是否退费(退费传true)
        isChange: false,
        visitNumber: '',
        medInsurPubPayFee: '',
        medInsurOwnPayFee: ''
      },
      payAction: ''
    }
  },
  watch: {
    'params': {
      handler (val) {
        this.startPoint = ''
        if (!val.date) {
          return false
        }
        if (val.organId) {
          this.getAppointData()
        }
      },
      deep: true
    },
    'selectCity' () {
      this.getOrgList()
    },
    'selectOrgan': {
      handler (val) {
        this.deptList = val.tenantSubjectList.map(item => {
          return {
            id: item.tenantSubjectCode,
            name: item.tenantSubjectName
          }
        })
        this.params.organId = val.id
        if (this.$route.query.dptId) {
          this.params.deptIds = [this.$route.query.dptId]
        }
        if (this.$route.query.doctorId) {
          this.params.resourceIds = [this.$route.query.doctorId]
        }
        this.storage.setCookie('APPOINT_CLINICID', val.id)
      },
      deep: true
    },
    'params.deptIds' (val) {
      this.getResourceList()
      // this.params.resourceIds = []
    },
    'isShowMore' (val) {
      if (!val) {
        this.currentMore = ''
      }
    },
    '$route.query.patientId' (val) {
      this.setCurrentPatient()
    }
  },
  created () {
    if (!this.storage.getCookie('APPOINT_CLINICID')) {
      this.storage.setCookie('APPOINT_CLINICID', this.storage.getLocalStorage('CLINICID'))
    }
    this.getOrganCityList()
    this.getResourceList()
    this.createTimeLine()
    this.createDatePicker()
    this.setCurrentPatient()
    this.$bus.$off('appoint:error')
    this.$bus.$on('appoint:error', val => {
      this.$alert(val, {
        type: 'warning',
        title: '警告',
        confirmButtonText: '确定'
      })
    })
    this.$bus.$off('appoint:success')
    this.$bus.$on('appoint:success', (val, action) => {
      this.currentAppoint = ''
      this.isShowMore = false
      if (typeof val === 'object' && val.isSceneAppoint && action !== 'cancel') {
        this.print(val)
      }
      this.getAppointData()
    })
    this.$bus.$off('lock:success')
    this.$bus.$on('lock:success', val => {
      this.currentAppoint = ''
      this.isShowMore = false
      this.getAppointData()
    })
    this.$bus.$off('appoint:sendsms')
    this.$bus.$on('appoint:sendsms', val => {
      this.currentPatient = [val.patient]
      this.allparams = {
        msgType: 108, // 想要发动短信所属的大分类 必传
        deptId: val.deptId, // 默认科室，不传需要下拉选择 非必传
        ccMobiles: '', // 抄送人手机号 分号隔开'18618453594;18618453594;18618453594', 不传显示为空 非必传
        receivers: [
          {
            id: val.patientId,  // patientId 必传
            name: val.patientName,  // patientName 必传
            mobile: val.patientMobile,  // 手机号 必传 业务方决定用哪个手机号
            payload: {  // 短信内容数据，非必传
              docName: val.resourceName, // 医生姓名
              hosName: val.organName, // 医院姓名
              patientName: val.patientName, // 患者姓名
              // clinicName: val.providerName, // 诊室名称
              appointTime: `${this.$moment(val.date).format('MM-DD')} ${val.startTimeStr}`, // 预约时间
              visitTime: val.arrivalTime ? this.$moment(val.arrivalTime).format('MM-DD HH:mm') : this.$moment().format('MM-DD'), // 就诊时间
              appointDate: this.$moment(val.date).format('MM-DD'), // 预约日期
              appointStartTime: val.startTimeStr, // 预约开始时间
              appointEndTime: val.endTimeStr// 预约结束时间
            }
          }
        ]
      }
      if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
        this.$refs.sendmessage.sendVisible = true
      }
    })
    this.$bus.$on('appoint:edit', val => {
      this.currentAppoint = val
      this.isShowMore = false
    })
    this.$bus.$off('appoint:pay')
    this.$bus.$on('appoint:pay', val => {
      this.yzsobj.orderId = val.orderid || val.orderId
      this.yzsobj.patientid = val.patientid
      this.yzsobj.id = val.id
      this.yzsobj.accountbillId = val.accountbillId
      this.yzsobj.settleCode = val.settleCode
      this.yzsobj.unexefee = val.unexefee
      this.yzsobj.exefee = val.exefee
      this.yzsobj.totalFee = val.totalFee
      this.yzsobj.isRefund = val.isRefund
      this.yzsobj.visitNumber = val.visitNumber
      this.yzsobj.medInsurPubPayFee = val.medInsurPubPayFee
      this.yzsobj.medInsurOwnPayFee = val.medInsurOwnPayFee
      this.payVisible = true
      this.payAction = val.action
    })
    this.api.isOpenScene({key: 'SCENE_APPOINT_OPEN'}).then(rs => {
      this.isOpenScene = rs.data ? parseInt(rs.data) : false
    })
  },
  methods: {
    setIsEditMessage (val) {
      this.isEditMessage = val
    },
    handleScroll (e) {
      let X = e.target.scrollLeft
      let Y = e.target.scrollTop
      this.$refs.header.scrollLeft = X
      this.$refs.left.scrollTop = Y
    },
    getAppointPoint (date, beginTime, endTime, index, num, ground) {
      let start = new Date(date + ' ' + beginTime)
      let end = new Date(date + ' ' + endTime)
      let today = this.$moment(start).format('YYYY-MM-DD')
      let tobase = new Date(today + ' 07:00')
      let diffHeight = Math.ceil((end.getTime() - start.getTime()) / 1000 / 60) * 2
      let diffTop = Math.floor((start.getTime() - tobase.getTime()) / 1000 / 60) * 2
      let width = Math.floor(240 / num)
      let left = width * (ground - 1) + ground
      return {
        height: diffHeight + 'px',
        top: diffTop + 'px',
        left: left + 'px',
        width: width + 'px',
        zIndex: index + 100
      }
    },
    getlockPoint (lock, index) {
      let start = new Date(lock.lockDateStr + ' ' + lock.lockStartTimeStr)
      let end = new Date(lock.lockDateStr + ' ' + lock.lockEndTimeStr)
      let today = this.$moment(start).format('YYYY-MM-DD')
      let tobase = new Date(today + ' 07:00')
      let diffHeight = Math.ceil((end.getTime() - start.getTime()) / 1000 / 60) * 2
      let diffTop = Math.floor((start.getTime() - tobase.getTime()) / 1000 / 60) * 2
      let left = lock.asstAppoint ? 240 : 0
      let right = 0
      return {
        height: diffHeight + 'px',
        top: diffTop + 'px',
        left: left + 'px',
        right: right + 'px',
        zIndex: index + 200
      }
    },
    getCannelPoint (data, index) {
      let start = new Date(this.params.date + ' ' + data.minStartTimeStr)
      let end = new Date(this.params.date + ' ' + data.maxEndTimeStr)
      let today = this.$moment(start).format('YYYY-MM-DD')
      let tobase = new Date(today + ' 07:00')
      let diffHeight = Math.ceil((end.getTime() - start.getTime()) / 1000 / 60) * 2
      let diffTop = Math.floor((start.getTime() - tobase.getTime()) / 1000 / 60) * 2
      let left = 250
      let right = 0
      return {
        height: diffHeight + 'px',
        top: diffTop + 'px',
        left: left + 'px',
        right: right + 'px',
        zIndex: index + 300
      }
    },
    getRedTimeStyle () {
      if (!this.$refs.blacktable) {
        return ''
      }
      let today = this.$moment(start).format('YYYY-MM-DD')
      let tobase = new Date(today + ' 07:00')
      let start = new Date()
      let diffTop = Math.floor((start.getTime() - tobase.getTime()) / 1000 / 60) * 2
      return {
        width: this.$refs.blacktable.scrollWidth + 'px',
        top: diffTop + 'px'
      }
    },
    createTimeTrunkIndex (start, end) {
      let startTime = Math.ceil((start.split(':')[0] * 60 + parseInt(start.split(':')[1])) / 10) * 10
      let endTime = Math.ceil((end.split(':')[0] * 60 + parseInt(end.split(':')[1])) / 10) * 10
      let startIndex = (startTime - 420) / 10
      let endIndex = (endTime - 420) / 10
      let arrIndex = []
      for (let i = startIndex; i < endIndex; i++) {
        arrIndex.push(i)
      }
      return arrIndex
    },
    createTimeLine () {
      let beginTime = this.$moment('2019-01-01 07:00')
      for (let i = 0; i < 102; i++) {
        let time = beginTime.add(10, 'm')
        if ((i + 1) % 6 === 0) {
          this.timeLine.push({isIntNumber: true, time: time.format('HH:mm'), value: time.format('HH:mm')})
        } else {
          this.timeLine.push({isIntNumber: false, time: time.format('mm'), value: time.format('HH:mm')})
        }
      }
    },
    getOrgList () {
      let APPOINT_CLINICID = this.storage.getCookie('APPOINT_CLINICID')
      let CLINICID = this.storage.getLocalStorage('CLINICID')
      this.api.getOrgList({
        outOrgGetOrgListByConditionReqDTO: {
          cityCodeList: [this.selectCity.cityCode],
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          type1CodeList: ['01'],
          type2CodeList: ['01.02', '01.03']
        }
      }).then(rs => {
        this.orgItemList = rs.data.resultList
        if (APPOINT_CLINICID) {
          let item = this.orgItemList.filter(item => {
            return item.id === APPOINT_CLINICID
          })[0]
          this.selectOrgan = item || this.orgItemList[0]
        } else if (CLINICID) {
          let item = this.orgItemList.filter(item => {
            return item.id === CLINICID
          })[0]
          this.selectOrgan = item || this.orgItemList[0]
        } else {
          this.selectOrgan = this.orgItemList[0]
        }
      })
    },
    getResourceList () {
      this.api.getResourceList({
        tenantSubjectIdList: this.params.deptIds,
        typeCodeList: ['DOCTOR'],
        orgIdList: this.params.organId ? [this.params.organId] : [this.storage.getLocalStorage('CLINICID')]
      }).then(rs => {
        this.doctorList = rs.data.resultList
      })
    },
    setCurrentCity () {
      const APPOINT_CLINICID = this.storage.getCookie('APPOINT_CLINICID')
      this.api.getOrgInfo({idList: APPOINT_CLINICID ? [APPOINT_CLINICID] : []}).then(rs => {
        if (rs.data && rs.data[0]) {
          this.selectCity = {
            cityCode: rs.data[0].cityCode,
            cityName: rs.data[0].cityName
          }
        }
      })
    },
    setCurrentPatient () {
      if (this.$route.query.patientId) {
        this.api.getPatientInfo({patientId: this.$route.query.patientId}).then(rs => {
          this.patient = rs.data
        })
      }
    },
    changeCity () {
      this.params.deptIds = []
      this.params.resourceIds = []
    },
    changeOrgan () {
      this.params.deptIds = []
      this.params.resourceIds = []
    },
    changeDept () {
      this.params.resourceIds = []
    },
    getAppointData () {
      this.api.getAppointList(this.params).then(rs => {
        this.appointDeptList = []
        this.appointServiceList = []
        this.list = []
        this.selectPoint = []
        this.appointList = rs.data
        this.appointList.map(item => {
          this.appointDeptList = this.appointDeptList.concat(item.deptDayApptsVOS)
        })
        this.appointDeptList.map(item => {
          item.everyDoctorDayApptsVOS.map(doctor => {
            this.appointServiceList = this.appointServiceList.concat(doctor.everyServiceDayApptsVOS)
          })
        })
        this.appointServiceList.map(item => {
          let arr = []
          if (item.arrangeTimerangeVOS) {
            item.arrangeTimerangeVOS.map(rs => {
              arr = arr.concat(this.createTimeTrunkIndex(rs.startTime, rs.endTime))
            })
          }
          if (item.overlapAppointmentList) {
            item.overlapAppointmentList.map((appoints, a) => {
              if (appoints.appointmentVOList.length < 10) {
                appoints.appointmentVOList.map((appoint, b) => {
                  appoint.point = this.getAppointPoint(appoint.dateStr, appoint.startTimeStr, appoint.endTimeStr, a, appoints.appointmentVOList.length, b + 1)
                  return appoint
                })
              } else {
                appoints.point = this.getAppointPoint(this.params.date, appoints.minStartTimeStr, appoints.maxEndTimeStr, a, 1, 1)
              }
              return appoints
            })
          }
          item.timeTrunkTimeIndexs = arr
          this.selectPoint.push({
            top: 0,
            height: 0,
            display: false
          })
          return item
        })
        this.$nextTick(_ => {
          this.redLineStyle = this.getRedTimeStyle()
          if (!this.$refs.blacktable) {
            window.clearInterval(loop)
          }
          let loop = setInterval(_ => {
            this.redLineStyle = this.getRedTimeStyle()
          }, 60000)
        })
      })
    },
    hidePopover () {
      if (!this.$route.query.patientId) {
        this.patient = ''
        this.patientName = ''
      }
      this.isShowSelectPaitent = false
    },
    closePopover () {
      setTimeout(() => {
        this.selectPoint[this.startPoint.Z].height = 0
        this.selectPoint[this.startPoint.Z].top = 0
        this.selectPoint[this.startPoint.Z].display = false
      }, 50)
    },
    checkPatient (val) {
      if (!val) {
        return false
      }
      this.patientName = val
    },
    resetPatient (val) {
      this.isShowSelectPaitent = false
      this.patient = ''
      this.patientName = ''
    },
    resetPannel () {
      this.params.deptIds = []
      this.params.resourceIds = []
      this.resetPatient()
    },
    selectPatient (val) {
      this.patient = val
    },
    createDatePicker () {
      let arr = []
      let today = this.$moment()
      let perday = today.add(-1, 'd')
      arr.push({
        date: perday.format('MM-DD'),
        week: this.weekdays[perday.weekday()],
        value: perday.format('YYYY-MM-DD')
      })
      for (let i = 0; i < 10; i++) {
        let day = today.add(1, 'd')
        arr.push({
          date: day.format('MM-DD'),
          week: this.weekdays[day.weekday()],
          value: day.format('YYYY-MM-DD')
        })
      }
      this.datePicker = arr
    },
    setCurrentDate (val) {
      if (this.isEditMessage) {
        this.$messageTips(this, 'warning', '请先保存今日看板的内容后再进行日期切换操作', '提示')
      } else {
        this.params.date = val
      }
    },
    getOrganCityList () {
      this.api.getOrganCity().then(rs => {
        this.orgCityList = rs.data
        this.setCurrentCity()
      })
    },
    setCurrentMore (val, type) {
      this.moreType = type
      this.currentMore = val
      this.isShowMore = true
    },
    resetDrawArea (val) {
      if (val && val.startTime && val.timeLength) {
        try {
          let _top = ((parseInt(val.startTime.split(':')[0]) - 7) * 60 + parseInt(val.startTime.split(':')[1])) * 2
          let _height = val.timeLength * 2
          this.selectPoint[this.startPoint.Z].height = _height + 'px'
          this.selectPoint[this.startPoint.Z].top = _top + 'px'
          this.selectPoint[this.startPoint.Z].timeLen = val.timeLength
          this.selectPoint[this.startPoint.Z].startTime = val.startTime
        } catch (e) {
          console.log(e)
        }
      }
    },
    cannelEditModel () {
      this.currentAppoint = ''
      this.$bus.$emit('appoint:showinfo', true)
    },
    getDaysSpanLen (items) {
      let len = 0
      items.map(item => {
        item.everyDoctorDayApptsVOS.map(doctor => {
          len += doctor.everyServiceDayApptsVOS.length
        })
      })
      return len
    },
    getDeptSpanLen (items) {
      let len = 0
      items.map(item => {
        len += item.everyServiceDayApptsVOS.length
      })
      return len
    },
    getResourceSpanLen (items) {
      return items.length
    },
    payStatus (val) {
      this.$bus.$emit('pay:success', this.payAction)
    },
    closePayDialog () {
      this.payVisible = false
      this.$bus.$emit('appoint:success', true)
    },
    print (val) {
      let params = {queryApptNum: true}
      if (val.visitNumber) {
        params.visitNumber = val.visitNumber
      }
      if (val.patientId) {
        params.patientId = val.patientId
      }
      if (this.yzsobj.settleCode) {
        params.id = this.yzsobj.settleCode
      }
      if (this.yzsobj.orderId) {
        params.orderId = this.yzsobj.orderId
      }
      everprint('registform', params, {
        preview: true,
        cb: _ => {
          console.log('打印完成')
        }
      })
    }
  },
  directives: {
    drag: {
      bind (el, val, vnode) {
        let dom = el
        let _this = vnode.context
        dom.onmousedown = (e) => {
          e.stopPropagation()
          e.preventDefault()
          let _top = parseInt(_this.selectPoint[val.value].top)
          let _height = parseInt(_this.selectPoint[val.value].height)
          let pageY = e.pageY
          document.onmousemove = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _diff = e.pageY - pageY
            if (pageY === e.pageY) {
              return false
            }
            let _difftop = _top + _diff
            if (_difftop < 0) {
              _difftop = 0
            } else if (_difftop > dom.offsetParent.offsetHeight - _height) {
              _difftop = dom.offsetParent.offsetHeight - _height
            }
            _this.selectPoint[val.value].display = false
            _this.selectPoint[val.value].top = _difftop + 'px'
          }
          document.onmouseup = (e) => {
            e.stopPropagation()
            e.preventDefault()
            document.onmousemove = null
            document.onmouseup = null
            let _diff = e.pageY - pageY
            if (pageY === e.pageY) {
              return false
            }
            let _difftop = _top + _diff
            if (_difftop < 0) {
              _difftop = 0
            } else if (_difftop > dom.offsetParent.offsetHeight - _height) {
              _difftop = dom.offsetParent.offsetHeight - _height
            }
            _this.selectPoint[val.value].top = _difftop + 'px'
            _this.selectPoint[val.value].startTime = _this.$moment('2019-01-01 07:00').add(Math.ceil(_difftop / 2), 'm').format('HH:mm')
            _this.isClick = false
            _this.selectPoint[val.value].display = true
            _this.selectPoint[val.value].type = 1
          }
        }
      }
    },
    select: {
      bind (el, val, vnode) {
        let _this = vnode.context
        let dom = el
        dom.onmousedown = (e) => {
          e.stopPropagation()
          e.preventDefault()
          if (e.target.className !== 'drawcol') {
            return false
          }
          if (_this.startPoint) {
            _this.selectPoint[_this.startPoint.Z].height = 0
            _this.selectPoint[_this.startPoint.Z].top = 0
            _this.selectPoint[_this.startPoint.Z].display = false
            _this.selectPoint[_this.startPoint.Z].type = 0
          }
          _this.isDown = true
          let point = {
            X: e.offsetX,
            Y: e.offsetY,
            Z: val.value
          }
          _this.startPoint = point
          document.onmousemove = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _height
            let _top
            if (e.target.className === 'drawcol') {
              _top = point.Y < e.offsetY ? point.Y : e.offsetY
              _height = Math.abs(e.offsetY - point.Y) > 0 ? Math.abs(e.offsetY - point.Y) : 20
            } else if (e.target.className === 'block') {
              _height = point.Y
              _top = 0
            } else if (e.target.className === 'drawtd') {
              _top = point.Y
              _height = dom.offsetHeight - point.Y
            }
            _this.selectPoint[val.value].height = _height + 'px'
            _this.selectPoint[val.value].top = _top + 'px'
          }
          document.onmouseup = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _height
            let _top
            if (e.target.className === 'drawcol') {
              _top = point.Y < e.offsetY ? point.Y : e.offsetY
              _height = Math.abs(e.offsetY - point.Y) > 0 ? Math.abs(e.offsetY - point.Y) : 20
            } else if (e.target.className === 'block') {
              _height = point.Y
              _top = 0
            } else if (e.target.className === 'drawtd') {
              _top = point.Y
              _height = dom.offsetHeight - point.Y
            }
            _this.isDown = false
            _this.isClick = e.offsetY === point.Y
            _this.selectPoint[val.value].height = _height + 'px'
            _this.selectPoint[val.value].top = _top + 'px'
            _this.selectPoint[val.value].display = true
            _this.selectPoint[val.value].type = 0
            _this.selectPoint[val.value].timeLen = Math.floor(_height / 2)
            _this.selectPoint[val.value].startTime = _this.$moment('2019-01-01 07:00').add(Math.ceil(_top / 2), 'm').format('HH:mm')
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    },
    drawhead: {
      bind (el, val, vnode) {
        let dom = el
        let _this = vnode.context
        dom.onmousedown = (e) => {
          e.stopPropagation()
          e.preventDefault()
          let _top = parseInt(_this.selectPoint[val.value].top)
          let _height = parseInt(_this.selectPoint[val.value].height)
          let pageY = e.pageY
          document.onmousemove = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _diff = e.pageY - pageY
            let _diffheight = _height - _diff
            let _difftop = _top + _diff
            _this.selectPoint[val.value].display = false
            _this.selectPoint[val.value].top = _difftop + 'px'
            _this.selectPoint[val.value].height = _diffheight + 'px'
          }
          document.onmouseup = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _diff = e.pageY - pageY
            let _diffheight = _height - _diff
            let _difftop = _top + _diff
            if (pageY !== e.pageY) {
              _this.selectPoint[val.value].top = _difftop + 'px'
              _this.selectPoint[val.value].timeLen = Math.floor(_diffheight / 2)
              _this.selectPoint[val.value].startTime = _this.$moment('2019-01-01 07:00').add(Math.ceil(_difftop / 2), 'm').format('HH:mm')
              _this.selectPoint[val.value].display = true
              _this.selectPoint[val.value].type = 1
            }
            _this.isClick = false
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    },
    drawfoot: {
      bind (el, val, vnode) {
        let dom = el
        let _this = vnode.context
        dom.onmousedown = (e) => {
          e.stopPropagation()
          e.preventDefault()
          let _height = parseInt(_this.selectPoint[val.value].height)
          let pageY = e.pageY
          document.onmousemove = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _diff = e.pageY - pageY
            let _diffheight = _height + _diff
            _this.selectPoint[val.value].display = false
            _this.selectPoint[val.value].height = _diffheight + 'px'
          }
          document.onmouseup = (e) => {
            e.stopPropagation()
            e.preventDefault()
            let _diff = e.pageY - pageY
            let _diffheight = _height + _diff
            if (pageY !== e.pageY) {
              _this.selectPoint[val.value].timeLen = Math.floor(_diffheight / 2)
              _this.selectPoint[val.value].display = true
              _this.selectPoint[val.value].type = 1
            }
            _this.isClick = false
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  components: {
    addappoint,
    appointmore,
    lockinfo,
    selectPatient,
    dialogDoctor,
    dialogDept,
    appointinfo,
    todoEditor,
    sendMessage2
  }
}
</script>
<style scoped>
  .el-popover{padding: 20px;}
  #appointheader {padding: 20px;background: #ffffff;}
  #appointheader .fl{margin-left: 10px;}
  #appointpanel {position: relative; background: #fff; overflow: hidden;}
  .maintable{left: 71px; width: calc(100% - 71px); height: calc(100vh - 247px); overflow: scroll; position: relative;}
  .mainheader{position: relative; width: calc(100% - 89px); left: 71px; overflow: hidden;}
  .mainheader table tr td.deepblue{background: #1c7bef; color: #fff;}
  .lefttime{position: absolute; left: 0; top: 81px; height: calc(100vh - 227px);; overflow-y: hidden; z-index: 999; border-bottom:  1px solid #ddd; border-left:  1px solid #ddd; border-right: 1px solid #ddd;}
  #appointpanel table {box-sizing: border-box;table-layout: fixed;border-collapse: collapse;border-spacing: 0; }
  .blackarea table{border-bottom: 1px solid #ddd;}
  .blackarea table tr td{width: 259px; min-width: 259px; height: 19px; padding: 0; border-bottom: 1px dotted #ddd; border-right: 1px solid #999; background: #ededed; position: relative;}
  .blackarea table tr td.white {background: #ffffff; opacity: 0}
  .blackarea table tr td.blue {background: #1c7bef; opacity: 0.16}
  .blackarea table tr.line td{border-bottom-style: solid; border-bottom-color: #bbb;}
  .lefttime table tr td {width: 70px; height: 20px; padding: 0;  background: #fff; text-align: right; position: relative;}
  .lefttime table tr td span{display: block; height: 20px; line-height: 20px; padding-right: 5px; font-size: 14px; color: #333; font-weight: bold;}
  .lefttime table tr td span.small {font-size: 12px; color: #666; font-weight: normal;}

  .mainheader table tr td{width: 259px; min-width: 259px; height: 30px; padding: 0; border-right: 1px solid #ddd; border-bottom: 1px solid #D0DBE4; border-top: 1px solid #ddd; background: #DCE5F0;;}
  .mainheader table tr td .block{padding: 0 5px; font-size: 14px;}
  .mainheader table tr td.gray{background: #F0F5FA; border-color: #D0DBE4;}
  .lefttop{position: absolute; left: 0; top: 0;}
  .righttop{position: absolute; right: 0; top: 0; width: 17px; height: 61px; background: #DCE5F0; border-left: 1px solid #ddd; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;} 
  .lefttop table {border-top: 1px solid #ddd; border-left: 1px solid #ddd;}
  .lefttop table tr td{width: 70px; height: 30px; line-height: 30px; padding: 0; border-bottom: 1px solid #ddd; border-right: 1px solid #D0DBE4; background: #DCE5F0; color: #000;}
  .drawarea{display: block; position: absolute; left: 0; top: 0; height: 2060px;}
  .drawarea table{height: 100%;}
  .drawarea table tr td {width: 260px; min-width: 260px; padding: 0; height: 100%; vertical-align: top;}
  .drawcol {position: relative; padding: 0; height: calc(100% - 21px);}
  .appoint{position: absolute;  border-radius: 1px; background: rgba(67,134,45,0.2); overflow: hidden;}
  .appoint .info {padding: 2px 5px; border-top: 2px solid #5EAA45; color: #5EAA45; font-size: 12px; overflow: hidden; height: 100%; border-radius: 1px;}
  .appoint .confirm {background: rgb(94, 170, 69, 0.8); color: #fff;}
  .appoint .info strong{width: 259px; display: block;}
  .appoint .info p{margin: 5px 0; line-height: 1.5;}
  .appoint .info i {display: block; font-style: normal; border: 1px solid #fff; width: 16px; height: 16px; line-height: 16px; font-size: 12px; border-radius: 50%; position: absolute; right: 1px; top: 1px; text-align: center; }
  .appoint .info i.bao {right: 21px;}
  .appointlock {position: absolute;  border-radius: 1px; background:  rgb(0, 0, 0, 0.6); overflow: hidden;}
  .appointlock .info {padding: 3px 5px; font-size: 12px; color: #fff; position: relative;}
  .appointlock .info .iconfont {font-size: 12px; font-weight: normal;}
  .appointlock .info strong{width: 259px; display: block; }
  .appointlock .info p{margin: 5px 0; line-height: 1.5;}

  .appointcannel {position: absolute;  border-radius: 1px; background: rgba(255, 200, 200, 1); overflow: hidden; cursor: pointer;}

  .drawblock {display:block; position: absolute; background: #1c7bef; opacity: 0.3; border-radius: 1px; left: 0; right: 0; z-index: 999; cursor: -webkit-grab;}
  .drawblock .foot {height: 4px; position: absolute; left: 0; bottom: 0; right: 0; z-index: 999; cursor: row-resize; display: none;}
  .drawblock .head {height: 4px; position: absolute; left: 0; top: 0; right: 0; z-index: 999; cursor: row-resize; display: none;}
  .drawblock:hover .head,
  .drawblock:hover .foot{display: block}
  .datepicker {width: 530px;}
  .datepicker span{display: inline-block; width: 36px; height: 36px; border:1px solid #DCE5F0; border-radius: 3px; font-size: 12px; text-align: center; line-height: 1.5; margin-left: 8px; cursor: pointer;}
  .datepicker span.today{background: #F0F5FA; color: #000;}
  .datepicker span.on{background: #1c7bef; color: #fff;}
  .appointhack {display: block; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; cursor: pointer;}
  .mypop {padding: 0;}
  .style-0 {background: rgba(135, 3, 218,0.2);}
  .style-0 .info {border-color: rgba(135, 3, 218); color: rgba(135, 3, 218);}
  .style-0 .confirm {background: rgba(135, 3, 218, 0.8); color: #fff;}

  .style-1 {background: rgba(3, 18, 218,0.2);}
  .style-1 .info {border-color: rgba(3, 18, 218); color: rgba(3, 18, 218);}
  .style-1 .confirm {background: rgba(3, 18, 218, 0.8); color: #fff;}

  .style-2 {background: rgba(160, 91, 0,0.2);}
  .style-2 .info {border-color: rgba(160, 91, 0); color: rgba(160, 91, 0);}
  .style-2 .confirm {background: rgba(160, 91, 0, 0.8); color: #fff;}

  .style-3 {background: rgba(15, 146, 189,0.2);}
  .style-3 .info {border-color: rgba(15, 146, 189); color: rgba(15, 146, 189);}
  .style-3 .confirm {background: rgba(15, 146, 189, 0.8); color: #fff;}

  .style-4 {background: rgba(94, 170, 69,0.2);}
  .style-4 .info {border-color: rgba(94, 170, 69); color: rgba(94, 170, 69);}
  .style-4 .confirm {background: rgba(94, 170, 69, 0.8); color: #fff;}
  .current-time-line {position: absolute; height: 1px; left: 0; background: red;}
  .editmodel {position: fixed; top: 0; left: 0; right: 0; height: 50px; line-height: 50px; background: #FFD657; font-size: 25px; text-align: center; z-index: 2001;}
  .editmodel .el-button {position: relative; top: -4px;}
  @media screen and (max-width: 1900px) {
    .hide {
      display: none;
    }
  }
</style>
